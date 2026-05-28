type LogicAnswer = {
  id: string;
  user_id: string;
  username: string;
  test_name: string;
  question_number: number;
  question_text: string;
  answer_text: string;
};

type AiGrade = {
  score: number;
  feedback: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

function clampScore(value: unknown) {
  const score = Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.min(Math.max(score, 0), 5);
}

function extractOutputText(response: any) {
  if (typeof response?.output_text === "string") return response.output_text;

  return (response?.output || [])
    .flatMap((item: any) => item?.content || [])
    .map((content: any) => content?.text || "")
    .join("")
    .trim();
}

async function getCurrentUser(supabaseUrl: string, anonKey: string, authHeader: string) {
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    throw new Error("Authentication required");
  }

  return await response.json();
}

async function fetchLogicAnswers(
  supabaseUrl: string,
  anonKey: string,
  authHeader: string,
  userId: string,
  testName: string,
) {
  const params = new URLSearchParams({
    select: "id,user_id,username,test_name,question_number,question_text,answer_text",
    user_id: `eq.${userId}`,
    test_name: `eq.${testName}`,
    order: "question_number.asc",
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/logic_answers?${params.toString()}`, {
    headers: {
      apikey: anonKey,
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load logic answers: ${await response.text()}`);
  }

  return await response.json() as LogicAnswer[];
}

async function gradeAnswer(openAiKey: string, answer: LogicAnswer): Promise<AiGrade> {
  const trimmedAnswer = (answer.answer_text || "").trim();

  if (!trimmedAnswer) {
    return {
      score: 0,
      feedback: "Ответ не заполнен, поэтому логика и полнота не могут быть оценены.",
    };
  }

  const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions:
        "You are a strict but fair IT networking instructor. Grade the student's Russian answer to a logic question. Evaluate correctness, completeness, troubleshooting logic, and clarity. Return only structured JSON.",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                `Question ${answer.question_number}: ${answer.question_text}`,
                `Student answer: ${trimmedAnswer}`,
                "Grade from 0 to 5. 0 means missing/wrong, 5 means complete and technically sound. Partial scores like 3.5 are allowed.",
              ].join("\n"),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "logic_answer_grade",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              score: {
                type: "number",
                minimum: 0,
                maximum: 5,
              },
              feedback: {
                type: "string",
                minLength: 1,
                maxLength: 400,
              },
            },
            required: ["score", "feedback"],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI grading failed: ${await response.text()}`);
  }

  const payload = await response.json();
  const parsed = JSON.parse(extractOutputText(payload));

  return {
    score: clampScore(parsed.score),
    feedback: String(parsed.feedback || "AI feedback unavailable.").slice(0, 400),
  };
}

async function saveReview(
  supabaseUrl: string,
  anonKey: string,
  authHeader: string,
  answer: LogicAnswer,
  grade: AiGrade,
) {
  const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/apply_logic_ai_review`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_logic_answer_id: answer.id,
      p_ai_score: grade.score,
      p_ai_feedback: grade.feedback,
      p_model: model,
      p_raw_response: grade,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save AI review: ${await response.text()}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    const authHeader = request.headers.get("Authorization");

    if (!supabaseUrl || !anonKey || !openAiKey) {
      return jsonResponse({ error: "Missing Edge Function environment variables." }, 500);
    }

    if (!authHeader) {
      return jsonResponse({ error: "Authentication required." }, 401);
    }

    const body = await request.json().catch(() => ({}));
    const testName = body.testName || "Первый тест";
    const user = await getCurrentUser(supabaseUrl, anonKey, authHeader);
    const answers = await fetchLogicAnswers(supabaseUrl, anonKey, authHeader, user.id, testName);

    if (answers.length !== 10) {
      return jsonResponse({ error: "Exactly 10 logic answers are required before AI grading." }, 400);
    }

    const reviews = [];

    for (const answer of answers) {
      const grade = await gradeAnswer(openAiKey, answer);
      reviews.push(await saveReview(supabaseUrl, anonKey, authHeader, answer, grade));
    }

    const totalScore = reviews.reduce((sum, review) => sum + Number(review?.ai_score || 0), 0);
    const xpAwarded = reviews.reduce((sum, review) => sum + Number(review?.xp_awarded || 0), 0);
    const ratingAwarded = reviews.reduce((sum, review) => sum + Number(review?.rating_awarded || 0), 0);

    return jsonResponse({
      status: "completed",
      reviews,
      totalScore,
      maxScore: reviews.length * 5,
      xpAwarded,
      ratingAwarded,
    });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unknown AI grading error." }, 500);
  }
});

const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");
const cards = document.querySelectorAll(".card, .course");
const backBtn = document.querySelector(".back");

const registerForm = document.getElementById("registerForm");
const usersList = document.getElementById("usersList");
const registerMessage = document.getElementById("registerMessage");

const lessons = {
  domain: {
    title: "Работа с доменом",
    text: "В этом разделе будет обучение по созданию домена: настройка Windows Server, установка Active Directory, DNS, DHCP, создание пользователей и подключение клиентских компьютеров к домену."
  },
  mikrotik: {
    title: "MikroTik",
    text: "В этом разделе будет обучение по MikroTik: настройка IP-адресов, DHCP, NAT, firewall, маршрутизация и базовая защита сети."
  },
  server: {
    title: "Windows Server",
    text: "Здесь будет обучение по Windows Server: роли сервера, DNS, DHCP, GPO, управление пользователями, группами и компьютерами."
  },
  security: {
    title: "Security",
    text: "Здесь будет обучение по безопасности: права пользователей, пароли, доступы, защита сети, firewall и базовые правила администрирования."
  }
};

function getUsers() {
  return JSON.parse(localStorage.getItem("greenYUsers")) || [];
}

function saveUsers(users) {
  localStorage.setItem("greenYUsers", JSON.stringify(users));
}

function renderUsers() {
  const users = getUsers();
  const results = getTestResults();

  usersList.innerHTML = "";

  const usersWithStats = users.map(user => {
    const userResult = results.find(result => result.username === user.username && result.testId === "first-test");

    return {
      username: user.username,
      password: user.password,
      percent: userResult ? userResult.percent : 0,
      correct: userResult ? userResult.correct : 0,
      wrong: userResult ? userResult.wrong : 0,
      date: userResult ? userResult.date : "Not passed"
    };
  });

  usersWithStats.sort((a, b) => b.percent - a.percent);

  usersWithStats.forEach((user, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.username}</td>
      <td>${user.password}</td>
      <td>${user.percent}%</td>
      <td>${user.correct}</td>
      <td>${user.wrong}</td>
      <td>${user.date}</td>
    `;

    usersList.appendChild(row);
  });
}       


menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const pageId = item.dataset.page;

    menuItems.forEach(btn => btn.classList.remove("active"));
    item.classList.add("active");

    pages.forEach(page => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");

    if (pageId === "users") {
      renderUsers();
    }
  });
});

cards.forEach(card => {
  card.addEventListener("click", () => {
    const topic = card.dataset.topic;
    if (!topic) return;

    pages.forEach(page => page.classList.remove("active"));

    document.getElementById("lessonTitle").textContent = lessons[topic].title;
    document.getElementById("lessonText").textContent = lessons[topic].text;

    document.getElementById("lesson").classList.add("active");
  });
});

backBtn.addEventListener("click", () => {
  pages.forEach(page => page.classList.remove("active"));
  document.getElementById("home").classList.add("active");
});

registerForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    registerMessage.textContent = "Please fill in all fields.";
    return;
  }

  const users = getUsers();

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    registerMessage.textContent = "This username already exists.";
    return;
  }

  users.push({
    username: username,
    password: password
  });

  saveUsers(users);

  registerMessage.textContent = "User registered successfully!";
  registerForm.reset();
  renderUsers();
});

renderUsers();
const discussionTabsContainer = document.querySelector(".discussion-tabs");
const commentUser = document.getElementById("commentUser");
const commentText = document.getElementById("commentText");
const sendComment = document.getElementById("sendComment");
const commentsList = document.getElementById("commentsList");

const newTopicInput = document.getElementById("newTopicInput");
const addTopicBtn = document.getElementById("addTopicBtn");

let activeDiscussionTopic = "domain";

const defaultTopics = [
  { id: "domain", name: "Domain" },
  { id: "mikrotik", name: "MikroTik" },
  { id: "server", name: "Windows Server" },
  { id: "security", name: "Security" }
];

function getTopics() {
  const savedTopics = JSON.parse(localStorage.getItem("greenYTopics"));

  if (!savedTopics) {
    localStorage.setItem("greenYTopics", JSON.stringify(defaultTopics));
    return defaultTopics;
  }

  return savedTopics;
}

function saveTopics(topics) {
  localStorage.setItem("greenYTopics", JSON.stringify(topics));
}

function createTopicId(topicName) {
  return topicName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zа-яё0-9-]/gi, "");
}

function renderTopics() {
  const topics = getTopics();

  discussionTabsContainer.innerHTML = "";

  topics.forEach(topic => {
    const button = document.createElement("button");
    button.className = "discussion-tab";
    button.textContent = topic.name;
    button.dataset.topic = topic.id;

    if (topic.id === activeDiscussionTopic) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      activeDiscussionTopic = topic.id;
      renderTopics();
      renderComments();
    });

    discussionTabsContainer.appendChild(button);
  });
}

function getComments() {
  return JSON.parse(localStorage.getItem("greenYComments")) || [];
}

function saveComments(comments) {
  localStorage.setItem("greenYComments", JSON.stringify(comments));
}

function renderComments() {
  const comments = getComments().filter(comment => comment.topic === activeDiscussionTopic);

  commentsList.innerHTML = "";

  if (comments.length === 0) {
    commentsList.innerHTML = `<p>No comments yet. Be the first to write something.</p>`;
    return;
  }

  comments.forEach(comment => {
    const card = document.createElement("div");
    card.classList.add("comment-card");

    card.innerHTML = `
      <h3>${comment.username}</h3>
      <p>${comment.text}</p>
      <small>${comment.date}</small>
    `;

    commentsList.appendChild(card);
  });
}

addTopicBtn.addEventListener("click", () => {
  const topicName = newTopicInput.value.trim();

  if (!topicName) {
    alert("Write topic name.");
    return;
  }

  const topics = getTopics();
  const topicId = createTopicId(topicName);

  const exists = topics.some(topic => topic.id === topicId);

  if (exists) {
    alert("This topic already exists.");
    return;
  }

  topics.push({
    id: topicId,
    name: topicName
  });

  saveTopics(topics);

  activeDiscussionTopic = topicId;
  newTopicInput.value = "";

  renderTopics();
  renderComments();
});

sendComment.addEventListener("click", () => {
  const username = commentUser.value.trim();
  const text = commentText.value.trim();

  if (!username || !text) {
    alert("Enter username and comment.");
    return;
  }

  const comments = getComments();

  comments.push({
    topic: activeDiscussionTopic,
    username: username,
    text: text,
    date: new Date().toLocaleString()
  });

  saveComments(comments);

  commentText.value = "";
  renderComments();
});

renderTopics();
renderComments();
const languageSelect = document.getElementById("languageSelect");
const bellBtn = document.getElementById("bellBtn");
const notificationCount = document.getElementById("notificationCount");
const notificationsList = document.getElementById("notificationsList");
const sendAdminMessage = document.getElementById("sendAdminMessage");
const adminMessageInput = document.getElementById("adminMessageInput");

const profileBtn = document.getElementById("profileBtn");
const profileUsername = document.getElementById("profileUsername");
const profilePassword = document.getElementById("profilePassword");
const profileRating = document.getElementById("profileRating");

const burgerBtn = document.getElementById("burgerBtn");
const burgerMenu = document.getElementById("burgerMenu");
const menuSearch = document.getElementById("menuSearch");
const menuHome = document.getElementById("menuHome");
const menuLogout = document.getElementById("menuLogout");

const translations = {
  en: {
    home: "Home",
    progress: "Progress",
    tech: "Tech Moments",
    classes: "Classes",
    tests: "Tests",
    settings: "Settings",
    unfinishedCourses: "Your unfinished courses",
    allInfo: "All Informations",
    techMoments: "Tech Moments",
    techSubtitle: "Discuss technical topics, ask questions and leave comments."
  },
  ru: {
    home: "Главная",
    progress: "Прогресс",
    tech: "Тех. моменты",
    classes: "Классы",
    tests: "Тесты",
    settings: "Настройки",
    unfinishedCourses: "Ваши незавершённые курсы",
    allInfo: "Вся информация",
    techMoments: "Тех. моменты",
    techSubtitle: "Обсуждайте технические темы, задавайте вопросы и оставляйте комментарии."
  },
  uk: {
    home: "Головна",
    progress: "Прогрес",
    tech: "Тех. моменти",
    classes: "Класи",
    tests: "Тести",
    settings: "Налаштування",
    unfinishedCourses: "Ваші незавершені курси",
    allInfo: "Уся інформація",
    techMoments: "Тех. моменти",
    techSubtitle: "Обговорюйте технічні теми, ставте питання та залишайте коментарі."
  },
  es: {
    home: "Inicio",
    progress: "Progreso",
    tech: "Momentos técnicos",
    classes: "Clases",
    tests: "Pruebas",
    settings: "Configuración",
    unfinishedCourses: "Tus cursos sin terminar",
    allInfo: "Toda la información",
    techMoments: "Momentos técnicos",
    techSubtitle: "Discute temas técnicos, haz preguntas y deja comentarios."
  }
};

function showPage(pageId) {
  pages.forEach(page => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

function getAdminMessages() {
  return JSON.parse(localStorage.getItem("greenYAdminMessages")) || [];
}

function saveAdminMessages(messages) {
  localStorage.setItem("greenYAdminMessages", JSON.stringify(messages));
}

function renderNotifications() {
  const messages = getAdminMessages();

  notificationsList.innerHTML = "";

  if (messages.length === 0) {
    notificationsList.innerHTML = "<p>No notifications yet.</p>";
    return;
  }

  messages.forEach(message => {
    const card = document.createElement("div");
    card.className = "notification-card";

    card.innerHTML = `
      <h3>Admin</h3>
      <p>${message.text}</p>
      <small>${message.date}</small>
    `;

    notificationsList.appendChild(card);
  });
}

function updateNotificationCount() {
  const messages = getAdminMessages();
  const unread = Number(localStorage.getItem("greenYUnreadMessages")) || 0;

  if (unread > 0) {
    notificationCount.style.display = "inline-block";
    notificationCount.textContent = unread;
  } else {
    notificationCount.style.display = "none";
  }
}

sendAdminMessage.addEventListener("click", () => {
  const text = adminMessageInput.value.trim();

  if (!text) {
    alert("Write message.");
    return;
  }

  const messages = getAdminMessages();

  messages.unshift({
    text,
    date: new Date().toLocaleString()
  });

  saveAdminMessages(messages);

  const unread = Number(localStorage.getItem("greenYUnreadMessages")) || 0;
  localStorage.setItem("greenYUnreadMessages", unread + 1);

  adminMessageInput.value = "";
  renderNotifications();
  updateNotificationCount();
});

bellBtn.addEventListener("click", () => {
  showPage("notifications");
  localStorage.setItem("greenYUnreadMessages", 0);
  updateNotificationCount();
  renderNotifications();
});

profileBtn.addEventListener("click", () => {
  const users = getUsers();

  const currentUser = users[users.length - 1];

  if (!currentUser) {
    profileUsername.textContent = "Guest";
    profilePassword.textContent = "---";
    profileRating.textContent = "---";
  } else {
    profileUsername.textContent = currentUser.username;
    profilePassword.textContent = currentUser.password;
    profileRating.textContent = users.length;
  }

  showPage("profile");
});

burgerBtn.addEventListener("click", () => {
  burgerMenu.classList.toggle("active");
});

menuSearch.addEventListener("click", () => {
  document.querySelector(".search input").focus();
  burgerMenu.classList.remove("active");
});

menuHome.addEventListener("click", () => {
  showPage("home");
  burgerMenu.classList.remove("active");
});

menuLogout.addEventListener("click", () => {
  alert("You logged out.");
  burgerMenu.classList.remove("active");
});

languageSelect.addEventListener("change", () => {
  const lang = languageSelect.value;
  const t = translations[lang];

  document.querySelector('[data-page="home"]').innerHTML = `⌂ ${t.home}`;
  document.querySelector('[data-page="progress"]').innerHTML = `▥ ${t.progress}`;
  document.querySelector('[data-page="messages"]').innerHTML = `💬 ${t.tech}`;
  document.querySelector('[data-page="classes"]').innerHTML = `▣ ${t.classes}`;
  document.querySelector('[data-page="tests"]').innerHTML = `✓ ${t.tests}`;
  document.querySelector('[data-page="settings"]').innerHTML = `⚙ ${t.settings}`;

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    element.textContent = t[key];
  });

  localStorage.setItem("greenYLanguage", lang);
});

const savedLang = localStorage.getItem("greenYLanguage") || "en";
languageSelect.value = savedLang;
languageSelect.dispatchEvent(new Event("change"));

renderNotifications();
updateNotificationCount();
const openFirstTest = document.getElementById("openFirstTest");
const backToClasses = document.getElementById("backToClasses");
const firstTestForm = document.getElementById("firstTestForm");
const testUsername = document.getElementById("testUsername");
const testResult = document.getElementById("testResult");
const autoQuestions = document.getElementById("autoQuestions");
const logicQuestionsBox = document.getElementById("logicQuestions");

const testQuestions = [
  {
    id: "q1",
    number: 1,
    question: "Что чаще всего является признаком возникновения loop в локальной сети?",
    options: {
      A: "Периодические обрывы VPN-соединений и рост задержек",
      B: "Нестабильная работа DHCP и резкий рост broadcast-трафика",
      C: "Потеря связи с отдельными Wi-Fi точками доступа",
      D: "Кратковременные проблемы с DNS-резолвингом"
    },
    correct: "B"
  },
  {
    id: "q2",
    number: 2,
    question: "Что наиболее вероятно указывает на проблему с DNS?",
    options: {
      A: "Ping по IP проходит, но сайты по доменному имени не открываются",
      B: "VPN подключается медленнее обычного",
      C: "DHCP выдает адреса с задержкой",
      D: "Периодически пропадает Wi-Fi"
    },
    correct: "A"
  },
  {
    id: "q3",
    number: 3,
    question: "Что чаще всего вызывает плохое качество VoIP-звонков?",
    options: {
      A: "Неверный DNS suffix",
      B: "Высокий jitter и потери UDP-пакетов",
      C: "Неправильная MTU на Wi-Fi",
      D: "Ошибка маршрутизации DHCP"
    },
    correct: "B"
  },
  {
    id: "q4",
    number: 4,
    question: "Что наиболее вероятно произойдет при конфликте IP-адресов?",
    options: {
      A: "Частичная потеря доступа к локальным ресурсам",
      B: "Рост broadcast-трафика во всей сети",
      C: "Ошибка авторизации доменных пользователей",
      D: "Автоматическое отключение DHCP-сервера"
    },
    correct: "A"
  },
  {
    id: "q5",
    number: 5,
    question: "Почему в офисе может периодически пропадать Wi-Fi при нормальной работе кабельной сети?",
    options: {
      A: "Неверный gateway у DHCP-сервера",
      B: "Конфликт каналов между точками доступа",
      C: "Ошибка NAT masquerade",
      D: "Неправильный VLAN ID на DNS-сервере"
    },
    correct: "B"
  },
  {
    id: "q6",
    number: 6,
    question: "Что чаще всего является причиной нестабильного VPN-соединения?",
    options: {
      A: "Высокий jitter и packet loss",
      B: "Слишком большой DHCP pool",
      C: "Конфликт NetBIOS имен",
      D: "Неправильная работа STP"
    },
    correct: "A"
  },
  {
    id: "q7",
    number: 7,
    question: "Для чего чаще всего используется VLAN?",
    options: {
      A: "Разделение широковещательных доменов",
      B: "Ускорение DNS-запросов",
      C: "Повышение мощности Wi-Fi",
      D: "Шифрование локальной сети"
    },
    correct: "A"
  },
  {
    id: "q8",
    number: 8,
    question: "Что чаще всего приводит к высокой загрузке коммутатора?",
    options: {
      A: "Большое количество DHCP lease",
      B: "Broadcast storm",
      C: "Слабый Wi-Fi сигнал",
      D: "Переполненный DNS cache"
    },
    correct: "B"
  },
  {
    id: "q9",
    number: 9,
    question: "Какой симптом чаще всего указывает на loop?",
    options: {
      A: "Высокая загрузка CPU на коммутаторах",
      B: "Ошибка времени Windows",
      C: "Медленная работа браузера только на одном ПК",
      D: "Потеря пароля пользователя"
    },
    correct: "A"
  },
  {
    id: "q10",
    number: 10,
    question: "Что наиболее важно для стабильной работы корпоративного Wi-Fi?",
    options: {
      A: "Одинаковый SSID и корректное распределение каналов",
      B: "Максимальная мощность всех точек доступа",
      C: "Разные DNS-сервера на каждой точке",
      D: "Отключенный DHCP"
    },
    correct: "A"
  },
  {
    id: "q11",
    number: 11,
    question: "Что делает NAT masquerade в MikroTik?",
    options: {
      A: "Подменяет внутренние IP при выходе в интернет",
      B: "Создает VLAN между интерфейсами",
      C: "Фильтрует DNS-запросы",
      D: "Управляет STP"
    },
    correct: "A"
  },
  {
    id: "q12",
    number: 12,
    question: "Для чего чаще используют bridge в MikroTik?",
    options: {
      A: "Объединение интерфейсов в один L2-сегмент",
      B: "Балансировка интернет-каналов",
      C: "Создание VPN-туннеля",
      D: "Ограничение скорости пользователей"
    },
    correct: "A"
  },
  {
    id: "q13",
    number: 13,
    question: "Какой инструмент MikroTik чаще используют для анализа трафика?",
    options: {
      A: "Netinstall",
      B: "Torch",
      C: "Dude",
      D: "Neighbor Discovery"
    },
    correct: "B"
  },
  {
    id: "q14",
    number: 14,
    question: "Что чаще всего вызывает высокий ping внутри локальной сети?",
    options: {
      A: "Перегруженный канал или loop",
      B: "Неверный DNS",
      C: "Маленький DHCP pool",
      D: "Неправильное имя ПК"
    },
    correct: "A"
  },
  {
    id: "q15",
    number: 15,
    question: "Какой тип VPN считается более современным и быстрым?",
    options: {
      A: "PPTP",
      B: "L2TP",
      C: "WireGuard",
      D: "SSTP"
    },
    correct: "C"
  },
  {
    id: "q16",
    number: 16,
    question: "Почему PPTP считается небезопасным?",
    options: {
      A: "Использует устаревшие механизмы шифрования",
      B: "Не поддерживает DHCP",
      C: "Не работает через NAT",
      D: "Не поддерживает VLAN"
    },
    correct: "A"
  },
  {
    id: "q17",
    number: 17,
    question: "Что чаще всего приводит к проблемам с roaming между точками доступа?",
    options: {
      A: "Разные SSID и настройки безопасности",
      B: "Большой DHCP pool",
      C: "Высокая скорость интернет-канала",
      D: "Использование VLAN"
    },
    correct: "A"
  },
  {
    id: "q18",
    number: 18,
    question: "Что делает DHCP?",
    options: {
      A: "Автоматически выдает сетевые настройки клиентам",
      B: "Шифрует трафик между VLAN",
      C: "Управляет DNS cache",
      D: "Балансирует нагрузку каналов"
    },
    correct: "A"
  },
  {
    id: "q19",
    number: 19,
    question: "Что наиболее вероятно произойдет при неверном subnet mask?",
    options: {
      A: "Устройство не сможет корректно определять локальную сеть",
      B: "DHCP перестанет работать на всех устройствах",
      C: "Пропадет DNS",
      D: "Отключится Wi-Fi адаптер"
    },
    correct: "A"
  },
  {
    id: "q20",
    number: 20,
    question: "Что чаще всего проверяют первым при отсутствии интернета на ПК?",
    options: {
      A: "IP-адрес, gateway и доступность шлюза",
      B: "Обновления Windows",
      C: "Версию BIOS",
      D: "Температуру процессора"
    },
    correct: "A"
  },
  {
    id: "q21",
    number: 21,
    question: "Для чего используется STP?",
    options: {
      A: "Предотвращение сетевых петель",
      B: "Шифрование Wi-Fi",
      C: "Балансировка VPN",
      D: "Работа DHCP relay"
    },
    correct: "A"
  },
  {
    id: "q22",
    number: 22,
    question: "Что чаще всего вызывает packet loss в Wi-Fi сети?",
    options: {
      A: "Интерференция и слабый сигнал",
      B: "Большой DHCP lease time",
      C: "Отключенный DNS",
      D: "Ошибка Active Directory"
    },
    correct: "A"
  },
  {
    id: "q23",
    number: 23,
    question: "Какой порт по умолчанию использует RDP?",
    options: {
      A: "22",
      B: "3389",
      C: "5060",
      D: "443"
    },
    correct: "B"
  },
  {
    id: "q24",
    number: 24,
    question: "Почему пользователям не рекомендуется выдавать локальные права администратора?",
    options: {
      A: "Повышается риск установки вредоносного ПО и изменения системных настроек",
      B: "Ухудшается работа DNS",
      C: "Снижается скорость Wi-Fi",
      D: "Перестает работать DHCP"
    },
    correct: "A"
  },
  {
    id: "q25",
    number: 25,
    question: "Что чаще всего является причиной перегрузки Wi-Fi в офисе?",
    options: {
      A: "Слишком много клиентов на одном канале",
      B: "Наличие VLAN",
      C: "Использование статических IP",
      D: "Наличие NAT"
    },
    correct: "A"
  },
  {
    id: "q26",
    number: 26,
    question: "Что наиболее вероятно вызовет проблемы с телефонией?",
    options: {
      A: "Высокий jitter и задержки",
      B: "Неверный hostname ПК",
      C: "Большой DHCP pool",
      D: "Разные версии Windows"
    },
    correct: "A"
  },
  {
    id: "q27",
    number: 27,
    question: "Что чаще всего указывает на проблему с DHCP?",
    options: {
      A: "Клиент получает APIPA-адрес 169.254.x.x",
      B: "Высокий ping до DNS",
      C: "Ошибка авторизации VPN",
      D: "Медленная загрузка браузера"
    },
    correct: "A"
  },
  {
    id: "q28",
    number: 28,
    question: "Что чаще всего используют для сегментации сети офиса?",
    options: {
      A: "VLAN",
      B: "NAT",
      C: "DNS",
      D: "Proxy"
    },
    correct: "A"
  },
  {
    id: "q29",
    number: 29,
    question: "Почему важно разделять телефонию и рабочие ПК по VLAN?",
    options: {
      A: "Для уменьшения влияния пользовательского трафика на VoIP",
      B: "Для ускорения DNS",
      C: "Для уменьшения DHCP lease",
      D: "Для работы Wi-Fi roaming"
    },
    correct: "A"
  },
  {
    id: "q30",
    number: 30,
    question: "Что чаще всего проверяют при жалобе на медленный интернет?",
    options: {
      A: "Потери пакетов, загрузку канала и задержки",
      B: "Название ПК пользователя",
      C: "Версию Windows",
      D: "Цвет кабеля Ethernet"
    },
    correct: "A"
  }
];

const logicQuestions = [
  "В офисе периодически пропадает интернет у всех устройств. С чего начнешь диагностику?",
  "Пользователь говорит, что интернет “лагает”, но только у него. Какие проверки сделаешь первыми?",
  "Как определить, проблема в сети или в конкретном ПК?",
  "В сети резко вырос ping и загрузка коммутаторов. Какие причины наиболее вероятны?",
  "В офисе плохо работает VoIP только вечером. Почему это может происходить?",
  "Почему loop считается одной из самых опасных проблем в локальной сети?",
  "Как понять, что проблема именно в DNS, а не в интернете?",
  "Почему не рекомендуется ставить максимальную мощность на все Wi-Fi точки?",
  "Что лучше для офиса: один мощный роутер или несколько точек доступа? И почему?",
  "Почему разделение сети по VLAN повышает безопасность и стабильность офиса?"
];

function renderTestQuestions() {
  autoQuestions.innerHTML = "";

  testQuestions.forEach(q => {
    autoQuestions.innerHTML += `
      <div class="question">
        <h3>${q.number}. ${q.question}</h3>

        <label><input type="radio" name="${q.id}" value="A"> A) ${q.options.A}</label>
        <label><input type="radio" name="${q.id}" value="B"> B) ${q.options.B}</label>
        <label><input type="radio" name="${q.id}" value="C"> C) ${q.options.C}</label>
        <label><input type="radio" name="${q.id}" value="D"> D) ${q.options.D}</label>
      </div>
    `;
  });
}

function renderLogicQuestions() {
  logicQuestionsBox.innerHTML = "";

  logicQuestions.forEach((question, index) => {
    logicQuestionsBox.innerHTML += `
      <div class="question">
        <h3>Логическое задание ${index + 1}</h3>
        <p>${question}</p>
        <textarea class="logic-answer" name="logic${index + 1}" placeholder="Write your answer here..."></textarea>
      </div>
    `;
  });
}

function getTestResults() {
  return JSON.parse(localStorage.getItem("greenYTestResults")) || [];
}

function saveTestResults(results) {
  localStorage.setItem("greenYTestResults", JSON.stringify(results));
}

function userIsRegistered(username) {
  const users = getUsers();
  return users.some(user => user.username === username);
}

function userAlreadyPassed(username) {
  const results = getTestResults();
  return results.some(result => result.username === username && result.testId === "first-test");
}

openFirstTest.addEventListener("click", () => {
  showPage("firstTest");

  firstTestForm.style.display = "block";
  testResult.innerHTML = "";

  renderTestQuestions();
  renderLogicQuestions();
});

backToClasses.addEventListener("click", () => {
  showPage("classes");
});

firstTestForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = testUsername.value.trim();

  if (!username) {
    alert("Enter your username.");
    return;
  }

  if (!userIsRegistered(username)) {
    alert("This user is not registered.");
    return;
  }

  if (userAlreadyPassed(username)) {
    alert("This user has already passed this test.");
    return;
  }

  let correct = 0;
  let wrong = 0;

  const userAnswers = {};
  const logicAnswers = {};

  testQuestions.forEach(q => {
    const selected = document.querySelector(`input[name="${q.id}"]:checked`);

    if (!selected) {
      userAnswers[q.id] = null;
      wrong++;
      return;
    }

    userAnswers[q.id] = selected.value;

    if (selected.value === q.correct) {
      correct++;
    } else {
      wrong++;
    }
  });

  logicQuestions.forEach((question, index) => {
    const textarea = document.querySelector(`textarea[name="logic${index + 1}"]`);

    logicAnswers[`logic${index + 1}`] = {
      question: question,
      answer: textarea.value.trim()
    };
  });

  const total = testQuestions.length;
  const percent = Math.round((correct / total) * 100);

  const results = getTestResults();

  results.push({
    testId: "first-test",
    testName: "Первый тест",
    username: username,
    correct: correct,
    wrong: wrong,
    percent: percent,
    userAnswers: userAnswers,
    logicAnswers: logicAnswers,
    date: new Date().toLocaleString()
  });

  saveTestResults(results);

  testResult.innerHTML = `
    <h2>Test finished</h2>
    <p><b>User:</b> ${username}</p>
    <p><b>Correct answers:</b> ${correct}</p>
    <p><b>Wrong answers:</b> ${wrong}</p>
    <p><b>Accuracy:</b> ${percent}%</p>
    <p>Logical answers were saved for admin review.</p>
  `;

  firstTestForm.style.display = "none";

  if (typeof renderUsers === "function") {
    renderUsers();
  }
});
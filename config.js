// Centralized runtime configuration for the Green Y frontend.
// SUPABASE_KEY is a Supabase "publishable" key — it is designed to be public
// and safe to ship in client-side code (unlike a service_role key, which must
// never appear here). Never add OpenAI keys or other private secrets to this
// file; those belong only in the Supabase Edge Function environment.
window.APP_CONFIG = {
  SUPABASE_URL: "https://aosqhfzkixboniwmupnh.supabase.co",
  SUPABASE_KEY: "sb_publishable_PPQswuDO8ypslHNEvuvFRg_-IGkkeJr"
};

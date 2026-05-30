import { createClient } from "@supabase/supabase-js";

// 这些值可以在前端安全公开（anon key 是公开的）
const supabaseUrl = "https://mgkrjwswboqfwgsnqhtn.supabase.co";
const supabaseAnonKey =
  "sb_publishable_-7Pl9kSwzzdEqe8EANsC-g_kApIYCL7";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

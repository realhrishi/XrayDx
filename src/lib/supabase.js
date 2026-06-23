import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://svcuzduoiuovwjtiovdr.supabase.co'
const supabaseKey = 'sb_publishable_T_sWCXdzP1SFTJoG81DNnA_wAiX6Dby'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
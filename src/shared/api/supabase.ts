import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ejaikorhokpefwqgryct.supabase.co';
const supabaseKey = 'sb_publishable_HEb5_xj-qK5Uw4mU2RolPQ_RZ0Gfj9k'; // Cole a sua chave completa que está no painel do Supabase

export const supabase = createClient(supabaseUrl, supabaseKey);
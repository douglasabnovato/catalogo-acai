/*
 * supabase.ts · cliente do Supabase criado só quando as variáveis de ambiente existem.
 * Sem configuração, o pedido segue apenas pelo WhatsApp (o canal principal da loja).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
/* fim de supabase.ts */

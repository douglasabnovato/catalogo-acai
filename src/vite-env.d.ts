/*
 * vite-env.d.ts · tipos do Vite e das variáveis de ambiente usadas pela aplicação.
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
/* fim de vite-env.d.ts */

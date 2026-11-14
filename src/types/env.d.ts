// Typing for the VITE_ env vars consumed by the Module Federation integration.
// Keep in sync with the `remotes` block in vite.config.ts and `.env.example`.

interface ImportMetaEnv {
  readonly VITE_PAYABLE_ENTRY_URL?: string;
  readonly VITE_TAX_ENTRY_URL?: string;
}

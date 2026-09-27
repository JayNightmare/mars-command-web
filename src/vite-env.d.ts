/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_PATH?: string
  readonly VITE_STATUS_API_URL?: string
  readonly VITE_LAUNCHER_DOWNLOAD_URL?: string
  readonly VITE_CLIENT_VERSION?: string
  readonly VITE_SERVER_ADDRESS?: string
  readonly VITE_VOICE_ADDRESS?: string
  readonly VITE_USE_MOCK_STATUS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

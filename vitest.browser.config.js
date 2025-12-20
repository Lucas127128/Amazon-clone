import { defineConfig } from 'vitest/config'
import { preview } from '@vitest/browser-preview'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    environmentOptions: {
      'happy-dom': {
        settings: {
          disableJavaScriptFileLoading: true,
          disableJavaScriptEvaluation: true, // Set to true if you don't need any <script> tags to run
          disableCSSFileLoading: true,
        }
      }
    },
    browser: {
      enabled: true,
      provider: preview(),
      instances: [
        { 
          browser: 'safari', 
          name: 'my-safari-instance' 
        }
      ],
    }
  },
})

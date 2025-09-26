import { defineConfig, HmrContext } from 'vite'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const execAsync = promisify(exec)

const watchedDir = path.resolve(__dirname, 'src', 'lib', 'wasm', 'assembly')
const wasmDir = path.resolve(__dirname, 'src', 'lib', 'wasm')
const releaseWasmPath = path.resolve(wasmDir, 'build', 'release.wasm')
const publicWasmPath = path.resolve(__dirname, 'public', 'AudioEngineCore.wasm')
const hashFilePath = path.resolve(__dirname, '.dirhash-cache')

function hashDirectoryContents(dir: string): string {
  const hash = crypto.createHash('sha256')

  function hashFiles(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name)

      if (entry.isDirectory()) {
        hashFiles(fullPath)
      } else if (entry.isFile()) {
        const fileBuffer = fs.readFileSync(fullPath)
        hash.update(fileBuffer)
      }
    }
  }

  hashFiles(dir)
  return hash.digest('hex')
}

export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true
    }
  },
  plugins: [
    react(),
    electron({
      main: { entry: 'electron/main.ts' },
      preload: { input: path.join(__dirname, 'electron/preload.ts') },
      renderer: {},
    }),
    tailwindcss(),

    {
      name: 'watch-wasm-assembly-and-asbuild',
      async handleHotUpdate(ctx: HmrContext) {
        const currentHash = hashDirectoryContents(watchedDir)

        let previousHash: string | undefined
        if (fs.existsSync(hashFilePath)) {
          previousHash = fs.readFileSync(hashFilePath, 'utf-8')
        }

        if (previousHash !== currentHash) {
          console.log(`📦 WASM assembly directory changed. Running 'npm run asbuild'...`)

          fs.writeFileSync(hashFilePath, currentHash)

          try {
            const { stdout, stderr } = await execAsync('npm run asbuild', { cwd: wasmDir })
            console.log(`✅ asbuild output:\n${stdout}`)
            if (stderr) console.error(`⚠️ asbuild stderr:\n${stderr}`)

            // Copy release.wasm to public/AudioEngineCore.wasm
            if (fs.existsSync(releaseWasmPath)) {
              fs.copyFileSync(releaseWasmPath, publicWasmPath)
              console.log(`📁 Copied 'release.wasm' to 'public/AudioEngineCore.wasm'`)
            } else {
              console.error(`❌ release.wasm not found at: ${releaseWasmPath}`)
            }

            // Trigger HMR reload
            ctx.server.ws.send({ type: 'full-reload' })
            console.log('🔁 Triggered full page reload.')

          } catch (error) {
            console.error(`❌ Failed to run 'asbuild':`, error)
          }
        }
      },
    },
  ],
})

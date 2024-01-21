import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'path'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, ConfigEnv, UserConfig, loadEnv } from 'vite'
import { mpaPlugin, mapRoot, mpaAlias, mpaRollupOptions, getMpaProxyOptions } from './config/mpa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const { VITE_PORT } = loadEnv(mode, process.cwd())
  return {
    root: mapRoot,
    plugins: [
      vue(),
      vueJsx(),
      mpaPlugin(),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: ['vue', 'vue-router'],
        resolvers: [ElementPlusResolver()],
        dts: resolve(__dirname, './config/unplugin/auto-imports.d.ts'),
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: resolve(__dirname, './config/unplugin/components.d.ts'),
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        ...mpaAlias,
      },
    },
    //启动服务配置
    server: {
      port: Number(VITE_PORT),
      host: '0.0.0.0',
      proxy: {
        ...getMpaProxyOptions(VITE_PORT),
      },
    },
    build: {
      rollupOptions: {
        input: {
          ...mpaRollupOptions,
        },
      },
      outDir: 'dist',
    },
  }
})

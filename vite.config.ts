import { defineConfig, ConfigEnv, UserConfig, loadEnv } from 'vite'
import { resolve, join } from 'path'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { readdirSync } from "fs";
import dotenv from 'dotenv'
dotenv.config()
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
}

// 增加 vue文件 script name值
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
// 生产gz文件
import viteCompression from 'vite-plugin-compression'

const pagePath = 'src/modules'
// 获取npm run dev后缀 配置的环境变量
const npm_config_page: string = process.env.npm_config_page || ''
let entryPath = resolve(__dirname, `./${pagePath}`);
const entrys = readdirSync(entryPath).reduce((obj, dirname) => {
  obj[dirname] = join(entryPath, dirname, "index.html");
  return obj;
}, {});
if(npm_config_page && !entrys[npm_config_page]!) {
  throw new Error(`找不到${npm_config_page}页面，请检查${pagePath}目录下是否存在该页面`)
}
const rollupOptions = npm_config_page ? { [npm_config_page]: entrys[npm_config_page] } : {...entrys, index: resolve(__dirname, 'index.html')};

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const { VITE_PORT, VITE_BASE_API, VITE_ADMIN_API } = loadEnv(mode, process.cwd());
  // 多页面代理配置
  const mpaProxy = {}
  const target = `http://localhost:${Number(VITE_PORT)}`;
  if(!npm_config_page) for (let mpaName in entrys) {
    mpaProxy[`^/${mpaName}/.*/main\.ts$`] = {
      target,
      rewrite: () => `/${mpaName}/main.ts`
    }
    mpaProxy[`^/${mpaName}/.*`] = {
      target,
      rewrite: (path: string) => path.replace(`/${mpaName}`, `/${pagePath}/${mpaName}/`)
    };
  }
  // vite配置 https://vitejs.dev/config/
  return {
    root: npm_config_page ? resolve(__dirname, `./src/modules/${npm_config_page}`) : process.cwd(),
    plugins: [
      vue(),
      vueSetupExtend(),
      // * 使用 svg 图标
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), 'src/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      // gzip压缩 生产环境生成 .gz 文件
      mode === 'production' && viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      mode === 'development' && (() => {
        return {
          name: 'configure-server',
          configureServer(server) {
            return () => {
              server.middlewares.use(async (req, res, next) => {
                for (let mpaName in entrys) {
                  mpaName = 'src/modules/' + mpaName;
                  const regex = new RegExp(`(^${server.config.base}${mpaName})(?=/)|(^${server.config.base}${mpaName}$)`);
                  if (req.originalUrl?.match(regex)) {
                    req.url = `/${mpaName}/index.html`;
                    break;
                  }
                }
                next();
              });
            };
          },
        }
      })(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/modules/admin/styles/variablesSass.scss" as *;`
        }
      }
    },
    // 配置别名
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@lib': resolve(__dirname, 'src/libs'),
        'static': resolve(__dirname, 'public/static'),
        "@h5": resolve(__dirname, `${pagePath}/h5`),
        "@admin": resolve(__dirname, `${pagePath}/admin`),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    //启动服务配置
    server: {
      port: Number(VITE_PORT),
      open: true,
      https: false,
      proxy: {
        [VITE_BASE_API]: {
          target: `http://175.178.70.208/admin-api/`,
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp(VITE_BASE_API), "")
        },
        [VITE_ADMIN_API]: {
          target: `http://175.178.70.208/admin-api/`,
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp(VITE_ADMIN_API), "")
        },
        ...mpaProxy,
      }
    },
    optimizeDeps: {
      exclude: ['path']
    },
    build: {
      rollupOptions: {
        input: {
          ...rollupOptions
        },
        output: { dir: "./dist" },
      },
    },
  }
})

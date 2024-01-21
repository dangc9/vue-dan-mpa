import type { ViteDevServer, Plugin, UserConfig } from 'vite'
import { resolve, join } from 'path'
import { readdirSync } from 'fs'
import { fileURLToPath, URL } from 'node:url'
import shell from 'shelljs'

interface stringObject {
  [key: string]: string
}

export const mpaBase = 'page'

// 获取npm run dev后缀 配置的环境变量
const npm_config_page: string = process.env.npm_config_page || ''
let entryPath = resolve(__dirname, `../../${mpaBase}`)

const entrys: stringObject = readdirSync(entryPath).reduce((obj: stringObject, dirname) => {
  obj[dirname] = join(entryPath, dirname, 'index.html')
  return obj
}, {})

if (npm_config_page && !entrys[npm_config_page]!) {
  throw new Error(`找不到${npm_config_page}页面，请检查${mpaBase}目录下是否存在该页面`)
}

export const mpaAlias: stringObject = Object.keys(entrys).reduce((obj: stringObject, name) => {
  obj[`@${name}`] = fileURLToPath(new URL(`../${mpaBase}/${name}`, import.meta.url))
  return obj
}, {})

export const mapRoot = npm_config_page ? resolve(__dirname, `../../${mpaBase}/${npm_config_page}`) : process.cwd()
// Rollup配置
export const mpaRollupOptions: stringObject = npm_config_page
  ? { [npm_config_page]: entrys[npm_config_page] }
  : { ...entrys, index: resolve(__dirname, '../../index.html') }

// 本地代理配置配置
export const getMpaProxyOptions = (port: string) => {
  const mpaProxy: any = {}
  const target = `http://localhost:${port}`
  if (!npm_config_page)
    for (let mpaName in entrys) {
      mpaProxy[`^/${mpaName}/.*/main\.ts$`] = {
        target,
        rewrite: () => `/${mpaName}/main.ts`,
      }
      mpaProxy[`^/${mpaName}/.*`] = {
        target,
        rewrite: (path: string) => path.replace(`/${mpaName}`, `/${mpaBase}/${mpaName}/`),
      }
    }
  return mpaProxy
}

// vite plugin： history本地代理中间件配置
export const mpaPlugin = (): Plugin => {
  let mode: string
  let resolvedConfig: UserConfig
  return {
    name: 'configure-server',
    config(config, env) {
      resolvedConfig = config
      mode = env.mode
    },
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          for (let mpaName in entrys) {
            mpaName = `${mpaBase}/${mpaName}`
            const regex = new RegExp(`(^${server.config.base}${mpaName})(?=/)|(^${server.config.base}${mpaName}$)`)
            if (req.originalUrl?.match(regex)) {
              req.url = `/${mpaName}/index.html`
              break
            }
          }
          next()
        })
      }
    },
    closeBundle() {
      if (mode === 'production') {
        const dist = (resolvedConfig.build && resolvedConfig.build.outDir) || 'dist'
        if (npm_config_page) {
          shell.mv(resolve(`${dist}/${mpaBase}/${npm_config_page}/*`), resolve(dist))
        } else {
          shell.mv(resolve(`${dist}/${mpaBase}/*`), resolve(dist))
        }
        shell.rm('-rf', resolve(`${dist}/${mpaBase}`))
      }
    },
  }
}

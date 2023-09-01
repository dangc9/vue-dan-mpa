import chalk from 'chalk'
import path from 'path'
import fs from 'fs'

const resolve = (__dirname, ...file) => path.resolve(__dirname, ...file)
const log = (message) => console.log(chalk.green(`${message}`))
const successLog = (message) => console.log(chalk.blue(`${message}`))
const errorLog = (error) => console.log(chalk.red(`${error}`))
log('请输入要生成的"模块名称"、会生成在 /src/modules 目录下')
process.stdin.on('data', async (chunk) => {
  const pagePath = 'src/modules'
  const pages = fs.readdirSync(path.resolve('./src/modules'))
  // 获取输入的信息
  const projectName = String(chunk).trim().toString()


  if(!projectName || pages.includes(projectName)){
    errorLog('模块已经存在，请重新输入')
    return
  }
  successLog(`将在 /src/modules 目录下创建 ${projectName} 文件夹`)
  const targetPath = resolve('./src/modules', projectName)
  fs.mkdirSync(targetPath)
  copyFile('./scripts/template', targetPath)
  setFile()
  async function setFile() {
    // 修改项目中/router/inbex.ts的文件内容
    const routerPath = resolve(targetPath, './router/index.ts')
    const data = await fs.promises.readFile(routerPath, 'utf8');
    const modifiedData = data.replace(/\${pagaPath}/, `/${projectName}`);
    await fs.promises.writeFile(routerPath, modifiedData, 'utf8');

    successLog(`${projectName}模块已创建`);
    process.stdin.emit('end')
  }
})

process.stdin.on('end', () => {
  process.exit()
})


// 判断文件夹是否存在，不存在创建一个
const isExist = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}
//递归复制模版文件夹内的文件
const copyFile = (sourcePath, targetPath) => {
  const sourceFile = fs.readdirSync(sourcePath, { withFileTypes: true })

  sourceFile.forEach((file) => {
    const newSourcePath = path.resolve(sourcePath, file.name)
    const newTargetPath = path.resolve(targetPath, file.name)
    //isDirectory() 判断这个文件是否是文件夹，是就继续递归复制其内容
    if (file.isDirectory()) {
      isExist(newTargetPath)
      copyFile(newSourcePath, newTargetPath)
    } else {
      fs.copyFileSync(newSourcePath, newTargetPath)
    }
  })
}

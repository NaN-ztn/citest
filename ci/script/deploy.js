const path = require('path')
const { NodeSSH } = require('node-ssh')

const ssh = new NodeSSH()

// 远程服务器配置信息
const config = {
  host: '43.142.173.94',
  pathUrl: '/tmp', // 远程存放文件地址
}

// 远程服务器解压缩命令
const unzipCmd =
  'cd /tmp && rm -rf dist && unzip -q dist.zip && rm -rf /usr/local/lighthouse/softwares/citest && mv dist /usr/local/lighthouse/softwares/citest && rm -f /tmp/dist.zip'

/**
 * @description: 远程服务器执行指令
 * @param {string} cmd
 * @return {*}
 */
async function execCommand(cmd) {
  try {
    let result = await ssh.execCommand(cmd)
    if (!result.stderr) {
      console.log('指令执行成功')
    } else {
      console.log('指令执行失败:', result)
    }
  } catch (err) {
    console.log('指令执行失败:', err.message)
  } finally {
    process.exit(0)
  }
}

/**
 * @description: 上传 dist 压缩包到远程服务器
 * @return {*}
 */
async function uploadFile() {
  try {
    await ssh.putFile(path.join(__dirname, '../../dist.zip'), `${config.pathUrl}/dist.zip`)
    console.log('压缩包上传成功')
    execCommand(unzipCmd)
  } catch (err) {
    console.log('压缩包上传失败' + err.message)
  }
}

/**
 * @description: 连接远程服务器
 * @return {*}
 */
async function sshConnect() {
  try {
    await ssh.connect({
      host: config.host,
      username: 'root',
      privateKeyPath: path.join(__dirname, './ci_rsa'),
    })
    console.log('远程服务器连接成功')
    uploadFile()
  } catch (err) {
    console.log('远程服务器连接失败' + err.message)
  }
}

;(function () {
  sshConnect()
})()

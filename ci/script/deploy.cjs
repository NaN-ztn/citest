const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const { NodeSSH } = require('node-ssh')

const ssh = new NodeSSH()

// 获取远程服务器配置信息 此处建议通过配置文件获取
const config = {
  host: '43.142.173.94',
  pathUrl: '/tmp', // 远程存放文件地址
}
const remoteServiceUpdate = () => {
  // ssh.execCommand 在指定文件夹下执行了命令 sh upgrade.sh
  // 此处请根据个人情况处理，此处只是给各位看官打个样~
  ssh.execCommand('sh remote.sh', { cwd: config.pathUrl }).then((result) => {
    console.log(`The update message is: ${result.stdout}`)
    if (!result.stderr) {
      console.log('Gratefule! update success!')
      process.exit(0)
    } else {
      console.log('Something wrong:', result)
      process.exit(0)
    }
  })
}
async function uploadFile() {
  await ssh.connect({
    host: config.host,
    username: 'root',
    privateKeyPath: path.join(__dirname, './ci_rsa'),
  })
  console.log('SSH login success')
  // 上传网站的发布包至configs中配置的远程服务器的指定地址
  await ssh.putFile(`/tmp/dist.zip`, `${config.pathUrl}/dist.zip`)
  console.log('The zip file is upload successful')
  process.exit(0)
}

;(async function () {
  await uploadFile()
})()

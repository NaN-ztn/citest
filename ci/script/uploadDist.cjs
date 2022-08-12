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

;(function () {
  uploadFile()
})()

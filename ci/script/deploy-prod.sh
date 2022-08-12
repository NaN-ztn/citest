# 确认权限
chmod 600 ./ci/script/ci_rsa
# 构建代码
npx vite build --mode development
# 压缩打包代码
rm -rf /tmp/dist.zip
zip -q -r /tmp/dist.zip ./dist
node ./ci/script/uploadDist.cjs
echo '代码包上传完成'
# 登录服务器 (远程命令)
ssh -i ./ci/script/ci_rsa root@43.142.173.94 > /dev/null 2>&1 << remotecmd
cd /tmp && rm -rf dist && unzip -q dist.zip
rm -rf /usr/local/lighthouse/softwares/citest
mv dist /usr/local/lighthouse/softwares/citest
rm -f /tmp/dist.zip
remotecmd
echo 'PROD发布完成'


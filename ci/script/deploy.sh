# 确认权限
chmod 600 ./ci/script/ci_rsa
# 构建代码
npx vite build --mode development
# 压缩打包代码
rm -rf ./dist.zip
zip -q -r ./dist.zip ./dist
echo '代码包上传完成'

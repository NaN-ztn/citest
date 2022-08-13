# 构建代码
npx vite build --mode product 
# 压缩打包代码
rm -rf ./dist.zip
zip -q -r ./dist.zip ./dist
echo '代码包压缩完成'

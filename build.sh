rm -rf dist
yarn build:prod
rm -rf erd.tar.gz
cd dist
tar -cvzf erd.tar.gz *
mv erd.tar.gz ..

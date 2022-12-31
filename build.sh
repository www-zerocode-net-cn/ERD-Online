rm -rf dist
yarn && yarn build:prod
rm -rf erd.tar.gz
cd dist
tar -cvzf erd.tar.gz *
cp erd.tar.gz ..
cp erd.tar.gz ../ci

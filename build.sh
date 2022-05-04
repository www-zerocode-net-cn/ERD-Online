yarn build
rm -rf erd.tar.gz
cd dist
tar -cvzf erd.tar.gz *
mv erd.tar.gz ..

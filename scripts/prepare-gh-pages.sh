#! /bin/sh

mkdir -p public &&
## Create a javascript file for web browsers
gulp browserify &&
## Create JSDoc
gulp docs &&
## Checkout gh-pages
git fetch &&
git branch gh-pages origin/gh-pages &&
git checkout gh-pages &&
## Add files to gh-pages
rm -rf ./public/docs &&
cp sample ./public/sample -r &&
cp index.html ./public/ &&
mkdir -p public/js &&
cp ./vizdip.js ./public/js &&
cp ./out ./public/docs -rx

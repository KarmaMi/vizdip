#! /bin/sh

mkdir -p public &&
rm -rf ./public/docs &&
mkdir -p public/js &&
## Create a javascript file for web browsers
gulp browserify &&
## Create JSDoc
gulp docs &&
## Checkout gh-pages
git fetch &&
git branch gh-pages origin/gh-pages &&
git checkout gh-pages &&
## Add files to gh-pages
cp sample ./public/sample -r &&
cp index.html ./public/ &&
cp ./vizdip.js ./public/js &&
cp ./out ./public/docs -r

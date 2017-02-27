#! /bin/sh

mkdir -p ./public &&
rm -rf ./public/js &&
rm -rf ./public/example &&
rm -rf ./public/docs &&
mkdir -p ./public/js &&
mkdir -p ./public/example &&
## Create a javascript file for web browsers
gulp browserify &&
## Create JSDoc
gulp docs &&
## Compile example
gulp compile-sample &&
## Add files to gh-pages
cp images ./public -r &&
cp example/index.html ./public/example -r &&
cp example/example.js ./public/example -r &&
cp example/example.js.map ./public/example -r &&
cat << EOF > ./public/index.html &&
<html><head></head>
<body>
<a href="./example/">Example</a><br />
<a href="./docs/">Documentations</a><br />
</body>
</html>
EOF
touch ./public/.nojekyll &&
cp ./browser/vizdip.js ./public/js &&
cp ./browser/vizdip.js.map ./public/js &&
mv ./docs ./public/docs -r

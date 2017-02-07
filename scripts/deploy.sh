#! /bin/sh
if ([ "$TRAVIS_BRANCH" = "master" ] || [ ! -z "$TRAVIS_TAG" ]) && [ "$TRAVIS_PULL_REQUEST" = "false" ]
then
  echo "Start Deployment"
  # Install modules
  npm i -g jsdoc &&
  # Publish to GitHub Pages
  ## Prepare ssh keys
  $(npm bin)/set-up-ssh --key "$encrypted_8167579b67a3_key" \
                        --iv "$encrypted_8167579b67a3_iv" \
                        --path-encrypted-key ".travis/github_deploy_key.enc"
  ## Create a javascript file for web browsers
  gulp browserify &&
  ## Create JSDoc
  jsdoc -r ./lib -d ./api-output &&
  ## Checkout gh-pages
  git fetch &&
  git branch gh-pages origin/gh-pages &&
  git checkout gh-pages &&
  ## Add files to gh-pages
  mkdir -p js/ &&
  cp ./lib/vizdip.js ./js &&
  rm -rf ./api &&
  mv api-output ./api &&
  ## Push to GitHub Pages
  git add js/vizdip.js
  git add api
  git commit --allow-empty -m "Release ${TRAVIS_TAG}" &&
  echo "push to gh-pages" &&
  git push -q origin gh-pages
fi

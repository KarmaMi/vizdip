#! /bin/sh
if [ ! -z "$TRAVIS_TAG" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]
then
  echo "install jsdoc"
  # Install modules
  npm i -g jsdoc &&
  # Publish to GitHub Pages
  ## Prepare ssh keys
  echo 'set-up-ssh' &&
  $(npm bin)/set-up-ssh --key "$encrypted_8167579b67a3_key" \
                        --iv "$encrypted_8167579b67a3_iv" \
                        --path-encrypted-key ".travis/github_deploy_key.enc" &&
  echo 'update-branch' &&
  $(npm bin)/update-branch --commands "$(dirname $0)/prepare-gh-pages.sh" \
                           --commit-message "Update website (${TRAVIS_TAG})" \
                           --directory "./public" \
                           --distribution-branch "gh-pages" \
                           --source-branch "${TRAVIS_BRANCH}"
fi

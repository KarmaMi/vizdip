#! /bin/sh
if ([ "$TRAVIS_BRANCH" = "master" ] && [ ! -z "$TRAVIS_TAG" ]) && [ "$TRAVIS_PULL_REQUEST" = "false" ]
then
  echo "Start Deployment"
  # Install modules
  npm i -g jsdoc &&
  # Publish to GitHub Pages
  ## Prepare ssh keys
  $(npm bin)/set-up-ssh --key "$encrypted_8167579b67a3_key" \
                        --iv "$encrypted_8167579b67a3_iv" \
                        --path-encrypted-key ".travis/github_deploy_key.enc" &&
  $(npm bin)/update-branch --commands "$(dirname $0)/prepare-gh-pages.sh" \
                           --commit-message "Update website (${TRAVIS_TAG})" \
                           --directory "./public" \
                           --distribution-branch "gh-pages" \
                           --source-branch "master"
fi

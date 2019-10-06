#!/bin/sh

set -o errexit
set -o nounset
set -o xtrace

npm i
(
  cd ios
  pod install --repo-update
)

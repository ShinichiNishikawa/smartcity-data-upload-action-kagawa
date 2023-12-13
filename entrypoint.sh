#!/bin/sh
set -e

INPUT_DIR=$1
ACCESS_KEY=$2
AWS_ACCESS_KEY=$3
AWS_SECRET_ACCESS_KEY=$4

echo "INPUT_DIR: $INPUT_DIR"
echo "ACCESS_KEY: $ACCESS_KEY"

npm install

echo $INPUT_DIR
pwd
ls

node ./bin/excel2geojson.js $INPUT_DIR

exit 0
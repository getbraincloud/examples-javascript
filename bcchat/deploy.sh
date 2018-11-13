#!/bin/bash

echo --- Update build version
npm version patch -m "deploy.sh"

echo --- Build the web page
npm run-script build

echo --- Create and upload the docker image
cp ./Dockerfile ./build/Dockerfile
cd ./build/
docker build -t braincloud/bcchat ./
docker push braincloud/bcchat
cd ..

echo --- Stop, pull and restart the docker image on nrt
ssh bcchat 'sudo docker stop bcchat'
ssh bcchat 'sudo docker rm bcchat'
ssh bcchat 'sudo docker pull braincloud/bcchat'
ssh bcchat 'sudo docker run --name bcchat -d -p 80:80 braincloud/bcchat'

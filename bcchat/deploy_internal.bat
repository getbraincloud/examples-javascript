echo --- Update build version
call npm --no-git-tag-version version patch --force

echo --- Build the web page
call npm run-script build

echo --- Create and upload the docker image
call xcopy /Y .\Dockerfile .\build\
cd ./build/
call docker build -t braincloud/bcchat:internal ./
call docker push braincloud/bcchat:internal
cd ..

echo --- Stop, pull and restart the docker image on BCChat server
call plink -ssh -i "%userprofile%/.ssh/bcchat.ppk" ec2-user@ec2-18-219-26-183.us-east-2.compute.amazonaws.com "sudo docker stop bcchat_internal"
call plink -ssh -i "%userprofile%/.ssh/bcchat.ppk" ec2-user@ec2-18-219-26-183.us-east-2.compute.amazonaws.com "sudo docker rm bcchat_internal"
call plink -ssh -i "%userprofile%/.ssh/bcchat.ppk" ec2-user@ec2-18-219-26-183.us-east-2.compute.amazonaws.com "sudo docker pull braincloud/bcchat:internal"
call plink -ssh -i "%userprofile%/.ssh/bcchat.ppk" ec2-user@ec2-18-219-26-183.us-east-2.compute.amazonaws.com "sudo docker run --name bcchat_internal -d -p 3002:80 braincloud/bcchat:internal"

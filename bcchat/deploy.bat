echo --- Update build version
call npm --no-git-tag-version version patch --force

echo --- Build the web page
call npm run-script build

echo --- Create and upload the docker image
call xcopy /Y .\Dockerfile .\build\
cd ./build/
call docker build -t braincloud/bcchat ./
call docker push braincloud/bcchat
cd ..

echo --- Stop, pull and restart the docker image on BCChat server
call plink -ssh -i "%userprofile%/.ssh/bcchat.ppk" ec2-user@ec2-18-219-26-183.us-east-2.compute.amazonaws.com "sudo docker stop bcchat"
call plink -ssh -i "%userprofile%/.ssh/bcchat.ppk" ec2-user@ec2-18-219-26-183.us-east-2.compute.amazonaws.com "sudo docker rm bcchat"
call plink -ssh -i "%userprofile%/.ssh/bcchat.ppk" ec2-user@ec2-18-219-26-183.us-east-2.compute.amazonaws.com "sudo docker pull braincloud/bcchat"
call plink -ssh -i "%userprofile%/.ssh/bcchat.ppk" ec2-user@ec2-18-219-26-183.us-east-2.compute.amazonaws.com "sudo docker run --name bcchat -d -p 80:80 braincloud/bcchat"

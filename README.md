# CMPE272 Project - aMAZE Group


Team members:
1. Binu Jose
2. Ginto George
3. Nabin Thomas
4. Sandeep Panakkal

## Status

### CI/CD Status (Travis-CI)
[![Build Status](https://travis-ci.org/nabinthomas/cmpe272project.svg?branch=master)](https://travis-ci.org/nabinthomas/cmpe272project)

### Implementation Status
In progress.

## Build instructions
1. Install git and Sync code to your local machine. (to ```<gitroot>```)
2. Install docker
3. Build docker image
```bash
    cd <gitroot>/
    mkdir -p server/config
    echo "CLIENT_SECRET=''" > server/config/settings.cfg ;
    docker kill `docker ps |grep amaze |cut -f 1 -d ' '`;
    docker build -t amazeteam/cmpe272project -f docker/Dockerfile . ;
    rm -rf server/config/settings.cfg ;
```
## Modifying files with Git branches
1. Create clone of the repository.
```bash
	git clone https://github.com/nabinthomas/cmpe272project.git
```
2. Create your branch, checkout branch and push changes back to the branch.
```bash
	cd cmpe272project
	git checkout -b cmpe272project_<branchname>
	#following will create the branch and push in changes
	git push origin cmpe272project_<branchname>
	#after modifying any file do the following command to update
	git add -u
	#commit the changes
	git commit -m "message"
	#push it back to your branch
	git push origin cmpe272project_<branchname>
```
3. Now open a pull request from this branch to the main branch using github.

## To Run the docker image
1. Interactive mode
```bash
    cd <gitroot>/
	export AUTHO_CLIENT_SECRET="'YOURCLIENTSECRETKEY'"; #Replace YOURCLIENTSECRETKEY with the client secret from auth0
	mkdir -p server/config
		echo "CLIENT_SECRET=$AUTHO_CLIENT_SECRET" > server/config/settings.cfg ;
    docker run -it --rm -p 443:443/tcp  -v `pwd`/server/config:/root/app/server/config  -v `pwd`/../database:/var/lib/mongodb amazeteam/cmpe272project bash
```
2. Run the server with local files.
```bash
        cd <gitroot>/
		export AUTHO_CLIENT_SECRET="'YOURCLIENTSECRETKEY'"; #Replace YOURCLIENTSECRETKEY with the client secret from auth0
		mkdir -p server/config
		echo "CLIENT_SECRET=$AUTHO_CLIENT_SECRET" > server/config/settings.cfg ;
        docker run -it  --rm -p 443:443/tcp -v `pwd`/server:/root/app/server -v `pwd`/server/config:/root/app/server/config -v `pwd`/../database:/var/lib/mongodb -v `pwd`/setup:/root/setup -v `pwd`/test:/root/test   amazeteam/cmpe272project
```
3. Run the server with prepackaged application files.
```bash
        cd <gitroot>/
		export AUTHO_CLIENT_SECRET="'YOURCLIENTSECRETKEY'"; #Replace YOURCLIENTSECRETKEY with the client secret from auth0
		mkdir -p server/config
		echo "CLIENT_SECRET=$AUTHO_CLIENT_SECRET" > server/config/settings.cfg ;
        docker run -it --rm -p 443:443/tcp -v `pwd`/server/config:/root/app/server/config -v `pwd`/../database:/var/lib/mongodb amazeteam/cmpe272project
```
4. Run the unit tests
```bash
        cd <gitroot>/
		export AUTHO_CLIENT_SECRET="'YOURCLIENTSECRETKEY'"; #Replace YOURCLIENTSECRETKEY with the client secret from auth0
		mkdir -p server/config
		echo "CLIENT_SECRET=$AUTHO_CLIENT_SECRET" > server/config/settings.cfg
        docker run  --rm  -v `pwd`/server/config:/root/app/server/config  amazeteam/cmpe272projectunittest
```
5. Kill the current server and rebuild/restart.
```bash
    cd <gitroot>/
    export AUTHO_CLIENT_SECRET="'YOURCLIENTSECRETKEY'"; #Replace YOURCLIENTSECRETKEY with the client secret from auth0
	mkdir -p server/config
	echo "CLIENT_SECRET=$AUTHO_CLIENT_SECRET" > server/config/settings.cfg ;
	docker kill `docker ps |grep amaze |cut -f 1 -d ' '`;
	docker build -t amazeteam/cmpe272project -f docker/Dockerfile . ;
	#docker run --rm -p 443:443/tcp -v `pwd`/server:/root/app/server -v `pwd`/server/config:/root/app/server/config -v `pwd`/../database:/var/lib/mongodb -v `pwd`/setup:/root/setup -v `pwd`/test:/root/test -v `pwd`/../data:/root/app/server/dbsetup/data  -it amazeteam/cmpe272project
	#below command runs with a clean db everytime. Use above one if you want to reuse db from prev instance, but you may need to skip imports in that case.
	docker run --rm -p 443:443/tcp -v `pwd`/server:/root/app/server -v `pwd`/server/config:/root/app/server/config -v `pwd`/setup:/root/setup -v `pwd`/test:/root/test -v `pwd`/../data:/root/app/server/dbsetup/data  -it amazeteam/cmpe272project
	rm server/config/settings.cfg
 ```
**Note**: _The database dir is kept outside the docker image to make sure the data is persistent across docker runs. For testing, a different database directory may be used to avoid corrupting real data._
## To push the docker image to docker hub
```bash
docker login
docker push amazeteam/cmpe272project
```
**Note**: _ Docker image is automatically pushed to Dockerhub with "latest" tag only for commits to the master branch. All other branches will have the branchname as the tag _

## To deploy docker on aws ec2 instance (linux 2 ami)
### To run the latest version from dockerhub
```bash
sudo service docker start
export AUTHO_CLIENT_SECRET="'YOURCLIENTSECRETKEY'"; #Replace YOURCLIENTSECRETKEY with the client secret from auth0
mkdir -p server/config
echo "CLIENT_SECRET=$AUTHO_CLIENT_SECRET" > server/config/settings.cfg ;
nohup sudo docker run --rm -p 443:443/tcp -v `pwd`/server/config:/root/app/server/config  amazeteam/cmpe272project
```
### To run a specific version from dockerhub
```bash
sudo service docker start
export AUTHO_CLIENT_SECRET="'YOURCLIENTSECRETKEY'"; #Replace YOURCLIENTSECRETKEY with the client secret from auth0
mkdir -p server/config
echo "CLIENT_SECRET=$AUTHO_CLIENT_SECRET" > server/config/settings.cfg ;
nohup sudo docker run --rm -p 443:443/tcp -v `pwd`/server/config:/root/app/server/config  amazeteam/cmpe272project:version
```
**Note**: _Replace **version** with the right tag to run._
# Git Cheatsheat
- http://www.cheat-sheets.org/saved-copy/git-cheat-sheet.pdf

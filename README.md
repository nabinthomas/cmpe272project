# CMPE272 Assignment - aMAZE Group


Team members: 
1. Binu Jose
2. Ginto George
3. Nabin Thomas
4. Sandeep Panakkal

## Status
### Travis-CI Status
[![Build Status](https://travis-ci.org/nabinthomas/cmpe272project.svg?branch=master)](https://travis-ci.org/nabinthomas/cmpe272project)
### Implementation Status
GitHub Repository Created
### CI/CD Status
 See https://travis-ci.org/nabinthomas/cmpe272project

## Build instructions
1. Install git and Sync code to your local machine. (to ```<gitroot>```)
2. Install docker
3. Build docker image
```bash
    cd <gitroot>/ 
    docker build -t amazeteam/cmpe272project -f docker/Dockerfile .
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
    docker run -it --rm -p 80:80/tcp -p 8080:8080/tcp -v `pwd`/../database:/data/db amazeteam/cmpe272project bash
```
2. Run the server with local files.
```bash
        cd <gitroot>/ 
        docker run --rm -p 80:80/tcp -p 8080:8080/tcp -v `pwd`/server:/root/app/server -v `pwd`/../database:/data/db -v `pwd`/setup:/root/setup -v `pwd`/test:/root/test   amazeteam/cmpe272project
```
3. Run the server with prepackaged application files. 
```bash
        cd <gitroot>/ 
        docker run --rm -p 80:80/tcp -p 8080:8080/tcp -v `pwd`/../database:/data/db amazeteam/cmpe272project
```
4. Run the unit tests
```bash
        cd <gitroot>/ 
        docker run --rm amazeteam/cmpe272project unittest
```
**Note**: _The database dir is kept outside the docker image to make sure the data is persistent across docker runs. For testing, a different database directory may be used to avoid corrupting real data._ 
## To push the docker image to docker hub
```bash
docker login
docker push amazeteam/cmpe272project
```
**Note**: _ Docker image is automatically pushed to Dockerhub with "latest" tag only for commits to the master branch. All other branches will have the branchname as the tag_ 

## To deploy docker on aws ec2 instance (linux 2 ami)
### To run the latest version from dockerhub
```bash
sudo service docker start
nohup sudo docker run --rm -p 80:80/tcp -p 8080:8080/tcp amazeteam/cmpe272project
```
### To run a specific version from dockerhub
```bash
sudo service docker start
nohup sudo docker run --rm -p 80:80/tcp -p 8080:8080/tcp amazeteam/cmpe272project:version
```
**Note**: _Replace **version** with the right tag to run._
# Git Cheatsheat
- http://www.cheat-sheets.org/saved-copy/git-cheat-sheet.pdf


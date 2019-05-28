#!/bin/bash

# Central place to start processes/services for the Web app.

#Start Mongodb database server
service mongodb start

#import data 
#For some reason unzip is never getting packaged in the Docker image. So installing it again temporarily. 
apt-get install -y unzip 
unzip -o app/server/dbsetup/data/data.zip -d app/server/dbsetup/data
PYTHONPATH=/root/app/ python3 app/server/dbsetup/populateDataBase.py  app/server/dbsetup/data/listings.csv app/server/dbsetup/data/reviews.csv app/server/dbsetup/data/listings_schema.json 
rm app/server/dbsetup/data/*.csv
#Start the web server
#This should be started at the end
export FLASK_ENV=development
export SERVER_CONFIG=/root/app/server/config/settings.cfg
PYTHONPATH=/root/app/ python3 app/server/aMAZE.py  mongodb://localhost/airbnb &



bash 

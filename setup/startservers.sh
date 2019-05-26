#!/bin/bash

# Central place to start processes/services for the Web app.

#Start Mongodb database server
service mongodb start

#Start the web server
#This should be started at the end
export FLASK_ENV=development
export SERVER_CONFIG=/root/app/server/config/settings.cfg
PYTHONPATH=/root/app/ python3 app/server/aMAZE.py  mongodb://localhost/airbnb &
bash 

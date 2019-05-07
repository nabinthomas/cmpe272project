#!/bin/bash

# Central place to start processes/services for the Web app.

#Start Mongodb database server
service mongodb start

#Start the web server
#This should be started at the end
PYTHONPATH=/root/app/ python3 app/server/restapi.py  mongodb://localhost/test &
PYTHONPATH=/root/app/ python3 app/server/webui.py &
bash 

#!/bin/bash

# Start local mongodb instance
service mongodb start
ut_dir=/root/test/unittests

#REST API Unit tests
echo "Running REST API tests.."
export SERVER_CONFIG=/root/app/server/config/settings.cfg
PYTHONPATH=/root/app/ python3 /root/test/unittests/ut_rest.py -v
if [ "$?" -ne 0 ]
then
    exit -1
fi 

echo "All Unit tests passed"
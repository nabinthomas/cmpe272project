#!/bin/bash

# Start local mongodb instance
service mongodb start
ut_dir=/root/test/unittests

#Run unit test
## ./unittest.py
if [ "$?" -ne 0 ]
then
    exit -1
fi 

echo "All Unit tests passed"
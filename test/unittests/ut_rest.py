import unittest
import os
#import mongomock
import pymongo
import json
from flask import jsonify
from server import aMAZE


class RESTTests(unittest.TestCase):
    # Each of the test case should have a fresh dtabase
    # Test cases may run in parallel so need to give unique name.
    test_case_number = 133; 
        
    def setUp(self):
        
        print ("SETUP BEGIN")
        #self.mongo_client = mongomock.MongoClient() 
        #self.db = self.mongo_client['testdb']
        RESTTests.test_case_number = RESTTests.test_case_number + 1; 
        self.testname =  str(RESTTests.test_case_number)
        print ("testcase  name = ", self.testname)
        mongodb_uri = "mongodb://localhost/" + self.testname  
        self.mongo_client  = pymongo.MongoClient(mongodb_uri)
        self.db = self.mongo_client.get_database()
   
        self.app = aMAZE.app.test_client()
        aMAZE.db = self.db
        aMAZE.mongo_client = self.mongo_client
        print ("SETUP END")
        
    def tearDown(self):
        print ("tearDown Start : " , self.testname)

    def test_api(self):
        """
        Test REST API /api 
        """
        resp = self.app.get('/api')
        reply_from_server = json.loads(resp.data)
        print ("Reply from Server was :\n", reply_from_server)
        print ("api help message was :\n", aMAZE.api_help_message)
        self.assertEqual(reply_from_server['status'], aMAZE.ReturnCodes.SUCCESS)
        self.assertEqual(reply_from_server, {
            "response": aMAZE.api_help_message,
            "status": aMAZE.ReturnCodes.SUCCESS
        })

if __name__ == "__main__":
    unittest.main()

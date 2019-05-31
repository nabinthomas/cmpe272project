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
        self.maxDiff = None

  
        self.db.listings.insert_one({"id": 9835, "name" : "Beautiful Room & House", "street" : "Bulleen, VIC, Australia", "city" : "Bulleen", "state" :"VIC", "property_type" : "House", "room_type" : "Private room" , "bedrooms" : 1, "bathrooms" : 1, "prices" : 60, "review_scores_rating" : 9})

        self.db.listings.insert_one({"id": 10803, "name" : "Beautiful Room & House", "street" : "Bulleen, VIC, Australia", "city" : "Brunswick East", "state" :"VIC", "property_type" : "Apartment", "room_type" : "Private room" , "bedrooms" : 1, "bathrooms" : 1, "prices" : 35, "review_scores_rating" : 9})
        self.db.listings.insert_one({"id": 15246, "name" : "Large private room-close to city", "street" : "Thornbury, VIC, Australia", "city" : "Thornbury", "state" :"VIC", "property_type" : "House", "room_type" : "Private room" , "bedrooms" : 1, "bathrooms" : 1.5, "prices" : 50, "review_scores_rating" : 9})

        self.db.listings.insert_one({"id": 38271, "name" : "Melbourne - Old Trafford Apartment", "street" : "Berwick, VIC, Australia", "city" : "Berwick", "state" :"VIC", "property_type" : "Apartment", "room_type" : "Entire home/apt" , "bedrooms" : 3, "bathrooms" : 1, "prices" : 98, "review_scores_rating" : 10})
        self.db.listings.insert_one({"id": 43414, "name" : "Home In The City", "street" : "East Melbourne, VIC, Australia", "city" : "Australia East Melbourne", "state" :"VIC", "property_type" : "Apartment", "room_type" : "Private room" , "bedrooms" : 1, "bathrooms" : 1, "prices" : 100, "review_scores_rating" : 9})

        self.db.listings.insert_one({"id": 32271, "name" : "Melbourne - Old Trafford Apartment", "street" : "Berwick, VIC, Australia", "city" : "Berwick", "state" :"VIC", "property_type" : "Apartment", "room_type" : "Entire home/apt" , "bedrooms" : 3, "bathrooms" : 1, "prices" : 98, "review_scores_rating" : 10})
        self.db.listings.insert_one({"id": 161404, "name" : "Handy Location, 5Beds, 3bath, 10km to CBD, Austin", "street" : "Ivanhoe, VIC, Australia", "city" : "Ivanhoe", "state" :"Victoria", "property_type" : "Townhouse", "room_type" : "Entire home/apt" , "bedrooms" : 3, "bathrooms" : 3, "prices" : 138, "review_scores_rating" : 10})

        self.db.customers.insert_one({ "customerId" : 2, "email" : "ginto100@gmail.com", "name" : "Ginto George", "accessToken" : "DUMMY_TEST_TOCKEN_GINTO" })

 
        self.app = aMAZE.app.test_client()
        aMAZE.db = self.db
        aMAZE.mongo_client = self.mongo_client
        print ("SETUP END")
        
    def tearDown(self):
        print ("tearDown Start : " , self.testname)
        self.db.listings.drop()
        self.db.customers.drop()
        print ("tearDown END : " , self.testname)

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


    def test_api_get_listings(self):
        """
        Test REST API /api/listings
        """
        listings_filter = {"page_index":1,"filter":{"min":{"bedrooms":1},"max":{"bedrooms":1}},"sortorder":1,"sortby":"id"}
        response = self.app.post('/api/listings', data = json.dumps(listings_filter), content_type='application/json', headers={'Authorization': 'Bearer DUMMY_TEST_TOCKEN_GINTO'})
        print ("Response status ", response)
        resp_from_server = json.loads(response.data)
        print ("Response data ", resp_from_server)

        self.assertEqual(resp_from_server['status'],"Success")
        #del resp_from_server['response']['order_request']['OrderID']  #orderid is dynamically created, cannot compare with static info

        self.assertEqual(resp_from_server, {
            'response': {
                'listings': [
                    {'bathrooms': 1, 'bedrooms': 1, 'city': 'Bulleen', 'id': 9835, 'name': 'Beautiful Room & House', 'prices': 60, 'property_type': 'House', 'review_scores_rating': 9, 'room_type': 'Private room', 'state': 'VIC', 'street': 'Bulleen, VIC, Australia'
                    }, 
                    {'bathrooms': 1, 'bedrooms': 1, 'city': 'Brunswick East', 'id': 10803, 'name': 'Beautiful Room & House', 'prices': 35, 'property_type': 'Apartment', 'review_scores_rating': 9, 'room_type': 'Private room', 'state': 'VIC', 'street': 'Bulleen, VIC, Australia'
                    }, 
                    {'bathrooms': 1.5, 'bedrooms': 1, 'city': 'Thornbury', 'id': 15246, 'name': 'Large private room-close to city', 'prices': 50, 'property_type': 'House', 'review_scores_rating': 9, 'room_type': 'Private room', 'state': 'VIC', 'street': 'Thornbury, VIC, Australia'
                    }, 
                    {'bathrooms': 1, 'bedrooms': 1, 'city': 'Australia East Melbourne', 'id': 43414, 'name': 'Home In The City', 'prices': 100, 'property_type': 'Apartment', 'review_scores_rating': 9, 'room_type': 'Private room', 'state': 'VIC', 'street': 'East Melbourne, VIC, Australia'
                    } 
                ], 
                'total_list_count': 4, 
                'total_pages': 1
            }, 
            'status': 'Success'
        })



if __name__ == "__main__":
    unittest.main()

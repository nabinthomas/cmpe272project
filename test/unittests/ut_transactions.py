import unittest
import mongomock
import json
import server.dbscripts.customer as customer

class DBTests(unittest.TestCase):
    def setUp(self):
        print ("SETUP BEGIN")
        self.client = mongomock.MongoClient()
        self.db = self.client['unittestdb']
        self.customerInfo = {"name" : "Mock User", "email": "mock_email@email.com"}
        print ("SETUP END")
        
    def tearDown(self):
        print ("tearDown")
        pass

    def test_add_customer(self):
        '''
        Test to see whether adding a customer works. 
        '''
        customerInfo = customer.add_new_customer(self.db, self.customerInfo)
        self.assertEqual(customerInfo['email'], self.customerInfo['email'])
        self.assertEqual(customerInfo['name'], self.customerInfo['name'])
        print('\r\nCustomer info from db \r\n' + str(customerInfo))

    def test_add_customer_try_duplicate(self):
        '''
        Test to make sure that adding a 2nd customer with same email address does not work. 
        '''
        customerInfo1 = customer.add_new_customer(self.db, self.customerInfo)
        customerInfo2 = customer.add_new_customer(self.db, self.customerInfo)
        self.assertEqual(customerInfo2, {})
        print('\r\nCustomer1 info from db \r\n' + str(customerInfo1))
        print('Customer2 info from db \r\n' + str(customerInfo2))

    def test_update_customer_access_token(self):
        '''
        Test to make sure we can update the customer data with the session/login
        '''
        customerInfo1 = customer.add_new_customer(self.db, self.customerInfo)
        customerPicture = "http://customer/picture/image.jpg";
        accessToken = "SECRET_TOKEN"
        updatedRecord = customer.update_customer_session_data(self.db, 
                                self.customerInfo['email'],
                                self.customerInfo['name'], 
                                customerPicture, 
                                accessToken);
        self.assertEqual(updatedRecord['email'], self.customerInfo['email'])
        self.assertEqual(updatedRecord['name'], self.customerInfo['name'])
        self.assertEqual(updatedRecord['picture'], customerPicture)
        self.assertEqual(updatedRecord['accessToken'], accessToken)
        print('\r\nUpdated Customer info from db \r\n' + str(updatedRecord))
        foundRecord = customer.find_customer_with_token(self.db, accessToken)
        print('\r\Found Customer info from db \r\n' + str(foundRecord))
        self.assertEqual(updatedRecord, foundRecord)
    
if __name__ == "__main__":
    unittest.main()

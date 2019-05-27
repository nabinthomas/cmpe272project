# This is a helper script to populate the database with base data 
# before the server start running.
import sys
import csv
import json
import pymongo 
import os 
if(len(sys.argv) == 3):
    db = pymongo.MongoClient()['test']
    db.listings.drop() #DROP the current db if present 
    filename = os.path.basename(sys.argv[1])
    cname = filename.replace(".csv","")
    col = db[cname] 
    print("filename=",filename,"  cname",cname)
    i = 0
  
    with open(sys.argv[1], 'r',encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            i = i + 1 
            data = {}
            for x in row:     
                data[x] = row[x]
            data["reviews"] = []
            col.insert_one(data) 
            #print(  "col = " , data )
    print( str(i) , "Lines imported from " , filename )
  
    
    filename = os.path.basename(sys.argv[2])
    cname = filename.replace(".csv","")
    print("filename=",filename,"  cname",cname)
    i = 0
    with open(sys.argv[2], 'r',encoding='utf-8') as csvfile:
        reviews_dic = csv.DictReader(csvfile)
        for row1 in reviews_dic:
            #print ("reviews a row = " , row1 )
            i = i + 1 
            data = {} 
            for x1 in row1:     
                data[x1] = row1[x1]
            #print ("data = " , str(data ))
            listing_id = {}
            listing_id = row1["listing_id"]
            #print ("data listing_id = " , data["listing_id"])
            #print ("data id = " , data["id"])
            #print ("data date = " , data["date"])
            #print ("data reviewer_name = " , data["reviewer_name"])

            review ={}
            listing1 = col.find_one({'id':row1["listing_id"]})
            #print ("listing1 = " , listing1)
            #print ("data listing_id = " , data["listing_id"])
            #print ("data id = " , data["id"])
            #print ("data date = " , data["date"])
            #print ("data reviewer_name = " , data["reviewer_name"])
            reviewold=listing1["reviews"]
            #{print ("1reviewold = " , reviewold)
            reviewold.append(data)
            #print ("2reviewold = " , reviewold)
            
            new_review = reviewold
            #print ("Newreview = " , str(new_review,encoding='utf-8'))
            col.find_one_and_update({'id':row1["listing_id"]}, {"$set": {'reviews': new_review}}, {'upsert': 'true'})

    print( str(i) , "Lines imported from " , filename )

else :
    print ('Usage: ' + sys.argv[0] + ' input.csv ' );

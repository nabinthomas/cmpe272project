# This is a helper script to populate the database with base data 
# before the server start running.
import sys
import csv
import json
import pymongo 
import os 
#import datetime
from datetime import datetime
if(len(sys.argv) == 4):
    #collectionname = sys.argv[3]
    #
    with open(sys.argv[3], 'r') as schemafile:
        schema = json.load(schemafile)
        #print (schema)

    db = pymongo.MongoClient()['airbnb']

    filename = os.path.basename(sys.argv[1])
    cname = filename.replace(".csv","")
    col = db[cname]
    col.drop() #Drop the listings db

    print("Importing listings ...")
    i = 0 #count the number of entries
    with open(sys.argv[1], 'r',encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            i = i + 1 
            if ((i%500) == 0):
                print(int(i/22895 * 100) , "% Complete", flush=True)
            data = {}
            entry = {}
            for key, value in row.items():
                #print(key, value);
                #print (schema[key])
                try :
                    if (schema[key] == "string"):
                        entry[key] = str(value);
                    elif (schema[key] == "number"):
                        entry[key] = int(value);
                    elif (schema[key] == "float"):
                        entry[key] = float(value);
                    elif (schema[key] == "date"):
                        entry[key] = datetime.strptime(value, '%Y-%m-%d');
                        #datetime.strptime(war_start, '%Y-%m-%d');
                        #datetime.date(value) # date(value);
                    elif (schema[key] == "dollar"):
                        entry[key] = float  (value.replace("$",""));
                except :
                    if key== None :
                        key = ""
                    if value == None:
                        value = ""
                    #Ignore the missing entries
                    #print("Missing key or value for entry=[",i,"] ",  key.encode('utf-8') , value.encode('utf-8')  , " this wont be added to DB");
            col.insert_one(entry)
    print( str(i) , " Lines imported from " , filename, " to ",cname, " collection")

    #import the reviews. Reviews are all dumped as strings. No serching on them
    print("Importing reviews ...")
    filename = os.path.basename(sys.argv[2])
    cname = filename.replace(".csv","")
    col = db[cname]
    col.drop() #Drop the review db 

    i = 0
    with open(sys.argv[2], 'r',encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            i = i + 1 
            if ((i%8000) == 0):
                print( int(i/486920 * 100) , "% Complete", flush=True)
            data = {}
            for x in row:     
                data[x] = row[x]
            data["reviews"] = []
            col.insert_one(data) 
            #print(  "col = " , data )
    print( str(i) , "Lines imported from " , filename, " to ",cname, " collection")

else :
    print ('Usage: ' + sys.argv[0] + ' listings.csv  reviews.csv  listing_schema.csv' );

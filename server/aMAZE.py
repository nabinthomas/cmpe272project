""" @package Main entry point for Web server.
"""
  
import datetime
import pytz
from flask import Flask, render_template, jsonify, request
import pymongo  
from pymongo import MongoClient
import sys

## Create the App
app = Flask(__name__)
db = None;
mongo_client = None;

########################################################################
# REST API Implementation
########################################################################
api_help_message = { "message":
"""
    API Usage:
        - GET    /api
"""}

class ReturnCodes:
    SUCCESS = "Success";
    ERROR_GENERIC = "ErrorGeneric";
    ERROR_AUTHENTICATE = "ErrorNotAuthenticated";
    ERROR_UNAUTHORIZED = "ErrorUnauthorized";
    ERROR_NOT_IMPLEMENTED = "ErrorNotImplemented";
    ERROR_INVALID_PARAM ="ErrorInvalidParam";
    ERROR_OBJECT_NOT_FOUND = "ErrorObjectNotFound"

def encodeJsonResponse(reply, statuscode):
    """
    Encodes a json response to send back to the client. 

    @param reply  -> this is a message or json object that is the result of the operation performed. 
    @param statuscode -> one of the values from ReturnCodes, for the status of the operation. 
    """
    return jsonify({ "status" : statuscode, "response" : reply});

@app.route('/api', methods=['GET'])
def help():
    """
    Default API handler. Returns the API documentation
    eg:  curl -XGET http://localhost/api
    """
    return encodeJsonResponse(api_help_message, ReturnCodes.SUCCESS);


########################################################################
# WEB UI
########################################################################
@app.route('/')
def homePage():
    """ Handle request for default page. 
    """
    now = datetime.datetime.now(pytz.timezone('US/Pacific'));

    return render_template('default.html', 
			serverTime=now, 
			pageWelcomeMessage="Welcome to Team aMAZE!", 
			pageTitle="aMAZE.com Online Book Store",
            teamMembers=["Binu Jose", "Ginto George", "Nabin Thomas", "Sandeep Panakkal"]);


########################################################################
# MAIN
########################################################################
if __name__ == '__main__':
    ## Setup environment 
    argv = sys.argv
    if len(argv) < 2:
        print("Usage: python " + sys.argv[0] + " mongodb_uri")
        exit(-1)

    mongodb_uri = argv[1]
    mongo_client = pymongo.MongoClient(mongodb_uri);
    db = mongo_client.get_database()
    
    ## Start the http server
    app.run(host='0.0.0.0', port=80);
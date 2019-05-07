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
    ## Start the http server
    app.run(host='0.0.0.0', port=80);
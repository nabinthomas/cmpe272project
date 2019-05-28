""" @package Main entry point for Web server.
"""
  
import json
import datetime
import pytz
from flask import Flask, render_template, jsonify, request, redirect
import pymongo  
from pymongo import MongoClient
import sys
import http.client
from jose import jwt
from functools import wraps
from six.moves.urllib.request import urlopen
from server.dbscripts.customer import *

## Create the App
app = Flask(__name__)
db = None;
mongo_client = None;
app.config.from_envvar('SERVER_CONFIG');

AUTH0_DOMAIN = "nthomas.auth0.com"
ALGORITHMS = ["RS256"]
API_IDENTIFIER = "https://0.0.0.0:3010/api/private"
CLIENT_ID = 'QN3TAKTeDu4U4i6tfVI2JCs7hXSxdePG'
CLIENT_SECRET = app.config['CLIENT_SECRET']

token = ""

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

@app.route('/logout', methods=['GET'])
def page_logout():
    accessToken = request.cookies.get('auth_token')
    if (accessToken is not None):
        customer = find_customer_with_token(db, accessToken)
        if (customer is not None):
            update_customer_session_data(db, customer['email'], customer['name'], '', '')

    rendered_page = render_template('logout.html', 
                LogoutMessage="You have been Logged out sucessfully",
                ExtraDetails=''
			);
    response = app.make_response(rendered_page )  
    response = clear_all_cookies(response)

    return response

@app.route('/loginfailed/<string:errorCode>', methods=['GET'])
def page_loginFailed(errorCode):
    rendered_page = render_template('logout.html', 
            LogoutMessage="Login Failed !!!",
            ExtraDetails=errorCode
        );
    response = app.make_response(rendered_page)  
    response = clear_all_cookies(response)
    return response

@app.route('/api/loginsuccess', methods=['GET'])
def loginSuccess():
    """
    API To pass successful user auth from auth0. 
    This gets the response "code" from the auth0 server and issue a redirect to locahost/api/loginsuccess

    open in browser: https://nthomas.auth0.com/authorize?response_type=code&client_id=QN3TAKTeDu4U4i6tfVI2JCs7hXSxdePG&redirect_uri=https://localhost/api/loginsuccess&scope=openid%20profile%20email&state=xyzABC123
    then login. and then this will be called with code and state as params. 
    """
    
    print ("Enter /api/loginsuccess");
    app.logger.info("Enter /api/loginsuccess")
    customerEmail = ''
    customerName = ''
    accessToken = ''
    
    loginStatus = ReturnCodes.ERROR_AUTHENTICATE;
    payload = request.args;
    print ("Client login request: [", payload, "]")

    try:
        code = request.args['code']
        state = request.args['state']
        print ("Client Code received:", code)
        print ("Client State received:", state)

        conn = http.client.HTTPSConnection("nthomas.auth0.com")

        #payload = "{\"code\":str(code),\"client_id\":\"QN3TAKTeDu4U4i6tfVI2JCs7hXSxdePG\",\"client_secret\":\"aDoe0md20-pFTGP6_XmoazFiUZdYN1Ze5CwxX21qDl1U_MaYbasmuJ4fjb7fDNlZ\",\"audience\":\"https://localhost/login\",\"grant_type\":\"client_credentials\"}"
        #payload = "grant_type=authorization_code&client_id=%24%7Baccount.clientId%7D&client_secret=YOUR_CLIENT_SECRET&code=YOUR_AUTHORIZATION_CODE&redirect_ui=https%3A%2F%2F%24%7Baccount.callback%7D"
    
        host_base_url = request.base_url
        print ("Host Base URL Was : " + host_base_url);
    
        payload = 'grant_type=authorization_code&client_id=' + CLIENT_ID + \
                    '&client_secret=' + CLIENT_SECRET + \
                    '&code=' + code + \
                    '&redirect_uri=' + host_base_url 

        fullurl = "https://" + AUTH0_DOMAIN + "/oauth/token" + payload
        print (fullurl)

        headers = { 'content-type': 'application/x-www-form-urlencoded' }

        conn.request("POST", "/oauth/token", payload, headers)

        res = conn.getresponse()
        datareceived = res.read()
        print("Data is = " , datareceived.decode("utf-8"))
        data = json.loads(datareceived.decode("utf-8"))
        print("Data was = " , datareceived.decode("utf-8"))
        try:
            id_token_payload = get_id_token_payload(data["id_token"]) 
            print("id_token_payload got  ")
            print("id_token_payload got" + json.dumps(id_token_payload) )
            customerEmail = id_token_payload ['email']
            customerName = id_token_payload['name']
            customerPicture = id_token_payload['picture']
            accessToken = data["access_token"]
            print("calling update_customer_session_data")
            update_customer_session_data(db, customerEmail, customerName, customerPicture, accessToken)
            print("calling Done update_customer_session_data")
            extraData = {
                "Received" : {
                    "code" : code,
                    "state" : state
                },
                "access_token" : data["access_token"]
            }
            loginStatus = ReturnCodes.SUCCESS;
        except Exception as e:
            print ('get_id_token_payload Failed : '+ str(e))
            loginStatus = ReturnCodes.ERROR_AUTHENTICATE;
        loginStatus = ReturnCodes.SUCCESS;
    except Exception as e:
        print ('Failed : '+ str(e))
        loginStatus = ReturnCodes.ERROR_AUTHENTICATE;

    if (loginStatus == ReturnCodes.SUCCESS):
        customer = find_customer_with_token(db, accessToken)
        if customer is None: 
            loginStatus = ReturnCodes.ERROR_AUTHENTICATE

    if (loginStatus == ReturnCodes.SUCCESS):
        redirect_to_index = redirect('/')
        response = app.make_response(redirect_to_index)  
        restrictTo = request.host
        if (restrictTo == "localhost"):
            restrictTo= None
        
        response.set_cookie('auth_token',value=accessToken, domain=restrictTo)
        response.set_cookie('userFullName',value=customer['name'], domain=restrictTo)
        response.set_cookie('customerId',value=str(customer['customerId']), domain=restrictTo)
        response.set_cookie('userEmailId',value=str(customer['email']), domain=restrictTo)
        response.set_cookie('userPicture',value=customer['picture'], domain=restrictTo)
        return response
    else:
        redirect_url = '/loginfailed/' + loginStatus
        redirect_to_index = redirect(redirect_url)
        response = app.make_response(redirect_to_index)  
        return response

########################################################################
# WEB UI hacks for disabling caching
########################################################################
@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 0 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.context_processor
def override_url_for():
    """
    Generate a new token on every request to prevent the browser from
    caching static files.
    From : https://gist.github.com/itsnauman/b3d386e4cecf97d59c94
    """
    return dict(url_for=dated_url_for)


def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


########################################################################
# Auth0 Authentication Support 
########################################################################
def get_token_auth_header():
    """Obtains the access token from the Authorization Header
    """
    auth = request.headers.get("Authorization", None)
    print (request.headers)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                        "description":
                            "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must start with"
                            " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                        "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must be"
                            " Bearer token"}, 401)

    token = parts[1]
    return token

class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


def requires_auth(f):
    """Determines if the access token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        print ("Enter requires_auth  ")
        #validate email-id and access_token 
        token = get_token_auth_header() #get access token 
        print ("Token recieved : " + token)
        customerEmail = find_customer_email(db, token)
        if(customerEmail is None) :
            print ("Exit requires_auth : Error : customer email not found")
            raise AuthError({"code": "invalid_header",
                        "description": "Invalid header. "
                        "Incorrect Access Token"}, 401) 
        return f(*args, **kwargs)
    return decorated

def get_id_token_payload(token):
    """Determines if the access token is valid
    """
     
    print ("Enter get_id_token_payload")
 
    print ("requires_auth token = " + token )
    jsonurl = urlopen("https://"+AUTH0_DOMAIN+"/.well-known/jwks.json")
    jwks = json.loads(jsonurl.read().decode("utf8"))
    print ("jwks" + jsonurl.read().decode("utf8"))

    try:
        unverified_header = jwt.get_unverified_header(token)
    except jwt.JWTError:
        raise AuthError({"code": "invalid_header",
                        "description":
                        "Invalid header. "
                        "Use an RS256 signed JWT Access Token"}, 401)
    if unverified_header["alg"] == "HS256":
        raise AuthError({"code": "invalid_header HS",
                        "description":
                        "Invalid header. "
                        "Use an HS S256 signed JWT Access Token"}, 401)
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
    print("rsa_key =", rsa_key)
    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience="QN3TAKTeDu4U4i6tfVI2JCs7hXSxdePG",
                issuer="https://"+AUTH0_DOMAIN+"/"
                
            )

            print( "payload :" , json.dumps(payload, indent=2))
            #return json.dumps(payload, indent=2)
            return  payload 
        except jwt.ExpiredSignatureError:
            raise AuthError({"code": "token_expired",
                            "description": "token is expired"}, 401)
        except jwt.JWTClaimsError as e:
            print(e)
            #print(API_IDENTIFIER)
            raise AuthError({"code": "invalid_claims",
                            "description":
                                "incorrect claims,"
                                " please check the audience and issuer"}, 401)
        except Exception:
            raise AuthError({"code": "invalid_header",
                            "description":
                                "Unable to parse authentication"
                                " token."}, 401)

def clear_all_cookies(response):
    """
    Helper function to clear Cookies set by this application. 
    Add Any additional cookies if set anywhere else to the end of the list
    """
    restrictTo = request.host
    if (restrictTo == "localhost"):
        restrictTo= None
        
    response.set_cookie('auth_token', value='', expires=0, domain=restrictTo)
    response.set_cookie('userFullName', value='', expires=0, domain=restrictTo)
    response.set_cookie('userEmailId', value='', expires=0, domain=restrictTo)
    response.set_cookie('customerId', value='', expires=0, domain=restrictTo)
    response.set_cookie('userPicture', value='', expires=0, domain=restrictTo)
    return response

########################################################################
# REST API 
########################################################################

# eg: curl -XPOST -H 'Content-Type: application/json' https://0.0.0.0/api/listings -d '{"page_index" : 2 }'
@app.route('/api/listings', methods=['POST'])
def get_listings():
    """ 
    Function to fetch listings 
    
    Input:
        page_index = request.json['page_index']
   
    Output:
        {
            "response": {
                "listings": [
                    { "name": "Beautiful Room & House.\n", 
                        ...
                    }, 
                    { "name": "Lalala Beautiful Room & House.\n", 
                        ...
                    }
                ],
                "total_list_count" : 1000, 
                "total_pages" :100
            }
            "status": "Success"
        } 
    
    Description :
        if page_index = -1 , then return the total count  and lists per pages.
        
    TODO: 
        1)proper comment 
        2) validation , error case 
    """
    
    response = {}
    list_per_index =10;
    total_list_count = db.listings.count();
    listing = db.listings.find();
    total_pages = total_list_count / list_per_index
    if (total_list_count % list_per_index) is not 0:
            total_pages = total_pages  + 1
    print ("request:", request.json)
    try :
        page_index_str = request.json['page_index']
        print ("page_index_str:",page_index_str)
        page_index = int(page_index_str)
        print ("page_index:",page_index)
        if page_index < 0 : 
            response = {"listings":[], "total_list_count": total_list_count, "total_pages":total_pages}
            returnCode = ReturnCodes.SUCCESS
        elif page_index > total_pages:
            print("Fewer pages available")
            response = {"listings":[], "total_list_count": total_list_count, "total_pages":total_pages}
            returnCode = ReturnCodes.ERROR_OBJECT_NOT_FOUND
        else :
            start = (page_index -1) * list_per_index
            end = page_index * list_per_index
            if end > total_list_count:
                    end = total_list_count
            ret_list = []
            for i in range(start-1,end-1):
                listx = listing[i]
                del listx ['_id']
                ret_list.append(listx)
            response = {"listings":ret_list, "total_list_count": total_list_count, "total_pages":total_pages}
            returnCode = ReturnCodes.SUCCESS
    except :
        response = {}
        returnCode = ReturnCodes.ERROR_INVALID_PARAM
    return encodeJsonResponse(response, returnCode);


# curl -XGET https://localhost/api/listings/9835
@app.route('/api/listings/<string:listings_id>', methods=['GET'])
def get_one_listing(listings_id):
    """  
    Function to fetch a particular listing and its reviews
    
    Input:
        listings_id =  The id of the listing 
   
    Output:
           {
            "response": {
                "listing": {
                    "access": "Kitchen, backyard", 
                    ...
                },
                "reviews": [
                    { "comments": "Very hospitable, much appreciated.\n", 
                        ...
                    }, 
                    { "comments": "Lalala hospitable, much appreciated.\n", 
                        ...
                    }
                ]
            },
            "status": "Success"
        } 
    TODO: 
        1)proper comment 
        2) validation of int(listings_id), error case 
    """

    listing = {}
    reviews = {}
    try :
        listing = db.listings.find_one({ "id" : { "$eq": int(listings_id) }  })
        del listing['_id']
        print (listing)
        reviews = db.reviews.find({"listing_id":listings_id})
        
        resp_reviews =[]
        for rev_entry in reviews:
            del rev_entry ['_id']
            resp_reviews.append(rev_entry)
            
        response = {"listing": listing, "reviews":resp_reviews}
        returnCode = ReturnCodes.SUCCESS
    except :
        response = {}
        returnCode = ReturnCodes.ERROR_OBJECT_NOT_FOUND
    return encodeJsonResponse(response, returnCode);

########################################################################
# WEB UI
########################################################################
@app.route('/')
def homePage():
    """ Handle request for home page. 
    """
    now = datetime.datetime.now(pytz.timezone('US/Pacific'));
    
    loggedinUser='Guest'

    print ("Base url with port",request.host_url)

    # TODO: Validate the auth_token and Get the Users full name from the session information. 
    if (request.cookies.get('auth_token') is not None):
        loggedinUser = request.cookies.get('userFullName')

    rendered_page = render_template('home.html', 
			            serverTime=now, 
			            pageWelcomeMessage="Welcome to aMAZE.com AirBNB Browser", 
                        userFullName=loggedinUser,
			            pageTitle="aMAZE.com AirBNB Browser",
                        teamMembers=["Binu Jose", "Ginto George", "Nabin Thomas", "Sandeep Panakkal"]);
    response = app.make_response(rendered_page);
    response.set_cookie('base_url', request.host_url);
    return response;

@app.route('/listings')
def page_books():
    """ Handle request for /books page. 
    """
    return render_template('listings.html');




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
    app.run(host='0.0.0.0', port=443, ssl_context='adhoc');
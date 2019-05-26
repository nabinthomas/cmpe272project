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
# WEB UI
########################################################################
@app.route('/')
def homePage():
    """ Handle request for default page. 
    """
    now = datetime.datetime.now(pytz.timezone('US/Pacific'));
    
    loggedinUser='Guest'

    print ("Base url with port",request.host_url)

    # TODO: Validate the auth_token and Get the Users full name from the session information. 
    if (request.cookies.get('auth_token') is not None):
        loggedinUser = request.cookies.get('userFullName')

    rendered_page = render_template('default.html', 
			            serverTime=now, 
			            pageWelcomeMessage="Welcome to aMAZE.com AirBNB Browser", 
                        userFullName=loggedinUser,
			            pageTitle="aMAZE.com AirBNB Browser",
                        teamMembers=["Binu Jose", "Ginto George", "Nabin Thomas", "Sandeep Panakkal"]);
    response = app.make_response(rendered_page);
    response.set_cookie('base_url', request.host_url);
    return response;



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
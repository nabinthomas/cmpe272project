import * as cookies from '/static/scripts/cookies.js';
'use strict';

// Step 0: In Listing.html, add the section which shows the content. Example Listing ID is part of the table heading/1st row it is 
// named with id "listings_table_heading"

// Step1 : Create the listing element class:
class ListingIDElement extends React.Component {
    constructor(props) {
        // console.log("ListingIDElement Props was " + JSON.stringify(props))
        super(props);
        this.state = {
            value : props['id']
        };
        
    }
    render() {
        // console.log("ListingIDElement: Heading was " + this.state.listingId)
        return React.createElement('b', {align : "left"}, this.state.value)
    }
}
// Add the remaining UI elements' React classes below this section
// Listing Name 
class ListingNameElement extends React.Component {
    constructor(props) {
        console.log("ListingNameElement Props was " + JSON.stringify(props))
        super(props);
        this.state = {
            value : props['name']
        };
        
    }
    render() {
        console.log("ListingNameElement:  was " + this.state.value)
        return React.createElement('b', {align : "left"}, this.state.value)
    }
}

// Listing Image 
class ListingImageElement extends React.Component {
    constructor(props) {
        console.log("ListingImageElement Props was " + JSON.stringify(props))
        super(props);
        this.state = {
            value : props['picture_url']
        };
        
    }
    render() {
        console.log("ListingImageElement:  was " + this.state.value)
        if (this.state.value && this.state.value != '') {
            console.log("ListingImageElement:  was " + this.state.value)
            return React.createElement('img', {src : this.state.value, alt: this.state.value, className: "listing_image"})
        }
        else {
            console.log("ListingImageElement:  was null " + this.state.value)
            return null;
        }
    }
}

// Host Name 
class HostNameElement extends React.Component {
    constructor(props) {
        console.log("HostNameElement Props was " + JSON.stringify(props))
        super(props);
        this.state = {
            value : props['name']
        };
        
    }
    render() {
        console.log("HostNameElement:  was " + this.state.value)
        return React.createElement('i', {align : "left"}, this.state.value)
    }
}
// Host Image 
class HostImageElement extends React.Component {
    constructor(props) {
        console.log("HostImageElement Props was " + JSON.stringify(props))
        super(props);
        this.state = {
            value : props['host']
        };
        
    }
    render() {
        console.log("HostImageElement:  was " + this.state.value)
        if (this.state.value && this.state.value.image && this.state.value.image != '') {
            console.log("HostImageElement:  was " + this.state.value.image)
            var image = React.createElement('img', {src : this.state.value.image, className : "thumnail_image" })
            return React.createElement('a', {href : this.state.value.url}, image)
        }
        else {
            console.log("HostImageElement:  was null " + this.state.value.image)
            return null;
        }
    }
}

class GenericTextData extends React.Component {
    constructor(props) {
        console.log("GenericTextData Props was " + JSON.stringify(props))
        super(props);
        this.state = {
            value : props['value']
        };
        
    }
    render() {
        console.log("GenericTextData:  was " + this.state.value)
        return React.createElement('div', {align : "left"}, this.state.value)
    }
}

class AluGuluthuData extends React.Component {
    constructor(props) {
        console.log(" BINU AluGuluthuData Props was " + JSON.stringify(props))
        super(props);
        console.log(" BINU  after super AluGuluthuData Props was " + JSON.stringify(props))
        this.state = {
            value : props['value']
        };
        
    }
    render() {
        //console.log(" BINU AluGuluthuData inside render :  was " + JSON.stringify(this.state.value))
        let  include_items = [
            //"id",
            //"listing_url",
            "scrape_id",
            "last_scraped",
            //"name",
            //"summary",
            //"space",
            //"description",
            "experiences_offered",
            //"neighborhood_overview",
            //"notes",
            //"transit",
            //"access",
            //"interaction",
            //"house_rules",
            //"thumbnail_url",
            //"medium_url",
            //"picture_url",
            //"xl_picture_url",
            "host_id",
            //"host_url",
            "host_name",
            "host_since",
            "host_location",
            //"host_about",
            "host_response_time",
            "host_response_rate",
            "host_acceptance_rate",
            "host_is_superhost",
            //"host_thumbnail_url",
            //"host_picture_url",
            //"host_neighbourhood",
            "host_listings_count",
            "host_total_listings_count",
            //"host_verifications",
            //"host_has_profile_pic",
            //"host_identity_verified",
            //"street",
            //"neighbourhood",
            //"neighbourhood_cleansed",
            //"neighbourhood_group_cleansed",
            //"city",
            //"state",
            //"zipcode",
            //"market",
            //"smart_location",
            //"country_code",
            //"country",
            "latitude",
            "longitude",
            "is_location_exact",
            "property_type",
            "room_type",
            "accommodates",
            "bathrooms",
            "bedrooms",
            "beds",
            "bed_type",
            //"amenities",
            "square_feet",
            "price",
            "weekly_price",
            "monthly_price",
            "security_deposit",
            "cleaning_fee",
            "guests_included",
            "extra_people",
            "minimum_nights",
            "maximum_nights",
            "calendar_updated",
            "has_availability",
            "availability_30",
            "availability_60",
            "availability_90",
            "availability_365",
            "calendar_last_scraped",
            "number_of_reviews",
            "first_review",
            "last_review",
            "review_scores_rating",
            "review_scores_accuracy",
            "review_scores_cleanliness",
            "review_scores_checkin",
            "review_scores_communication",
            "review_scores_location",
            "review_scores_value",
            "requires_license",
            "license",
            "jurisdiction_names",
            "instant_bookable",
            "is_business_travel_ready",
            "cancellation_policy",
            "require_guest_profile_picture",
            "require_guest_phone_verification",
            "calculated_host_listings_count",
            "reviews_per_month"];

        let rows = [];
        let cells = [];
        var i = 1;
        for (var key in this.state.value){
            var attrName = key;
            var attrValue = this.state.value[key];
            if (include_items.includes(attrName)) {

                
                cells.push(React.createElement('td', { key: "alu_key"+i } , attrName )); 
                cells.push(React.createElement('td', { key: "alu_value"+i } , JSON.stringify(attrValue))); 
                
                if (i%2 == 0) {
                    var bk_color = "bisque";
                    if (i%4 == 0) {
                    bk_color ="lightcyan";
                    }
                    var thisRow = React.createElement('tr', { bgcolor: bk_color, key: "id_alugulu_row"+i} ,  cells );
                    rows.push(thisRow);
                     cells = [];
                } 

                i++;
            }

        }

        var tBody = React.createElement('tbody', { key: "id_alugulu_tBody"} , rows ); 
        return tBody; 
    }
}
// Add the remaining UI elements' React classes above this section

// Step 2: Create & Render the element which renders the part ( eg: ListingIDElement) . 
const listingTableHeading = document.querySelector("#listings_table_heading")
var listingTableHeadingElement = ReactDOM.render(React.createElement(ListingIDElement, {id : ''}), listingTableHeading);

// Create and Render the remaining Elements under this. 
const listingNameField = document.querySelector("#listing_name")
var listingNameElement = ReactDOM.render(React.createElement(ListingNameElement, {name : ''}), listingNameField);

const listingImageField = document.querySelector("#listing_image")
var listingImageElement = ReactDOM.render(React.createElement(ListingImageElement, {picture_url : ''}), listingImageField);

const hostNameField = document.querySelector("#host_name")
var hostNameElement = ReactDOM.render(React.createElement(HostNameElement, {name : ''}), hostNameField);

const hostImageField = document.querySelector("#host_thumbnail")
var hostImageElement = ReactDOM.render(React.createElement(HostImageElement, {host : {image : '', url : ''} }), hostImageField);

const bedRoomField = document.querySelector("#bedrooms")
var bedRoomElement = ReactDOM.render(React.createElement(GenericTextData, {value : ''}), bedRoomField);

const bathRoomField = document.querySelector("#bathrooms")
var bathRoomElement = ReactDOM.render(React.createElement(GenericTextData, {value : ''}), bathRoomField);

const bedsField = document.querySelector("#beds")
var bedsElement = ReactDOM.render(React.createElement(GenericTextData, {value : ''}), bedsField);

const streetField = document.querySelector("#street")
var streetElement = ReactDOM.render(React.createElement(GenericTextData, {value : ''}), streetField);

const stateField = document.querySelector("#state")
var stateElement = ReactDOM.render(React.createElement(GenericTextData, {value : ''}), stateField);

const descriptionField = document.querySelector("#description")
var descriptionElement = ReactDOM.render(React.createElement(GenericTextData, {value : ''}), descriptionField);

const alu_guluthu_data_table = document.querySelector('#alu_guluthu_data_table');
var tmpAluGuluthuElement = ReactDOM.render(React.createElement(AluGuluthuData, {value : ''}), alu_guluthu_data_table);


// Create and Render the remaining Elements above this. 

// Step 3: Add the element which hold this data in HTML and find the ID here. 
var listingElements = {
    heading : listingTableHeadingElement,
    name : listingNameElement,
    listingImage : listingImageElement,
    hostName : hostNameElement,
    hostThumbnail : hostImageElement,
    bedrooms : bedRoomElement,
    bathrooms : bathRoomElement,
    beds: bedsElement,
    street: streetElement,
    state: stateElement,
    description: descriptionElement,
    aluguluthu : tmpAluGuluthuElement
};

class CompleteListingData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listing: {},
            reviews :[],
            elements : props
        };
    }
    componentDidMount() {
        var restAPIFetchURLBase = "/api/listings/" + listingID;
        var auth_token = cookies.getCookie('auth_token');

        fetch(restAPIFetchURLBase, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth_token
            },
             
        })
        .then(res => res.json())
        .then(response => {
            //console.log("The response from server was : ");
            //console.log("******************************\n");
            //console.log('Success:', JSON.stringify(response));
            //console.log("The response.listings from server was : ");
            //console.log("******************************\n");
          
            this.setState({listing: response['response']['listing']});
            this.setState({reviews: response['response']['reviews']});

        })
        .catch(error => console.error('Error:', error));
       
    }
    // render this component
    render() {
        console.log(" CompleteListingData Render\n");
        var listing = this.state.listing; 
        let rows = []; 
        let cells = []; 

        /* cells.push(React.createElement('td', { key: "id_bedrooms" } , listing.bedrooms ));
        cells.push(React.createElement('td', { key: "id_state" } , listing.state ));
        cells.push(React.createElement('td', { key: "id_description" } , listing.description ));
 
        //cells.push(React.createElement('td', { key: "id_lastitem" } , JSON.stringify(listing) ));

        var thisRow = React.createElement('tr', { key: "listing_row"} ,  cells );
        rows.push(thisRow); */
   
        // console.log(" CompleteListingData listing here was  = " +  this.state.elements.heading.state.listingData);
    
        // Step 4: Update the individual elements in the Web page
        if (this.state.elements.heading) {
            this.state.elements.heading.setState({value: this.state.listing.id})
        }
        
        if (this.state.elements.name) {
            this.state.elements.name.setState({value: this.state.listing.name})
        }
        //console.log("CompleteListingData Name from props = " + this.state.listing.picture_url)
        if (this.state.elements.listingImage) {
            this.state.elements.listingImage.setState({value: this.state.listing.picture_url})
        }

        if (this.state.elements.hostName) {
            this.state.elements.hostName.setState({value: this.state.listing.host_name})
        }
        
        if (this.state.elements.hostThumbnail) {
            this.state.elements.hostThumbnail.setState({value: { image: this.state.listing.host_picture_url, url: this.state.listing.host_url}});
        }

        if (this.state.elements.bedrooms) {
            this.state.elements.bedrooms.setState({value: this.state.listing.bedrooms})
        }

        if (this.state.elements.bathrooms) {
            this.state.elements.bathrooms.setState({value: this.state.listing.bathrooms})
        }

        if (this.state.elements.beds) {
            this.state.elements.beds.setState({value: this.state.listing.beds})
        }

        if (this.state.elements.street) {
            this.state.elements.street.setState({value: this.state.listing.street})
        }

        if (this.state.elements.state) {
            this.state.elements.state.setState({value: this.state.listing.state})
        }

        if (this.state.elements.description) {
            this.state.elements.description.setState({value: this.state.listing.description})
        }
        
        if (this.state.elements.aluguluthu) {
            this.state.elements.aluguluthu.setState({value: this.state.listing})
        }

        //Review starts here 
        var thisRow = React.createElement('tr', { className:"listings_table_header_style",key: "listingblank_row",align:"center" } , React.createElement('td', {colspan : 4}, 'REVIEWS') );
        rows.push(thisRow);

        var reviews = this.state.reviews; 
        for (var i = 0; i < reviews.length; i++) {
            let cells = [];
            cells.push(React.createElement('td', { key: "rev_id" } , reviews[i].id )); 
            cells.push(React.createElement('td', { key: "rev_reviewer_name" } , reviews[i].reviewer_name )); 
            cells.push(React.createElement('td', { key: "rev_date" } , reviews[i].date )); 
            cells.push(React.createElement('td', { key: "rev_comments" } , reviews[i].comments )); 
            
            var bk_color = "bisque";
            if (i%2 == 0) {
              bk_color ="lightcyan";
            } 
            var thisRow = React.createElement('tr', { bgcolor:bk_color, key: "review_row"+i} ,  cells );
            rows.push(thisRow);
        }
        return rows;  
    }
} //end class CompleteListingData

const complete_listing_data = document.querySelector('#complete_listing_data');
ReactDOM.render(React.createElement(CompleteListingData, listingElements), complete_listing_data);




 


 
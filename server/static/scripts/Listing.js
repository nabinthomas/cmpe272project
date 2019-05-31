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
    beds: bedsElement
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
        //var thisRow = React.createElement('tr', { key: "listing_row" }, JSON.stringify(listing) );
        
        
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
        console.log("CompleteListingData Name from props = " + this.state.listing.picture_url)
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
        //Review starts here 
        var thisRow = React.createElement('tr', { className:"listings_table_header_style",key: "listingblank_row",align:"center" } , " REVIEWS " );
        rows.push(thisRow);

        var reviews = this.state.reviews; 
        for (var i = 0; i < reviews.length; i++) {
            let cells = [];
            cells.push(React.createElement('td', { key: "rev_id" } , reviews[i].id )); 
            cells.push(React.createElement('td', { key: "rev_reviewer_name" } , reviews[i].reviewer_name )); 
            cells.push(React.createElement('td', { key: "rev_date" } , reviews[i].date )); 
            cells.push(React.createElement('td', { key: "rev_comments" } , reviews[i].comments )); 

            var thisRow = React.createElement('tr', { key: "review_row"} ,  cells );
            rows.push(thisRow);
        }
        return rows;  
    }
} //end class CompleteListingData



const complete_listing_data = document.querySelector('#complete_listing_data');
ReactDOM.render(React.createElement(CompleteListingData, listingElements), complete_listing_data);


 
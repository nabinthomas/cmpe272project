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
            listingId : props['id']
        };
        
    }
    render() {
        // console.log("ListingIDElement: Heading was " + this.state.listingId)
        return React.createElement('b', {align : "left"}, this.state.listingId)
    }
}
// Add the remaining UI elements' React classes below this section
// Listing Name 
class ListingNameElement extends React.Component {
    constructor(props) {
        console.log("ListingNameElement Props was " + JSON.stringify(props))
        super(props);
        this.state = {
            listingName : props['name']
        };
        
    }
    render() {
        console.log("ListingNameElement: Heading was " + this.state.listingName)
        return React.createElement('b', {align : "left"}, this.state.listingName)
    }
}
// Add the remaining UI elements' React classes above this section

// Step 2: Create & Render the element which renders the part ( eg: ListingIDElement) . 
const listingTableHeading = document.querySelector("#listings_table_heading")
var listingTableHeadingElement = ReactDOM.render(React.createElement(ListingIDElement, {listingId : ''}), listingTableHeading);

// Create and Render the remaining Elements under this. 
const listingNameField = document.querySelector("#listing_name")
var listingNameElement = ReactDOM.render(React.createElement(ListingNameElement, {listingName : ''}), listingNameField);




// Create and Render the remaining Elements above this. 

// Step 3: Add the element which hold this data in HTML and find the ID here. 
var listingElements = {
    heading : listingTableHeadingElement,
    name : listingNameElement
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
        let rows = [];
        var thisRow = React.createElement('tr', { key: "t" }, JSON.stringify(this.state.listing) );
        rows.push(thisRow);
        
        // console.log(" CompleteListingData listing here was  = " +  this.state.elements.heading.state.listingData);
    
        // Step 4: Update the individual elements in the Web page
        if (this.state.elements.heading) {
            this.state.elements.heading.setState({listingId: this.state.listing.id})
        }
        
        if (this.state.elements.name) {
            this.state.elements.name.setState({listingName: this.state.listing.name})
        }
        console.log("CompleteListingData Name from props = " + this.state.elements.name)

        var reviews = this.state.reviews;
        for (var i = 0; i < reviews.length; i++) {
            var thisRow = React.createElement('tr', { key: i, style : {width: "1000px"} }, JSON.stringify( reviews[i] ) );
            rows.push(thisRow);
        }
        return rows;  
    }
} //end class CompleteListingData



const complete_listing_data = document.querySelector('#complete_listing_data');
ReactDOM.render(React.createElement(CompleteListingData, listingElements), complete_listing_data);


 
import * as cookies from '/static/scripts/cookies.js';
'use strict';

const element = React.createElement;

class ListingsHeadingRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            headings: [
                "Listing ID",
                "Name",
                "Street",
                "City, State",
                "Property Type",
                "Room Type",
                "Bedrooms",
                "Baths",
                "Price",
                "Rating"
            ]
        };
    }

    render() {
        let cells = [];

        for (var i = 0; i < this.state.headings.length; i++) {
            cells.push(
                element('th', { key: i }, this.state.headings[i])
            );
        }
        return element(
            'tr',
            null,
            cells
        );
    }
}

var listingsPerPage = 2;

var fullDummylistData = [ 
    {
        listingID: "9835",
        name: "Beautiful Room & House",
        street: "Bulleen, VIC, Australia",
        city: "Bulleen",
        state: "VIC",
        propertyType: "House",
        roomType: "Private Room",
        bedrooms: 1,
        baths: 1,
        price: 60,
        rating: 90
    },
    {
        listingID: "9836",
        name: "Beautiful Room & House",
        street: "Bulleen, VIC, Australia",
        city: "Bulleen",
        state: "VIC",
        propertyType: "House",
        roomType: "Full House",
        bedrooms: 2,
        baths: 2,
        price: 60,
        rating: 91
    },
    {
        listingID: "9837",
        name: "Beautiful Room & House",
        street: "Bulleen, VIC, Australia",
        city: "Bulleen",
        state: "VIC",
        propertyType: "House",
        roomType: "Private Room",
        bedrooms: 3,
        baths: 1,
        price: 60,
        rating: 92
    },
    {
        listingID: "9838",
        name: "Beautiful Apartment & House",
        street: "Sydney, VIC, Australia",
        city: "Sydney",
        state: "VIC",
        propertyType: "Apartment",
        roomType: "Private Room",
        bedrooms: 4,
        baths: 1,
        price: 6000,
        rating: 10
    },

];

class ListingsData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listings: [ 
            ]
        };
    }
    componentDidMount() {
        var restAPIFetchURLBase = "/api/listings";
        var restAPIFetchParamsJson = {};
        var urlParams = new URLSearchParams(window.location.search);
        var entries = urlParams.entries();
        var pair;
        for(pair of entries) { 
            restAPIFetchParamsJson[pair[0]] = pair[1]; 
        }
        var currentPage = urlParams.get('page');
        if (currentPage == null) {
            currentPage = 1; // Default to Page 1
        }
        
        console.log("Search & Sort Criteria = " + JSON.stringify(restAPIFetchParamsJson));
        // TODO: Call Rest API to get the data, and format it to the way in the example 
        // in fullDummylistData, and then call setState with that
        {
            // This block is simulating the REST API now. 
            // Make sure Rest API returns data with these fields
            var fetchedListingData = {
                status : "Success",
                listings: [
                ]
            }

            // Fill the data to listings, only 1 page of data. 
            var fullListSize = fullDummylistData.length;
            var startingIndex = (currentPage - 1) * listingsPerPage
            var endingIndex = startingIndex + listingsPerPage
            if (endingIndex > fullListSize) {
                endingIndex = fullListSize;
            }
            var i; 
            for (i = startingIndex; i < endingIndex; i++) {
                fetchedListingData.listings.push(fullDummylistData[i]);
            }
        }
        
        this.setState({listings: fetchedListingData.listings});
        
        console.log(urlParams.toString());
        console.log(urlParams.get('page')); 
    }
    // render this component
    render() {
        let rows = [];
        for (var i = 0; i < this.state.listings.length; i++) {
            let cells = [];
            var listingId = `listingId-${i}`;
            var nameId = `name-${i}`;
            var streetId = `streetId-${i}`;
            var cityAndStateId = `cityAndState-${i}`;
            var propertyTypeId = `propertyType-${i}`;
            var roomTypeId = `roomType-${i}`;
            var bedroomsId = `bedrooms-${i}`;
            var bathsId = `baths-${i}`;
            var priceId = `price-${i}`;
            var ratingId = `rating-${i}`;
            var listingLink = element('a', {key: i, href:"/listings/" + this.state.listings[i].listingID}, this.state.listings[i].listingID);
            cells.push(element('td', { key: listingId }, listingLink));
            cells.push(element('td', { key: nameId }, this.state.listings[i].name));
            cells.push(element('td', { key: streetId }, this.state.listings[i].street));
            cells.push(element('td', { key: cityAndStateId }, this.state.listings[i].city + ", " + this.state.listings[i].state));
            cells.push(element('td', { key: propertyTypeId }, this.state.listings[i].propertyType));
            cells.push(element('td', { key: roomTypeId }, this.state.listings[i].roomType));
            cells.push(element('td', { key: bedroomsId }, this.state.listings[i].bedrooms));
            cells.push(element('td', { key: bathsId }, this.state.listings[i].baths));
            cells.push(element('td', { key: priceId }, "$" + this.state.listings[i].price.toFixed(2)));
            cells.push(element('td', { key: ratingId }, this.state.listings[i].rating));
    
            var thisRow = element(
                'tr',
                { key: `listing-${i}` },
                cells
            );
            // console.log(cells);
            // console.log(thisRow);
            rows.push(thisRow);
        }
        // console.log(rows);
        this.state.renderAgain = false;
        
        return rows;
    }
}


class PrevPageLink extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var urlParams = new URLSearchParams(window.location.search);
        var entries = urlParams.entries();
        var pair;
        var queryParamsJson = {};
        for(pair of entries) { 
            queryParamsJson[pair[0]] = pair[1]; 
        }
        var currentPage = urlParams.get('page');
        if (currentPage == null) {
            currentPage = 1; // Default to Page 1
        }
        else  {
            currentPage = Number(currentPage);
            currentPage = (currentPage == 1) ? 1 : (currentPage  - 1);
        }
        queryParamsJson['page'] = currentPage;

        var newQueryString = "";

        var key; 
        for (key in queryParamsJson) {
            if (queryParamsJson.hasOwnProperty(key)) {
                newQueryString = newQueryString + key + "=" + queryParamsJson[key] + "&";
            }
        }
        console.log("New Query String = " + newQueryString);
        return element('a', {href : '/listings?' + newQueryString}, '<<')
    }
}

class NextPageLink extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var urlParams = new URLSearchParams(window.location.search);
        var entries = urlParams.entries();
        var pair;
        var queryParamsJson = {};
        for(pair of entries) { 
            queryParamsJson[pair[0]] = pair[1]; 
        }
        var currentPage = urlParams.get('page');
        if (currentPage == null) {
            currentPage = 1; // Default to Page 1
        }
        else  {
            // Note: Not doing max page check here. 
            // Web server when processing request for maxPage+1 can instead redirect to maxPage
            currentPage = Number(currentPage);
            currentPage = (currentPage + 1);
        }
        queryParamsJson['page'] = currentPage;
        var newQueryString = "";

        var key; 
        for (key in queryParamsJson) {
            if (queryParamsJson.hasOwnProperty(key)) {
                newQueryString = newQueryString + key + "=" + queryParamsJson[key] + "&";
            }
        }
        console.log("New Query String = " + newQueryString);
        return element('a', {href : '/listings?' + newQueryString}, '>>')
    } 
}

const listings_table_heading = document.querySelector('#listings_table_heading');
ReactDOM.render(element(ListingsHeadingRow), listings_table_heading);

const listings_table_body = document.querySelector('#listings_table_body');
ReactDOM.render(element(ListingsData), listings_table_body);


const listings_prev_page_link = document.querySelector('#listings_prev_page_link');
ReactDOM.render(element(PrevPageLink), listings_prev_page_link);

const listings_next_page_link = document.querySelector('#listings_next_page_link');
ReactDOM.render(element(NextPageLink), listings_next_page_link);
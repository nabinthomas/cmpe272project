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
                "City",
                "State",
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

class ListingsData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listings: null
        };
    }
    componentDidMount() {
        var restAPIFetchURLBase = "/api/listings";
        var urlParams = new URLSearchParams(window.location.search);
        var entries = urlParams.entries();
        var pair;

        var search_filter = {};
        var search_filter_min = {};
        var search_filter_max = {};
        var sortorder_filter = 1; 
        var sortby_filter = "id";

        for(pair of entries) { 
            if(pair[1] == "") {
                continue;
            }
            switch (pair[0]) {
                
                case "city":
                case "state":
                    search_filter[pair[0]] = pair[1];
                break;
                case "bedmin": 
                    search_filter_min["bedrooms"] = Number(pair[1]);
                break;
                case "bedmax":
                    search_filter_max["bedrooms"] = Number(pair[1]);
                break;
                case "bathmin": 
                    search_filter_min["bathrooms"] = Number(pair[1]);
                break;
                case "bathmax": 
                    search_filter_max["bathrooms"] = Number(pair[1]);
                break;
                case "pricemin": 
                    search_filter_min["price"] = Number(pair[1]);;
                break;
                case "pricemax": 
                    search_filter_max["price"] = Number(pair[1]);
                break;
                case "ratingmin": 
                    search_filter_min["review_scores_rating"] = Number(pair[1]);
                break;
                case "ratingmax": 
                    search_filter_max["review_scores_rating"] = Number(pair[1]);
                break; 
                case "orderby": 
                    sortby_filter = pair[1];
                break;
                case "sortOrder":  
                    if ( pair[1] == "ascending" ) {
                        sortorder_filter = 1;
                    }
                    else {
                        sortorder_filter = -1;
                    }
            break;
            }
             
        }
        search_filter["min"] = search_filter_min;
        search_filter["max"] = search_filter_max;
        // console.log("Search & Sort Criteria = " + JSON.stringify(search_filter));

        var currentPage = urlParams.get('page');
        if (currentPage == null || Number(currentPage) == 0) {
            currentPage = 1; // Default to Page 1
        }

        //create the filter 
        var req_filter = {
            page_index : currentPage,
            filter : search_filter,
            sortorder : sortorder_filter,
            sortby : sortby_filter
        };
        // console.log("Request Filter " + JSON.stringify(req_filter));      

        var auth_token = cookies.getCookie('auth_token');

        fetch(restAPIFetchURLBase, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth_token
            },
            body: JSON.stringify(req_filter)
        })
        .then(res => res.json())
        .then(response => {
            // console.log("The response from server was : ");
            // console.log("******************************\n");
            // console.log('Success:', JSON.stringify(response));
            // console.log("The response.listings from server was : ");
            // console.log("******************************\n");
            // console.log(response['response']['listings']);
            // console.log("******************************\n");
            this.state.messagefromserver = "";
            var rentlist = []
            for (var listIndex in response['response']['listings']){
                /*  Example data needded to be in rentList. rentList 
                is an array of json objects like below. 
                [{
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
                }]
                */
        
                var formatted_listing_data = {
                    listingID : response['response']['listings'][listIndex]['id'],
                    name : response['response']['listings'][listIndex]['name'],
                    street : response['response']['listings'][listIndex]['street'],
                    city : response['response']['listings'][listIndex]['city'],
                    state : response['response']['listings'][listIndex]['state'],
                    propertyType : response['response']['listings'][listIndex]['property_type'],
                    roomType : response['response']['listings'][listIndex]['room_type'],
                    bedrooms : response['response']['listings'][listIndex]['bedrooms'],
                    baths : response['response']['listings'][listIndex]['bathrooms'],
                    price : response['response']['listings'][listIndex]['price'],
                    rating : response['response']['listings'][listIndex]['review_scores_value']
                };
                rentlist.push(
                    formatted_listing_data  
                ) ;
            }
        
            this.setState({listings: rentlist});
        
            // console.log(urlParams.toString());
            // console.log(urlParams.get('page'));
        })
        .catch(error => console.error('Error:', error));
       
    }
    // render this component
    render() {
        if (this.state.listings == null) { 
            return element('td', {align : "center", colspan : 11}, element('div', {align : "center"} , 'Contacting Server and Fetching Data...'));
        }
        let rows = [];
        for (var i = 0; i < this.state.listings.length; i++) {
            let cells = [];
            var listingId = `listingId-${i}`;
            var nameId = `name-${i}`;
            var streetId = `streetId-${i}`;
            var cityId = `city-${i}`;
            var stateId = `state-${i}`;
            var propertyTypeId = `propertyType-${i}`;
            var roomTypeId = `roomType-${i}`;
            var bedroomsId = `bedrooms-${i}`;
            var bathsId = `baths-${i}`;
            var priceId = `price-${i}`;
            var ratingId = `rating-${i}`;
            var listingLink = element('a', {key: i, href:"/listing/" + this.state.listings[i].listingID}, this.state.listings[i].listingID);
            cells.push(element('td', { key: listingId }, listingLink));
            cells.push(element('td', { key: nameId }, this.state.listings[i].name));
            cells.push(element('td', { key: streetId }, this.state.listings[i].street));
            cells.push(element('td', { key: cityId }, this.state.listings[i].city ));
            cells.push(element('td', { key: stateId }, this.state.listings[i].state));
            cells.push(element('td', { key: propertyTypeId }, this.state.listings[i].propertyType));
            cells.push(element('td', { key: roomTypeId }, this.state.listings[i].roomType));
            cells.push(element('td', { key: bedroomsId }, this.state.listings[i].bedrooms));
            cells.push(element('td', { key: bathsId }, this.state.listings[i].baths));
            cells.push(element('td', { key: priceId }, "$" + this.state.listings[i].price)); 
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
        if (rows.length == 0) {
            return element('div', {} , 'Your Query Returned no results');
        }
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
        if (currentPage == null || Number(currentPage) == 0) {
            currentPage = 1; // Default to Page 1
        }
        currentPage = Number(currentPage);
        var prevPage = (currentPage == 1) ? 1 : (currentPage  - 1);
        
        queryParamsJson['page'] = prevPage;

        var newQueryString = "";

        var key; 
        for (key in queryParamsJson) {
            if (queryParamsJson.hasOwnProperty(key)) {
                newQueryString = newQueryString + key + "=" + queryParamsJson[key] + "&";
            }
        }
        // console.log("New Query String = " + newQueryString);
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
        if (currentPage == null || Number(currentPage) == 0) {
            currentPage = 1; // Default to Page 1
        }
        // Note: Not doing max page check here. 
        // Web server when processing request for maxPage+1 can instead redirect to maxPage
        var nextPage = Number(currentPage) + 1;
        queryParamsJson['page'] = nextPage;

        var newQueryString = "";

        var key; 
        for (key in queryParamsJson) {
            if (queryParamsJson.hasOwnProperty(key)) {
                newQueryString = newQueryString + key + "=" + queryParamsJson[key] + "&";
            }
        }
        // console.log("New Query String = " + newQueryString);
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
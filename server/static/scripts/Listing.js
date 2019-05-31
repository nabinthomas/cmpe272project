import * as cookies from '/static/scripts/cookies.js';
'use strict';

class ListingData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listing: {},
            reviews :[]
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
            console.log("The response from server was : ");
            console.log("******************************\n");
            console.log('Success:', JSON.stringify(response));
            console.log("The response.listings from server was : ");
            console.log("******************************\n");
          
            this.setState({listing: response['response']['listing']});
            this.setState({reviews: response['response']['reviews']});

        })
        .catch(error => console.error('Error:', error));
       
    }
    // render this component
    render() {
        console.log(" ListingData Render\n");
        let rows = [];
        var thisRow = React.createElement('tr', { key: "t" }, JSON.stringify( this.state.listing) );
        rows.push(thisRow);

        var reviews = this.state.reviews;
        for (var i = 0; i < reviews.length; i++) {
            var thisRow = React.createElement('tr', { key: i }, JSON.stringify( reviews[i] ) );
            rows.push(thisRow);
        }
        return rows;  
    }
} //end class ListingData


const listing_table_data = document.querySelector('#listing_table_data');
ReactDOM.render(React.createElement(ListingData), listing_table_data);


 
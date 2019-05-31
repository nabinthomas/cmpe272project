import * as cookies from '/static/scripts/cookies.js';
'use strict';

const element = React.createElement;
 
class ListingData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listing: {}
        };
    }
    componentDidMount() {
        var restAPIFetchURLBase = "/api/listings/16760";
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
          
            //var urlParams = new URLSearchParams(window.location.search);
            //var entries = urlParams.entries();
            //console.log(urlParams.toString());
            //console.log(urlParams.get('listings_id'));
        })
        .catch(error => console.error('Error:', error));
       
    }
    // render this component
    render() {
        return element('tr', {} , JSON.stringify(this.state.listing));  
    }
}

const listings_table_body = document.querySelector('#listing_table_data');
ReactDOM.render(element(ListingData), listing_table_data);


 
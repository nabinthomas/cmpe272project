import * as cookies from '/static/scripts/cookies.js';
'use strict';

const element = React.createElement;

class ListingsHeadingRow extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        headings : [
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

        for (var i = 0; i < this.state.headings.length; i++){
            cells.push(
                element('th', {key:i}, this.state.headings[i])
            );
        }
        return element(
            'tr',
            null,
            cells
        );
    }
}



const listings_table_heading = document.querySelector('#listings_table_heading');
ReactDOM.render(element(ListingsHeadingRow), listings_table_heading);
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

class ListingsData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listings: [ {
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
                }
            ]
        };
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
            cells.push(element('td', { key: listingId }, this.state.listings[i].listingID));
            cells.push(element('td', { key: nameId }, this.state.listings[i].name));
            cells.push(element('td', { key: streetId }, this.state.listings[i].street));
            cells.push(element('td', { key: cityAndStateId }, this.state.listings[i].city + ", " + this.state.listings[i].state));
            cells.push(element('td', { key: propertyTypeId }, this.state.listings[i].propertyType));
            cells.push(element('td', { key: roomTypeId }, this.state.listings[i].roomType));
            cells.push(element('td', { key: bedroomsId }, this.state.listings[i].bedrooms));
            cells.push(element('td', { key: bathsId }, this.state.listings[i].baths));
            cells.push(element('td', { key: priceId }, "$" + this.state.listings[i].price.toFixed(2)));
            cells.push(element('td', { key: ratingId }, this.state.listings[i].rating));
            /*
            var addButton = element(AddToCartButton, { key: addButtonId, isbn13: this.state.books[i].ISBN13, callBackObj: inCartCopiesId, callBack: this.cartUpdated }, '');
            cells.push(element('td', { key: addButtonCellId, className: 'button_cell' }, addButton));
            */
            var thisRow = element(
                'tr',
                { key: `listing-${i}` },
                cells
            );
            console.log(cells);
            console.log(thisRow);
            rows.push(thisRow);
        }
        // console.log(rows);
        this.state.renderAgain = false;
        
        return rows;
    }
}


const listings_table_heading = document.querySelector('#listings_table_heading');
ReactDOM.render(element(ListingsHeadingRow), listings_table_heading);

const listings_table_body = document.querySelector('#listings_table_body');
ReactDOM.render(element(ListingsData), listings_table_body);
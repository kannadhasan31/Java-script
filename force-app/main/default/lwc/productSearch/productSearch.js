import { LightningElement, wire } from 'lwc';
import findProducts from '@salesforce/apex/ProductController.findProducts';

import { publish, MessageContext } from 'lightning/messageService';
import PRODUCT_SELECTED_CHANNEL from '@salesforce/messageChannel/ProductSelectedChannel__c';

const columns = [
    {
        label: 'Product Name', fieldName: 'Id', type: 'productListItemBubbling', typeAttributes: {
            productName: { fieldName: 'Name' },
        }
    },
    { label: 'Product Code', fieldName: 'ProductCode', type: 'text' },
    { label: 'Product Family', fieldName: 'Family', type: 'text' },
    { label: 'Product Description', fieldName: 'Description', type: 'text' },
];

export default class ProductSearch extends LightningElement {
    searchKey = '';
    products;
    error;
    columns = columns;

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleKeyPress(event) {
        if (event.keyCode == 13 && this.searchKey !== undefined && this.searchKey !== '') {
            this.handleSearch();
        }
    }

    handleSearch() {
        findProducts({ searchKey: this.searchKey })
            .then((result) => {
                this.products = result;
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.products = undefined;
            });
    }

    @wire(MessageContext)
    messageContext;

    // Respond to UI event by publishing message
    handleProductSelect(event) {
        const { productId, productName } = event.detail;
        const payload = { recordId: productId };
        publish(this.messageContext, PRODUCT_SELECTED_CHANNEL, payload);
    }
}
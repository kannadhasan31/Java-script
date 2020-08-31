import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPriceBookEntryList from '@salesforce/apex/ProductController.getPriceBookEntryList';
import { refreshApex } from '@salesforce/apex';

// Import message service features required for subscribing and the message channel
import { subscribe, MessageContext } from 'lightning/messageService';
import PRODUCT_SELECTED_CHANNEL from '@salesforce/messageChannel/ProductSelectedChannel__c';

const columns = [
    {
        label: 'Id', fieldName: 'Id', type: 'recordNavigation',
        typeAttributes: {
            recordId: { fieldName: 'Id' },
            label: { fieldName: 'Id' },
            object: 'PriceBookEntry',
        }
    },
    {
        label: 'Product', fieldName: 'ProductName', type: 'recordNavigation',
        typeAttributes: {
            recordId: { fieldName: 'Product2Id' },
            label: { fieldName: 'ProductName' },
            object: 'Product2',
        }
    },
    {
        label: 'Price Book', fieldName: 'PriceBookName', type: 'recordNavigation',
        typeAttributes: {
            recordId: { fieldName: 'PriceBook2Id' },
            label: { fieldName: 'PriceBookName' },
            object: 'PriceBook2',
        }
    },
    { label: 'Unit Price', fieldName: 'UnitPrice', type: 'currency' }
];


export default class PricebookList extends LightningElement {
    rowOffset = 0;
    subscription = null;
    recordId;
    columns = columns;
    data = null;

    // Standard lifecycle hooks used to sub/unsub to message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    // By using the MessageContext @wire adapter, unsubscribe will be called
    // implicitly during the component descruction lifecycle.
    @wire(MessageContext)
    messageContext;

    // Encapsulate logic for LMS subscribe.
    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            PRODUCT_SELECTED_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    // Handler for message received by component
    handleMessage(message) {
        this.recordId = message.recordId;
    }

    @wire(getPriceBookEntryList, { productId: '$recordId' })
    wiredRecord(result) {
        this._wiredResult = result;
        if (result.error) {
            this.data = null;
            this.dispatchToast(result.error);
        } else if (result.data) {
            if (result.data.length > 0) {
                var fData = [];
                for (var i = 0; i < result.data.length; i++) {
                    fData.push({
                        'Id': result.data[i].Id,
                        'ProductName': result.data[i].Product2.Name,
                        'PriceBookName': result.data[i].Pricebook2.Name,
                        'UnitPrice': result.data[i].UnitPrice,
                        'Product2Id': result.data[i].Product2.Id,
                        'PriceBook2Id': result.data[i].Pricebook2.Id
                    });
                }
                this.data = fData;
            } else {
                this.data = null;
            }
        }
    }

    // Helper
    dispatchToast(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading Product',
                message: error,
                variant: 'error'
            })
        );
    }

    refreshData() {
        return refreshApex(this._wiredResult);
    }
}
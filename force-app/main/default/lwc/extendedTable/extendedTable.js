import LightningDatatable from 'lightning/datatable';
import productListItemBubbling from './productListItemBubbling';
import recordNavigation from './recordNavigation';

export default class ExtendedTable extends LightningDatatable {
    static customTypes = {
        productListItemBubbling: {
            template: productListItemBubbling,
            typeAttributes: ['productId', 'productName']
        },
        recordNavigation: {
            template: recordNavigation,
            typeAttributes: ['label', 'recordId', 'object']
        }
    }
}
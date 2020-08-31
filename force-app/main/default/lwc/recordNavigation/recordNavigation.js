import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomNavigation extends NavigationMixin(LightningElement) {

    @api recordId;
    @api label;
    @api object;

    navigateToRecordViewPage = () => {

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: this.object,
                actionName: 'view',
            }
        });
    }
}
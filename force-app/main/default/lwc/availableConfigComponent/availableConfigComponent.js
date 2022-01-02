import { LightningElement, wire, api } from 'lwc';
import retriveConfig from '@salesforce/apex/CaseManagement.retriveConfig';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Label__c_FIELD from '@salesforce/schema/Config__c.Label__c';
import Type__c_FIELD from '@salesforce/schema/Config__c.Type__c';
import Amount__c_FIELD from '@salesforce/schema/Config__c.Amount__c';
import isAssigned__c_FIELD from '@salesforce/schema/Config__c.isAssigned__c';
import ID_FIELD from '@salesforce/schema/Config__c.Id';


const COLS = [
    { label: 'Label', fieldName: 'Label__c', type: 'Text',editable: true },
    { label: 'Type', fieldName: 'Type__c',  type: 'Text',editable: true},
    { label: 'Amount', fieldName: 'Amount__c',  type: 'Number' },
    {  label: 'AssignedState', fieldName: 'isAssigned__c', type: 'Checkbox',editable: true  } //1.label kudukanum
];


export default class AvailableConfigComponent extends LightningElement {
    
    @api recordId;
    columns = COLS;
    draftValues = [];

    @wire(retriveConfig)
    config;

    handleSave(event) {

        const fields = {}; 
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields[Label__c_FIELD.fieldApiName] = event.detail.draftValues[0].Label__c;
        fields[Type__c_FIELD.fieldApiName] = event.detail.draftValues[0].Type__c;
        fields[Amount__c_FIELD.fieldApiName] = event.detail.draftValues[0].Amount__c;
        fields[isAssigned__c_FIELD.fieldApiName] = event.detail.draftValues[0].isAssigned__c;

        const recordInput = {fields};

        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Config updated',
                    variant: 'success'
                })
            );
            // Display fresh data in the datatable
            return refreshApex(this.config).then(() => {

                // Clear all draft values in the datatable
                this.draftValues = [];

            });
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }



}
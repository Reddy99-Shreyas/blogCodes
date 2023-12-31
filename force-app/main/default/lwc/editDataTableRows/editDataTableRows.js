import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getContactBasedOnAccount from '@salesforce/apex/contactController.getContactBasedOnAccount';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import LEAD_SOURCE from '@salesforce/schema/Contact.LeadSource';

const ACTIONS = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
]

const DEFAULT_ACTIONS = [{
    label: 'All',
    checked: true,
    name: 'all'
}]

const columns = [
    { label: 'First Name', fieldName: 'FirstName', editable: true, hideDefaultActions: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true, hideDefaultActions: true },
    { label: 'Title', fieldName: 'Title', editable: true, hideDefaultActions: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true, hideDefaultActions: true },
    { label: 'Email', fieldName: 'Email', type: 'email', editable: true, hideDefaultActions: true },
    {
        label: 'Lead Source', fieldName: 'LeadSource', type: 'customPicklist', editable: true, typeAttributes: {
            options: { fieldName: 'pickListOptions' },
            value: { fieldName: 'LeadSource' },
            context: { fieldName: 'Id' }
        }, 
        hideDefaultActions: true, 
        actions: DEFAULT_ACTIONS
    },
    {
        type: 'action', typeAttributes: {
            rowActions: ACTIONS
        }
    }
];

export default class EditDataTableRows extends LightningElement {
    @api recordId;
    contactData = [];
    columns = columns;
    draftValues = [];
    contactRefreshProp;
    leadSourceOptions = [];
    viewMode = false;
    editMode = false;
    showModal = false;
    selectedRecordId;
    leadSourceActions = [];
    loadActionCompleted = false;
    contactAllData = [];

    @wire(getContactBasedOnAccount, { accountId: '$recordId', pickList: '$leadSourceOptions' })
    getContactOutput(result) {
        this.contactRefreshProp = result;
        if (result.data) {
            //this.contactData = result.data;
            console.log('Lead Source options populated');
            this.contactData = result.data.map(currItem => {
                let pickListOptions = this.leadSourceOptions;
                return {
                    ...currItem,
                    pickListOptions: pickListOptions
                };
            });
            this.contactAllData = [...this.contactData];
        } else if (result.error) {
            console.log('Error while loading contact');
        }
    }

    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: LEAD_SOURCE })
    wirePicklist({ data, error }) {
        if (data) {
            this.leadSourceOptions = data.values;
            console.log('this.leadSourceOptions', this.leadSourceOptions);
            this.leadSourceActions =[];
            data.values.forEach(currItem => {
                this.leadSourceActions.push({
                    label: currItem.label,
                    checked: false,
                    name: currItem.value
                });
            });

            this.columns.forEach(currItem => {
                if(currItem.fieldName === 'LeadSource'){
                    currItem.actions = [...currItem.actions, ...this.leadSourceActions];
                }
            });

            this.loadActionCompleted = true;
        } else if (error) {
            console.log('Error while loading data', error);
        }
    }


    async saveHandler(event) {
        //updateRecord or Apex Class

        //Access the draft values
        let records = event.detail.draftValues; //Array of modified records
        let updateRecordsArray = records.map((currItem) => {
            let fieldInput = { ...currItem };
            return {
                fields: fieldInput
            };
        });

        this.draftValues = [];
        let updateRecordArrayPromise = updateRecordsArray.map(currItem =>
            updateRecord(currItem)
        );

        await Promise.all(updateRecordArrayPromise);

        const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: 'Records updated successfully',
            variant: 'success',
        });
        this.dispatchEvent(toastEvent);

        await refreshApex(this.contactRefreshProp);
    }

    rowActionHandler(event) {
        let action = event.detail.action;
        let row = event.detail.row;
        this.selectedRecordId = row.Id;
        this.viewMode = false;
        this.editMode = false;
        this.showModal = false;

        if (action.name === 'view') {
            this.viewMode = true;
            this.showModal = true;
        } else if (action.name === 'edit') {
            this.editMode = true;
            this.showModal = true;
        } else if (action.name === 'delete') {
            this.deleteHandler();
        }
    }

    async deleteHandler() {
        // we can use deleteRecordAdapter or write an apex class for delete operation
        try {
            await deleteRecord(this.selectedRecordId);

            const evt = new ShowToastEvent({
                title: 'Success',
                message: 'Record deleted successfully',
                variant: 'success'
            });
            this.dispatchEvent(evt);

            await refreshApex(this.contactRefreshProp);
        } catch (error) {
            console.log(error);
            const evt = new ShowToastEvent({
                title: 'Error',
                message: error.body.message,
                variant: 'error'
            });
            this.dispatchEvent(evt);
        }

    }

    async closeModal(event) {
        this.showModal = false;
        if (this.editMode) {
            await refreshApex(this.contactRefreshProp);
        }
    }

    headerActionHandler(event) {
        let actionName = event.detail.action.name;
        const colDef = event.detail.columnDefinition;
        const cols = [...this.columns];

        console.log('actionName', actionName);
        console.log('colDef', colDef);

        if(actionName === 'all'){
            this.contactData = [...this.contactAllData];
        }else{
            this.contactData = this.contactAllData.filter(
                (currItem) => actionName === currItem['LeadSource']
            );
        }

        cols.find(currItem => currItem.fieldName === 'LeadSource').actions.forEach(currItem => {
            if(currItem.name === actionName){
                currItem.checked = true;
            }else{
                currItem.checked = false;
            }
        })
        this.columns = [...cols];
    }

    get displayData(){
        if(this.contactData && this.loadActionCompleted === true){
            return true;
        }else{
            return false;
        }
    }
}
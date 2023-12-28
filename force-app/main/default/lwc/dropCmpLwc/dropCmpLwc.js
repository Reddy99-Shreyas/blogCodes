import { LightningElement, track, api } from 'lwc';

export default class DropCmpLwc extends LightningElement {
    @track textinput;
    @track allvalue = [];
    @api colamsize = "";
    value = 'inProgress';

    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }

    dropElement(event) {

        this.textinput = event.dataTransfer.getData("");
        let obj = { fieldtype: this.textinput, isnormal: true, istextarea: false, isrichtexarea: false, ispicklist: false };

        if (obj.fieldtype == 'Textarea') {
            console.log('xxxx');
            obj.istextarea = true;
            obj.isnormal = false;
            console.log('ooo', obj.istextarea);
        }

        else if (obj.fieldtype == 'rich text') {
            obj.isrichtexarea = true;
            obj.isnormal = false;
        }

         else if (obj.fieldtype == 'picklist') {
            obj.ispicklist = true;
            obj.isnormal = false;
        }

        this.allvalue.push(obj);
        console.log('getData', event.dataTransfer.getData(""));
        console.log('this.allvalue  ===', JSON.stringify(this.allvalue));
        console.log('this.obj  ===', obj.fieldtype);
    }

    allowDrop(event) {
        console.log('allow', event);
        event.preventDefault();
    }
}
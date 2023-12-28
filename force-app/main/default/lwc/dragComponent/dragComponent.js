import { LightningElement, api } from 'lwc';

export default class DragComponent extends LightningElement {
    @api fieldName;
    value = '12';
    get options() {
        return [
            { label: '1', value: '12' },
            { label: '2', value: '6' },
        ];
    }
    handleDragText(event) {
        console.log('eventttttt', event);
        event.dataTransfer.setData("", event.target.dataset.item);
    }
    handleChange(event) {
        this.value = event.detail.value;
    }
}
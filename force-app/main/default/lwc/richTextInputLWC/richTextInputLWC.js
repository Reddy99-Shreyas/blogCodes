import { LightningElement,api } from 'lwc';

export default class RichTextInputLWC extends LightningElement {
    fieldValue = " ";
    fieldLabel;
    required;
    fieldLength = 32000;
    visibleLines = 3;
    @api recordId;
    validity;
    errorMessage;

    allowedFormats = [
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'indent',
        'align',
        'link',
        'image',
        'clean',
        'table',
        'header',
        'color',
        'background',
        'code',
        'code-block',
        'script',
        'blockquote',
        'direction',
    ];

    connectedCallback() {
        this.validity = true;
        document.documentElement.style.setProperty('--rta-visiblelines', (this.visibleLines * 2) + 'em');
    }

    handleChange(event) {
        if ((event.target.value).length > this.fieldLength) {
            this.validity = false;
            this.errorMessage = "You have exceeded the max length";
        }
        else {
            this.validity = true;
            this.fieldValue = event.target.value;
        }
    }
}
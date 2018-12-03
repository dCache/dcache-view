class ShareableRequestForm extends Polymer.Element
{
    static get is()
    {
        return "shareable-request-form";
    }
    static get properties()
    {
        return {
            fileName: {
                type: String,
                notify: true
            },
            activities: {
                type: Array,
                value: function () {
                    return [
                        {name: 'Download', description: '', checked: true},
                        {name: 'Upload', description: '', checked: true},
                        {name: 'Delete', description: '', checked: true},
                        {name: 'List', description: '', checked: true},
                    ];
                },
                notify: true
            },
            loading: {
                type: Boolean,
                notify: true
            },
        }
    }
    _getLink()
    {
        this.loading = true;
        this.classList.add('none');
        const activitiesList = [];
        for (let i=0; i<4; i++) {
            if (this.activities[i].checked) activitiesList.push(this.activities[i].name.toUpperCase());
        }
        this.dispatchEvent(new CustomEvent('dv-file-sharing-generate-response', {
            detail: {
                activitiesList: activitiesList,
                validity: this.$.validity.selectedItem.getAttribute("value")
            }, bubbles: true, composed: true}));
    }
}
window.customElements.define(ShareableRequestForm.is, ShareableRequestForm);
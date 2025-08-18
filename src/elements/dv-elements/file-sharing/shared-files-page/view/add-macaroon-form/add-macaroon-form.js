import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
class AddMacaroonForm extends PolymerElement {
    static get is() { return 'add-macaroon-form'; }

    static get template() {
        return html`
      <style>
        /* Include your styles here or inline them */
      </style>
      <slot></slot>
    `;
    }

    ready() {
        super.ready();
        this._textarea = this.$['macaroon-textarea'];
        this._container = this.$['macaroon-textarea-container'];
    }

    _paste() {
        navigator.clipboard.readText()
            .then(text => {
                this._textarea.value = text;
                this._validateMacaroon();
            })
            .catch(() => {
                console.warn('Failed to read clipboard contents');
            });
    }

    _delete() {
        this._textarea.value = '';
        this._clearValidation();
    }

    _add() {
        if (this._validateMacaroon()) {
            const macaroon = this._textarea.value.trim();
            this.dispatchEvent(new CustomEvent('macaroon-added', {
                detail: { macaroon },
                bubbles: true,
                composed: true,
            }));
            this._textarea.value = '';
            this._clearValidation();
        }
    }

    _validateMacaroon() {
        const val = this._textarea.value.trim();
        // Simple validation: macaroon is non-empty and valid base64 (for example)
        const base64Regex = /^[A-Za-z0-9+/=]+$/;
        const valid = val.length > 0 && base64Regex.test(val);
        if (!valid) {
            this._container.classList.add('textarea-container-error');
        } else {
            this._container.classList.remove('textarea-container-error');
        }
        return valid;
    }

    _clearValidation() {
        this._container.classList.remove('textarea-container-error');
    }
}

customElements.define(AddMacaroonForm.is, AddMacaroonForm);
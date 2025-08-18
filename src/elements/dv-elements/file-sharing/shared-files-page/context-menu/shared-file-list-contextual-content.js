/**
 * shared-file-list-contextual-content.js
 * Behavior for the shared-file-list-contextual-content Polymer component.
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
class SharedFileListContextualContent extends PolymerElement {
    static get is() { return 'shared-file-list-contextual-content'; }

    static get properties() {
        return {
            openOrView: {
                type: String,
                value: 'Open',
            },
            // You can add more properties related to file state here
            hasSelection: {
                type: Boolean,
                value: false,
                observer: '_selectionChanged',
            },
            canShare: {
                type: Boolean,
                value: false,
            },
            canRename: {
                type: Boolean,
                value: false,
            },
            canDownload: {
                type: Boolean,
                value: false,
            },
        };
    }

    ready() {
        super.ready();

        // Attach click handlers for all actionable items
        this.$.open.addEventListener('click', () => this._onAction('open'));
        this.$.changeQos.addEventListener('click', () => this._onAction('changeQos'));
        this.$.share.addEventListener('click', () => this._onAction('share'));
        this.$.rename.addEventListener('click', () => this._onAction('rename'));
        this.$.download.addEventListener('click', () => this._onAction('download'));
        this.$.metadata.addEventListener('click', () => this._onAction('metadata'));
        this.$.delete.addEventListener('click', () => this._onAction('delete'));
    }

    _selectionChanged(hasSelection) {
        // Enable or disable items based on selection
        this.$.open.disabled = !hasSelection;
        this.$.changeQos.disabled = !hasSelection;
        this.$.share.disabled = !hasSelection || !this.canShare;
        this.$.rename.disabled = !hasSelection || !this.canRename;
        this.$.download.disabled = !hasSelection || !this.canDownload;
        this.$.metadata.disabled = !hasSelection;
        // The delete button is always enabled in your markup
    }

    _onAction(action) {
        // Fire event for the action; parent listens for it
        this.dispatchEvent(new CustomEvent('contextual-action', {
            detail: { action },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define(SharedFileListContextualContent.is, SharedFileListContextualContent);
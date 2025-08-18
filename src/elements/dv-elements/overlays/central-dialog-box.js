import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { PaperDialogBehavior } from '@polymer/paper-dialog-behavior/paper-dialog-behavior.js';
import '@polymer/paper-dialog-behavior/paper-dialog-shared-styles.js';

class CentralDialogBox extends PaperDialogBehavior(PolymerElement) {
    static get template() {
        return html`
      <style include="paper-dialog-shared-styles"></style>
      <slot></slot>
    `;
    }

    static get is() {
        return 'central-dialog-box';
    }
}

customElements.define(CentralDialogBox.is, CentralDialogBox);
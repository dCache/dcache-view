import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-fab/paper-fab.js';  // Make sure paper-fab is installed
import { FilesViewerMixin } from './mixin/files-viewer-mixin.js';  // Adjust path if needed

class AdditionalTools extends FilesViewerMixin(PolymerElement) {
    static get template() {
        return html`
      <style>
        #wrapper {
          background: rgba(0, 0, 0, 0.4);
          padding: 15px 5px;
          border-radius: 10px;
          border: 1px solid #616161;
        }
        paper-fab {
          --paper-fab-keyboard-focus-background: rgb(189,189,189);
          background-color: #323232;
          width: 36px;
          height: 36px;
        }
        paper-fab + paper-fab {
          margin-top: 14px;
        }
      </style>
      <div id="wrapper">
        <paper-fab mini icon="icons:file-download" @tap="${this._download}"></paper-fab>
        <paper-fab mini icon="icons:add" @tap="${this._zoomIn}"></paper-fab>
        <paper-fab mini icon="icons:remove" @tap="${this._zoomOut}"></paper-fab>
        <paper-fab mini icon="image:rotate-left" @tap="${this._rotateLeft}"></paper-fab>
        <paper-fab mini icon="image:rotate-right" @tap="${this._rotateRight}"></paper-fab>
      </div>
    `;
    }

    static get is() {
        return 'additional-tools';
    }

    _zoomIn() {
        this.dispatchEvent(new CustomEvent('dv-namespace-files-viewer-zoom-in', { bubbles: true, composed: true }));
    }

    _zoomOut() {
        this.dispatchEvent(new CustomEvent('dv-namespace-files-viewer-zoom-out', { bubbles: true, composed: true }));
    }

    _rotateLeft() {
        this.dispatchEvent(new CustomEvent('dv-namespace-files-viewer-rotate-left', { bubbles: true, composed: true }));
    }

    _rotateRight() {
        this.dispatchEvent(new CustomEvent('dv-namespace-files-viewer-rotate-right', { bubbles: true, composed: true }));
    }

    _download() {
        this.dispatchEvent(new CustomEvent('dv-namespace-files-viewer-download', { bubbles: true, composed: true }));
    }
}

customElements.define(AdditionalTools.is, AdditionalTools);
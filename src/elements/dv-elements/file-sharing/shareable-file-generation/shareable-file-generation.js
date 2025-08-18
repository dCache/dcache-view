import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

import '../shareable-request-form/shareable-request-form.js';
import '../shareable-successful-page/shareable-successful-page.js';
import '../shareable-error-page/shareable-error-page.js';

class ShareableFileGeneration extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          margin: 0 -24px !important;
          width: 80vw;
          height: 80vh;
          font-size: 0.8em;
          background: #fff;
          box-sizing: border-box;
          padding: 0 !important;
        }
        app-toolbar {
          height: 40px;
          min-height: 40px;
          letter-spacing: .0125em;
          -webkit-font-smoothing: antialiased;
          background: #fff;
          color: #222;
          font-weight: normal;
          line-height: 24px;
          font-size: 20px;
          padding: 0 10px;
          border-bottom: 1px solid rgba(208,208,208,.87);
        }
        app-toolbar paper-icon-button {
          color: rgba(0,0,0,.87);
          padding: 0;
          width: 20px;
          height: 20px;
        }
        #content {
          flex: 1 1 auto;
          display: flex;
        }
        .loading, .none {
          display: none;
        }
        .loading[is-loading] {
          position: absolute;
          height: calc(100% - 40px);
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 0.8em;
        }
        .loading paper-spinner {
          width: 40px;
          height: 40px;
        }
      </style>

      <app-toolbar>
        <div main-title>Share file</div>
        <paper-icon-button icon="close" @click="_handleClose"></paper-icon-button>
      </app-toolbar>

      <div id="content" class$="[[_computedClass(loading)]]">
        <shareable-request-form
          id="form"
          loading="{{loading}}"
          file-path="[[fullPath]]"
          file-name="[[fileName]]"
          file-type="[[fileType]]">
        </shareable-request-form>
      </div>

      <div class="loading" is-loading$="[[loading]]">
        <paper-spinner alt="waiting for response" active="[[loading]]"></paper-spinner>
        <span>processing your request ...</span>
      </div>
    `;
    }

    static get properties() {
        return {
            loading: {
                type: Boolean,
                value: false,
                notify: true,
            },
            fullPath: String,
            fileName: String,
            fileType: String,
        };
    }

    _computedClass(loading) {
        return loading ? 'loading' : 'none';
    }

    _handleClose() {
        // You can emit an event or handle dialog dismissal here
        this.dispatchEvent(new CustomEvent('close-request', { bubbles: true, composed: true }));
    }
}

customElements.define('shareable-file-generation', ShareableFileGeneration);
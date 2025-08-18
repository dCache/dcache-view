import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../files-viewer/json/json-viewer.js';

class RawFileMetadata extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          -webkit-font-smoothing: antialiased;
        }
        .paper-material {
          background: #fff;
          margin: 10px;
          padding: 5px;
          border-radius: 4px;
          border: 1px solid #bbb;
        }
      </style>
      <div class="paper-material">
        <json-viewer json="[[metadata]]"></json-viewer>
      </div>
    `;
    }

    static get properties() {
        return {
            metadata: {
                type: Object,
                notify: true,
            },
            isLoading: {
                type: Boolean,
                value: true,
                notify: true,
            },
        };
    }
}

customElements.define('raw-file-metadata', RawFileMetadata);
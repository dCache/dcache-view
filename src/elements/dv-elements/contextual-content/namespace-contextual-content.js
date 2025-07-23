import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-icon-item.js';
import '@polymer/iron-icon/iron-icon.js';

// Import your custom components as needed
import '../files-viewer/files-viewer.js';
import '../qbi-dialog-content/qbi-dialog-content.js';
import '../file-sharing/shareable-file-generation/shareable-file-generation.js';

class NamespaceContextualContent extends PolymerElement {
    static get is() {
        return 'namespace-contextual-content';
    }

    static get properties() {
        return {
            currentDir: {type: Boolean, notify: true},
            multipleSelection: {type: Boolean, notify: true},
            singleSelection: {type: Boolean, notify: true},
            targetNode: {type: Object},
            currentPath: {type: String},
            openOrView: {type: String, notify: true}
        };
    }

    static get template() {
        return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          max-width: 100%;
        }
        paper-listbox {
          margin: -20px;
          padding: 0;
          background: transparent;
        }
        paper-icon-item:hover {
          background: #1565C0;
          color: #fff;
          font-size: 0.7em;
          min-height: 30px;
          font-weight: normal;
          padding-right: 0;
          padding-left: 5px;
          border-radius: 4px;
          --paper-item-icon: {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            color: #fff;
          };
        }
        paper-icon-item {
          background: transparent;
          font-size: 0.7em;
          min-height: 30px;
          font-weight: normal;
          padding-right: 0;
          padding-left: 5px;
          --paper-item-icon: {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            color: #4e4e4e;
          };
        }
        paper-icon-item[disabled] > iron-icon {
          color: #b7b7b7;
        }
        .none {
          display: none;
        }
      </style>

      <paper-listbox>
        <paper-icon-item id="open">
          <iron-icon icon="visibility" slot="item-icon"></iron-icon>
          [[openOrView]]
        </paper-icon-item>

        <paper-icon-item id="rename">
          <iron-icon icon="editor:border-color" slot="item-icon"></iron-icon>
          Rename
        </paper-icon-item>

        <paper-icon-item id="delete">
          <iron-icon icon="delete" slot="item-icon"></iron-icon>
          Delete
        </paper-icon-item>
      </paper-listbox>
    `;
    }

    constructor() {
        super();
        // Custom initialization logic
    }

    connectedCallback() {
        super.connectedCallback();
        this.$.open.addEventListener('tap', () => this._openOrDownload());
        this.$.rename.addEventListener('tap', () => this._rename());
        this.$.delete.addEventListener('tap', () => this._delete());
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.$.open.removeEventListener('tap', this._openOrDownload);
        this.$.rename.removeEventListener('tap', this._rename);
        this.$.delete.removeEventListener('tap', this._delete);
    }

    _openOrDownload() {
        console.log('Opening or downloading', this.targetNode);
    }

    _rename() {
        console.log('Renaming', this.targetNode);
    }

    _delete() {
        console.log('Deleting', this.targetNode);
    }
}

customElements.define(NamespaceContextualContent.is, NamespaceContextualContent);
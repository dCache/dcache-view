import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-input/paper-input.js';
//import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-icon/iron-icon.js';

// Optional: import custom icons if needed
//import './set-label-icons.js'; // ← Only if you have custom icons like "setLabel:close"

export class SetLabel extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        #headerContainer {
          display: flex;
          height: 50px;
          align-items: center;
          border-bottom: 1px solid #d6d6d6;
          background-color: #fff;
          color: #333;
        }
        .flex {
          flex-grow: 1;
        }
        .flex2 {
          flex-grow: 2;
        }
        paper-input iron-icon {
          margin-right: 13px !important;
        }
        .buttons {
          display: flex;
          height: 50px;
          align-items: center;
          justify-content: flex-end;
        }
        #createBtn {
          background-color: #3284e1;
          color: white !important;
        }
        paper-button {
          text-transform: capitalize !important;
        }
        .hide {
          display: none !important;
        }
        .show {
          display: block;
        }
        app-toolbar {
          height: 60px;
          background: #616161;
          color: #fff;
        }
      </style>

      <div>
        <app-toolbar class$="[[_comptedClass(header, 'toolbar')]]">
          <div main-title="">Add a new label to the FILE</div>
          <paper-icon-button icon="setLabel:close" on-tap="_closeHandler"></paper-icon-button>
        </app-toolbar>

        <div id="headerContainer" class$="[[_comptedClass(header, 'div')]]">
          <div class="flex"><h3>Add a new label</h3></div>
          <span class="flex2"></span>
          <paper-icon-button icon="setLabel:close" on-tap="_closeHandler"></paper-icon-button>
        </div>

        <div class="flex" style="margin-top: 20px;">
          <iron-a11y-keys target="[[target]]" keys="esc enter" on-keys-pressed="_action"></iron-a11y-keys>
          <span>
            This label will be added to the
            <code style="color: red;">[[currentFileName]]</code> file
          </span>
          <paper-input
            id="labelValueInput"
            label="label value"
            value="{{labelValue::input}}"
            auto-validate
            pattern="[^/]*"
            error-message="[[message]]"
            required
            preventinvalidinput
            tabindex="1"
            autofocus
          >
            <iron-icon icon="setLabel:folder" slot="prefix"></iron-icon>
          </paper-input>
        </div>

        <br />
        <div class="buttons">
          <paper-button id="cancelBtn" on-tap="_closeHandler" raised>Cancel</paper-button>
          <paper-button id="createBtn" on-tap="_createHandler" raised>Create</paper-button>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'set-label';
  }

  static get properties() {
    return {
      header: {
        type: Boolean,
        value: true,
        notify: true,
      },
      currentFileName: {
        type: String,
        notify: true,
      },
      labelValue: {
        type: String,
        notify: true,
        observer: '_errorTrigger',
      },
      target: {
        type: Object,
        value: () => document.body,
      },
      message: {
        type: String,
        notify: true,
      },
    };
  }

  _errorTrigger(labelValue) {
    this.__sanityCheck(labelValue, true);
  }

  __sanityCheck(x, y) {
    if (y) {
      if (!x || x.includes('/')) {
        this.message = 'Label name cannot be empty or contain forward slash!';
        return true;
      }
      return false;
    } else {
      if (!x) {
        this.message = 'Specify the full path of the current directory.';
        return true;
      }
      return false;
    }
  }

  _action(e) {
    e.detail.combo === 'enter' ? this._createHandler(e) : this._closeHandler(e);
  }

  _createHandler(e) {
    if (!this.__sanityCheck(this.labelValue, true)) {
      this.dispatchEvent(new CustomEvent('setlabel', {
        detail: { labelValue: this.labelValue }
      }));
    }
  }

  _closeHandler(e) {
    this.dispatchEvent(new CustomEvent('close', { detail: {} }));
  }

  // You can define _comptedClass here if needed:
  _comptedClass(header, type) {
    // Replace with your logic
    return '';
  }
}

customElements.define(SetLabel.is, SetLabel);
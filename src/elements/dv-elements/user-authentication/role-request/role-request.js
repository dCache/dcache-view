import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';

// Assuming DcacheViewMixins.Commons is an importable mixin,
// otherwise you need to import it or rewrite accordingly
import { Commons } from './dcache-view-mixins.js'; // adjust path

class ChangeQosContextualMenu extends Commons(PolymerElement) {
    static get template() {
        return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          max-width: 100%;
        }
        :host paper-listbox {
          margin: -20px;
          padding: 0;
          background: transparent;
        }
        .menuItem:hover {
          background: #1565C0;
          border-radius: 4px;
          color: #fff;
        }
        .menuItem {
          font-size: 0.7em;
          min-height: 30px;
          font-weight: normal;
          padding-right: 0;
          padding-left: 5px;
        }
      </style>
      <paper-listbox class="menu-content">
        <template is="dom-repeat" items="[[possibleTransition]]" as="item">
          <paper-item class="menuItem"
                      on-click="_changeQos"
                      disabled$="[[_computedDisabled(item.backendCapability.name, currentQos)]]">
            [[item.backendCapability.name]]
          </paper-item>
        </template>
      </paper-listbox>
    `;
    }

    static get is() { return 'change-qos-contextual-menu'; }

    static get properties() {
        return {
            path: {
                type: String,
                notify: true
            },
            index: {
                type: Number,
                notify: true
            },
            currentQos: {
                type: String,
                notify: true
            },
            possibleTransition: {
                type: Array,
                value: () => window.CONFIG.qos,
                notify: true
            },
            targetNode: Object,
            authenticationParameters: Object
        };
    }

    constructor() {
        super();
        this.index = -1; // default value
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('dv-namespace-receive-item-index', this._updateIndex);
        this.dispatchEvent(new CustomEvent('dv-namespace-request-item-index', {
            detail: { item: this.targetNode.fileMetaData },
            bubbles: true,
            composed: true
        }));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('dv-namespace-receive-item-index', this._updateIndex);
    }

    _updateIndex = (e) => {
        this.index = e.detail.index;
    };

    _changeQos(e) {
        this.dispatchEvent(new CustomEvent('dv-namespace-close-subcontextmenu', {
            bubbles: true,
            composed: true
        }));
        this.dispatchEvent(new CustomEvent('dv-namespace-close-centralcontextmenu', {
            bubbles: true,
            composed: true
        }));

        const namespace = document.createElement('dcache-namespace');
        namespace.auth = this.getAuthValue();

        namespace.promise.then(() => {
            this.dispatchEvent(new CustomEvent('dv-namespace-show-message-toast', {
                detail: { message: `Request successful! File in transition.` },
                bubbles: true,
                composed: true
            }));
            this.dispatchEvent(new CustomEvent('qos-in-transition', {
                detail: {
                    options: {
                        currentQos: this.currentQos,
                        targetQos: e.model.item.backendCapability.name,
                        itemIndex: this.index,
                        path: this.path
                    }
                },
                bubbles: true,
                composed: true
            }));
        }).catch((err) => {
            this.dispatchEvent(new CustomEvent('dv-namespace-show-message-toast', {
                detail: { message: `${err.message}` },
                bubbles: true,
                composed: true
            }));
        });

        namespace.qos({
            url: `${window.CONFIG["dcache-view.endpoints.webapi"]}namespace`,
            path: this.path,
            target: e.model.item.backendCapability.name
        });
    }

    _computedDisabled(buttonName, currentQos) {
        if (buttonName === currentQos) {
            return true;
        }
        for (let i = 0; i < window.CONFIG.qos.length; i++) {
            if (window.CONFIG.qos[i].backendCapability.name === currentQos) {
                return !window.CONFIG.qos[i].backendCapability.transition.includes(buttonName);
            }
        }
        return true;
    }
}

customElements.define(ChangeQosContextualMenu.is, ChangeQosContextualMenu);

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';

// Replace this with your actual Commons mixin import
import { Commons } from '../utils/mixins/commons.js';
const Commons = (base) => base; // TEMP fallback if mixin is unavailable

class ChangeQosContextualMenu extends Commons(PolymerElement) {
    static get is() {
        return 'change-qos-contextual-menu';
    }

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
        <template is="dom-repeat" items="[[possibleTransition]]">
          <paper-item
            on-click="_changeQos"
            class="menuItem"
            disabled$="[[_computedDisabled(item.backendCapability.name, currentQos)]]"
          >
            [[item.backendCapability.name]]
          </paper-item>
        </template>
      </paper-listbox>
    `;
    }

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
            targetNode: {
                type: Object
            }
        };
    }

    constructor() {
        super();
    }

    initialize(t, authentication) {
        this.path = this.encodePath(t.filePath);
        this.currentQos = t.fileMetaData.currentQos;
        this.targetNode = t;
        if (authentication) {
            this.authenticationParameters = authentication;
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this._boundIndexHandler = (e) => {
            this.index = e.detail.index;
        };
        window.addEventListener('dv-namespace-receive-item-index', this._boundIndexHandler);

        this.dispatchEvent(
            new CustomEvent('dv-namespace-request-item-index', {
                detail: { item: this.targetNode.fileMetaData },
                bubbles: true,
                composed: true
            })
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('dv-namespace-receive-item-index', this._boundIndexHandler);
    }

    _changeQos(e) {
        this.dispatchEvent(new CustomEvent('dv-namespace-close-subcontextmenu', { bubbles: true, composed: true }));
        this.dispatchEvent(new CustomEvent('dv-namespace-close-centralcontextmenu', { bubbles: true, composed: true }));

        const namespace = document.createElement('dcache-namespace');
        namespace.auth = this.getAuthValue();

        namespace.promise
            .then(() => {
                this.dispatchEvent(
                    new CustomEvent('dv-namespace-show-message-toast', {
                        detail: { message: `Request successful! File in transition.` },
                        bubbles: true,
                        composed: true
                    })
                );
                this.dispatchEvent(
                    new CustomEvent('qos-in-transition', {
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
                    })
                );
            })
            .catch((err) => {
                this.dispatchEvent(
                    new CustomEvent('dv-namespace-show-message-toast', {
                        detail: { message: `${err.message}` },
                        bubbles: true,
                        composed: true
                    })
                );
            });

        namespace.qos({
            url: `${window.CONFIG['dcache-view.endpoints.webapi']}namespace`,
            path: this.path,
            target: e.model.item.backendCapability.name
        });
    }

    _computedDisabled(buttonName, currentQos) {
        if (buttonName === currentQos) return true;

        const current = window.CONFIG.qos.find(
            (q) => q.backendCapability.name === currentQos
        );

        return !(current && current.backendCapability.transition.includes(buttonName));
    }
}

customElements.define(ChangeQosContextualMenu.is, ChangeQosContextualMenu);
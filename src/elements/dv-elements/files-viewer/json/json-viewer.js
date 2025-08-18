import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-spinner/paper-spinner.js';

class JsonViewer extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          margin: auto;
          width: 100%;
          height: 100%;
        }
        div {
          width: 100%;
          height: 100%;
          overflow: scroll;
          background: var(--json-viewer-background-color, #fff);
        }
        .string {
          color: green;
        }
        .number {
          color: darkorange;
        }
        .boolean {
          color: blue;
        }
        .null {
          color: magenta;
        }
        .key {
          color: red;
        }
      </style>
      <div>
        <pre id="preTag"></pre>
        <paper-spinner active="[[isLoading]]"></paper-spinner>
      </div>
    `;
    }

    static get is() { return 'json-viewer'; }

    static get properties() {
        return {
            json: {
                type: Object,
                notify: true,
                observer: '_render'
            },
            isLoading: {
                type: Boolean,
                value: true,
                notify: true
            }
        };
    }

    _prettyPrintJSON(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            (match) => {
                let cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return `<span class="${cls}">${match}</span>`;
            }
        );
    }

    _render(json) {
        if (json === undefined) {
            this.isLoading = true;
        } else {
            this.$.preTag.innerHTML = this._prettyPrintJSON(JSON.stringify(json, undefined, 4));
            this.isLoading = false;
            this.dispatchEvent(
                new CustomEvent('dv-namespace-files-viewer-finished-loading', { bubbles: true, composed: true })
            );
        }
    }
}

customElements.define(JsonViewer.is, JsonViewer);

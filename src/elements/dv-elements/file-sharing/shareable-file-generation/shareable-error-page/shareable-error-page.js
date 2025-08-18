import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';

class ShareableErrorPage extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          display: flex;
          width: 100%;
          box-sizing: border-box;
          padding: 0 10px;
          justify-content: center;
          align-items: center;
        }
        iron-icon {
          color: #f50303;
          height: 5em;
          width: 5em;
        }
        .container {
          display: flex;
          width: 200px;
          height: 250px;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          background-color: #f3f3f3;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          border: 20px solid #f5f5f5;
        }
        .message, .contact {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .code {
          border-top: solid 1px #ccc;
          border-bottom: solid 1px #ccc;
        }
        .contact {
          color: #03a9f4;
        }
      </style>

      <div class="container">
        <div>
          <iron-icon icon="icons:warning"></iron-icon>
        </div>
        <div class="message">
          <div>
            <div>
              <h4>Sharing request failed.</h4>
            </div>
            <div class="code">
              <code>[[error.message]]</code>
            </div>
          </div>
          <div class="contact">
            <span>
              Please contact your admin.
            </span>
          </div>
        </div>
      </div>
    `;
    }

    static get properties() {
        return {
            error: {
                type: Object,
                notify: true,
            }
        };
    }
}

customElements.define('shareable-error-page', ShareableErrorPage);

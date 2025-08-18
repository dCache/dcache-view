import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/iron-input/iron-input.js';

// You’ll need to import or define UserAuthentication, store, normaliseCredentialFormat, page yourself

class LoginForm extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          display: block;
        }
        #container {
          width: 300px;
        }
        #container paper-input-container {
          width: 100%;
          --paper-input-container-color: #9c9c9c;
          --paper-input-container-input-color: #fff;
          --paper-input-container-focus-color: #00b4f0;
        }
        input[is="iron-input"]::placeholder {
          color: #fff !important;
        }
        #container #login-button {
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }
        #login-button paper-button {
          margin: 20px 0 0 0;
          padding-left: 30px;
          padding-right: 30px;
          background: #00b4f0;
          color: #fff;
        }
        #container > .messageContainer {
          width: 100%;
          margin-top: 10px;
          background: rgba(161,48,41,0.9);
          padding: 10px;
          box-sizing: border-box;
        }
        .error-message {
          color: #fff;
          font-size: 0.71em;
        }
        .hide {
          display: none;
        }
        .show {
          display: block;
        }
        paper-checkbox {
          --paper-checkbox-checked-color: #ff625d;
          --paper-checkbox-checked-ink-color: #fff;
          --paper-checkbox-unchecked-color: #e0e0e0;
          --paper-checkbox-unchecked-ink-color: #e0e0e0;
          --paper-checkbox-label-color: #fff;
          --paper-checkbox-label-checked-color: #e0e0e0;
          --paper-checkbox-checkmark-color: #fff;
          --paper-checkbox-label: {
            font-size: 0.71em;
          }
        }
        .checkbox-container {
          display: flex;
          align-items: center;
        }
        .flex {
          flex: 1 1 auto;
        }
        .info-class {
          display: inline-block;
          padding-left: 5px;
        }
        .info-icon {
          width: 15px;
          height: 15px;
          fill: #f2f4f4;
        }
      </style>
      <div id="container">
        <iron-a11y-keys keys="enter" on-keys-pressed="_login"></iron-a11y-keys>
        <paper-input-container always-float-label>
          <label slot="label">Username</label>
          <input is="iron-input" slot="input" name="username" id="username" value="{{username::input}}" placeholder="username" autofocus>
        </paper-input-container>
        <paper-input-container always-float-label>
          <label slot="label">Password</label>
          <input is="iron-input" slot="input" name="password" id="password" value="{{password::input}}" placeholder="password" type="password">
        </paper-input-container>
        <div class="checkbox-container">
          <span class="flex"></span>
          <paper-checkbox checked="{{useGravatar}}">Use Gravatar</paper-checkbox>
          <div class="info-class">
            <iron-icon icon="info" class="info-icon"></iron-icon>
            <paper-tooltip>
              A Gravatar is a Globally Recognized Avatar (See https://en.gravatar.com/). If this option is checked, a request will be sent to Gravatar.
            </paper-tooltip>
          </div>
        </div>
        <div class$="[[_computedClass(errorMessage)]]">
          <span class="error-message">[[errorMessage]]</span>
        </div>
        <div id="login-button">
          <paper-button on-click="_login" raised>Login</paper-button>
        </div>
      </div>
    `;
    }

    static get is() { return 'login-form'; }

    static get properties() {
        return {
            username: {
                type: String,
                notify: true,
            },
            password: {
                type: String,
                notify: true,
            },
            errorMessage: {
                type: String,
                notify: true,
            },
            redirectTo: {
                type: Object,
                notify: true,
            },
            useGravatar: {
                type: Boolean,
                value() {
                    return sessionStorage.useGravatar === 'yes';
                },
                notify: true,
                observer: '_useGravatarChanged',
            },
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.$.username.focus();
    }

    _login() {
        if (!this.username || !this.password) {
            this.errorMessage = 'Please enter your username and password to login.';
            return;
        }

        if (!!sessionStorage.getItem('hasAuthClientCertificate') && this.username !== sessionStorage.getItem('name')) {
            this.errorMessage = 'Unacceptable request! The username you provided must correspond to your certificate username.';
            return;
        }

        const auth = window.btoa(`${this.username}:${this.password}`);

        const userAuth = new UserAuthentication(auth);
        userAuth.addEventListener('dv-user-authentication-successful', e => {
            e.detail.credential.password = `:${this.password}`;
            store(normaliseCredentialFormat(e.detail.credential));
            this.dispatchEvent(new CustomEvent('dv-namespace-show-message-toast', {
                detail: { message: e.detail.message },
                bubbles: true,
                composed: true,
            }));
            switch (this.redirectTo.page) {
                case 'home':
                    page('/');
                    this.dispatchEvent(new CustomEvent('dv-namespace-ls-path', {
                        detail: { path: this.redirectTo.path },
                        bubbles: true,
                        composed: true,
                    }));
                    break;
                case 'stay':
                    // do nothing
                    break;
                default:
                    page(`/${this.redirectTo.page}`);
                    break;
            }
            this.dispatchEvent(new CustomEvent('dv-authentication-successful', {
                detail: {
                    message: e.detail.message,
                    roles: e.detail.credential.roles || '',
                },
                bubbles: true,
                composed: true,
            }));
        });
        userAuth.addEventListener('dv-user-authentication-error', e => {
            this.errorMessage = e.detail.message;
        });
        userAuth.send('Basic');
    }

    _computedClass(errMessage) {
        return errMessage ? 'messageContainer show' : 'hide';
    }

    _useGravatarChanged(useGravatar) {
        sessionStorage.useGravatar = useGravatar ? 'yes' : 'no';
    }
}

customElements.define(LoginForm.is, LoginForm);

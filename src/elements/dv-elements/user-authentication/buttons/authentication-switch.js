// authentication-switch.js
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './login-button.js';
import '../../user-profile/user-profile-dropdown/user-profile-dropdown.js';
import { removeAllChildren } from './utils.js'; // You'll need to implement or import this helper
import page from 'page'; // if you're using the `page.js` routing library

class AuthenticationSwitch extends PolymerElement {
    static get template() {
        return html`
      <style>
        .none {
          display: none;
        }
      </style>
      <div id="container"></div>
    `;
    }

    static get is() {
        return 'authentication-switch';
    }

    static get properties() {
        return {
            currentRoute: {
                type: String,
                notify: true,
            },
            currentPath: {
                type: String,
                notify: true,
            },
        };
    }

    constructor() {
        super();
        this._successfulListener = this._successfulAuthenticationListener.bind(this);
        this._errorListener = this._failedAuthenticationListener.bind(this);
        this._setCurrentPath_ = this._setCurrentPath.bind(this);
    }

    ready() {
        super.ready();
        this.$.container.addEventListener('dv-authentication-req-login', this._login.bind(this));
        // After render toggle
        this.updateComplete.then(() => this._toggle());
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('dv-authentication-successful', this._successfulListener);
        window.addEventListener('dv-authentication-error', this._errorListener);
        window.addEventListener('dv-namespace-current-path', this._setCurrentPath_);

        this.dispatchEvent(
            new CustomEvent('dv-namespace-request-current-path', {
                bubbles: true,
                composed: true,
            })
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('dv-authentication-successful', this._successfulListener);
        window.removeEventListener('dv-authentication-error', this._errorListener);
        window.removeEventListener('dv-namespace-current-path', this._setCurrentPath_);
    }

    _successfulAuthenticationListener() {
        this._toggle();
    }

    _failedAuthenticationListener() {
        this._toggle();
    }

    _toggle() {
        removeAllChildren(this.$.container);
        const name = sessionStorage.getItem('name');
        if (!name) {
            this.$.container.appendChild(document.createElement('login-button'));
        } else {
            const userProfile = document.createElement('user-profile-dropdown');
            userProfile.setAttribute('name', name);
            userProfile.setAttribute('email', sessionStorage.getItem('email') || '');
            userProfile.setAttribute('tag-name', this.tagName);
            this.$.container.appendChild(userProfile);
        }
    }

    _login() {
        switch (this.currentRoute) {
            case 'home':
                page(`/user-login?r=${encodeURIComponent(`"page":"home","path":"${this.currentPath}"`)}`);
                break;
            case 'admin-component-page':
                page(`/user-login?r=${encodeURIComponent(`"page":"${window.location.hash.substr(3)}"`)}`);
                break;
            default:
                page(`/user-login?r=${encodeURIComponent(`"page":"${this.currentRoute}"`)}`);
                break;
        }
    }

    _setCurrentPath(e) {
        this.currentPath = e.detail.currentPath;
    }
}

customElements.define(AuthenticationSwitch.is, AuthenticationSwitch);

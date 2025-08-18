// login-button.js
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';

class LoginButton extends PolymerElement {
    static get template() {
        return html`
      <style>
        paper-button {
          border: 1px solid white;
          text-transform: initial;
          font-size: 0.7em;
        }
      </style>
      <paper-button on-click="_login">log in</paper-button>
    `;
    }

    static get is() {
        return 'login-button';
    }

    _login() {
        this.dispatchEvent(
            new CustomEvent('dv-authentication-req-login', { bubbles: true, composed: true })
        );
    }
}

customElements.define(LoginButton.is, LoginButton);

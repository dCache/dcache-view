class LoginButton extends Polymer.Element
{
  static get template() {
    return Polymer.html`
        <style>
            paper-button {
                border: 1px solid white;
                text-transform: initial;
                font-size: 0.7em;
            }
        </style>
        <paper-button on-tap="_login">log in</paper-button>
`;
  }

  constructor()
  {
      super();
  }
  static get is()
  {
      return 'login-button';
  }
  _login()
  {
      this.dispatchEvent(
          new CustomEvent('dv-authentication-req-login', {bubbles: true, composed: true})
      );
  }
}
window.customElements.define(LoginButton.is, LoginButton);

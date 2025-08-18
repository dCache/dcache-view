import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './login-form.js';
import './loginform-with-openid.js';

class UserLoginPage extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          background: inherit;
          min-height: 400px;
          position: relative;
          display: block;
        }
        #topheader {
          display: block;
          height: 45px;
          top: 0;
          left: 0;
        }
        #header {
          height: 24vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          margin: 0 !important;
          padding: 0 !important;
          border-bottom: 2px solid #ff3a39;
        }
        #header h1 {
          color: #fff;
          font-size: 24px;
          font-weight: 300;
          margin: 0 auto 16px;
          width: 300px;
        }
        :host #body {
          width: 100%;
          display: flex;
        }
        #loginform {
          width: 300px;
          margin: 16px auto;
        }
        loginform-with-openid {
          width: 100%;
        }
        :host #footer {
          font-size: 14px;
          background: #3d4446;
          padding: 14px 26px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          box-sizing: border-box;
          align-items: center;
          position: absolute;
          bottom: 0;
          color: #fff;
        }
        #footer a {
          text-decoration: none;
          color: #00b4f0;
        }
        .hidden {
          display: none;
        }
        .show {
          display: block;
        }
      </style>

      <div id="topheader">
        <paper-icon-button icon="menu" @click="${this.showMenu}" style="float: right;"></paper-icon-button>
      </div>

      <div id="header">
        <h1>[[organisationName]]</h1>
      </div>

      <div id="body">
        <login-form
          id="loginform"
          redirect-to="[[redirectInformation]]"
          class$="[[_computedClass('lf', oicEnable)]]"
        ></login-form>
        <loginform-with-openid
          id="loginformwithopenid"
          redirect-to="[[redirectInformation]]"
          class$="[[_computedClass('lfwo', oicEnable)]]"
        ></loginform-with-openid>
      </div>

      <div id="footer">
        <span></span>
        <span>
          Powered by <a href="https://dcache.org">dCache</a>
        </span>
      </div>
    `;
    }

    static get properties() {
        return {
            organisationName: {
                type: String,
                value: () => window.CONFIG['dcache-view.org-name'],
                notify: true,
            },
            oicEnable: {
                type: Boolean,
                notify: true,
            },
            redirectInformation: {
                type: Object,
                notify: true,
            },
        };
    }

    constructor() {
        super();
        this.redirectInformation = {};
    }

    connectedCallback() {
        super.connectedCallback();

        const a = window.CONFIG['dcache-view.oidc-provider-name-list'].trim().split(' ');
        const b = window.CONFIG['dcache-view.oidc-client-id-list'].trim().split(' ');
        const c = window.CONFIG['dcache-view.oidc-authz-endpoint-list'].trim().split(' ');

        if (a[0] !== '') {
            this.oicEnable = a.length === b.length && a.length === c.length;
        } else {
            this.oicEnable = false;
        }

        if (window.CONFIG.isSomebody) {
            if (this.redirectInformation?.page === 'home') {
                // Assumes `page` is globally available router function (e.g. page.js)
                page('/');
                this.dispatchEvent(
                    new CustomEvent('dv-namespace-ls-path', {
                        detail: { path: this.redirectInformation.path },
                        bubbles: true,
                        composed: true,
                    })
                );
            } else {
                page('/' + this.redirectInformation.page);
            }
        }
    }

    _computedClass(name, oicEnable) {
        let classes = '';
        switch (name) {
            case 'lf':
                classes = oicEnable ? 'hidden' : 'show';
                break;
            case 'lfwo':
                classes = oicEnable ? 'show' : 'hidden';
                break;
        }
        this.updateStyles();
        return classes;
    }

    showMenu() {
        // Assumes global app and drawer panel accessible
        if (window.app && app.$ && app.$.dvDrawerPanel) {
            app.$.dvDrawerPanel.openDrawer();
        }
    }
}

customElements.define('user-login-page', UserLoginPage);

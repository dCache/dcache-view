import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
/*import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-button/paper-button.js';*/

class DirectoryLsError extends PolymerElement {
    static get is() {
        return 'directory-ls-error';
    }

    static get properties() {
        return {
            message: {
                type: String,
                notify: true
            },
            path: {
                type: String,
                notify: true
            },
            code: {
                type: String,
                notify: true
            },
            showLoginBtn: {
                type: Boolean,
                notify: true
            }
        };
    }

    constructor() {
        super();
        // If you need to initialize defaults, use ready() instead of constructor
    }

    connectedCallback() {
        super.connectedCallback();
        // Hide list header
        if (window.app?.$["listTableHeader"]) {
            const lrh = app.$["listTableHeader"].querySelector("list-row-header");
            if (lrh) lrh.classList.add('hidden');
        }

        this.$.main.addEventListener('contextmenu', (e) => this._openContextMenu(e));
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        setTimeout(() => {
            const vf = app?.$["homedir"]?.querySelector('view-file');
            if (vf && this.parentNode?.id === vf.$["content"]?.id && app.$["listTableHeader"]) {
                const lrh = app.$["listTableHeader"].querySelector("list-row-header");
                if (lrh && lrh.classList.contains("hidden")) {
                    lrh.classList.remove("hidden");
                }
            }
        }, 10);

        this.$.main.removeEventListener('contextmenu', (e) => this._openContextMenu(e));
    }

    ready() {
        super.ready();
        // Set login button visibility
        this.showLoginBtn = (window.page?.current === "/" || window.page?.current?.startsWith("/?")) && this.code === "401";
    }

    _openContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dispatchEvent(new MouseEvent('contextmenu', {
            view: window,
            bubbles: true,
            composed: true,
            cancelable: true,
            clientX: event.clientX,
            clientY: event.clientY,
            screenX: event.screenX,
            screenY: event.screenY
        }));
    }

    _login() {
        const a = `"page":"home","path":"${this.path}"`;
        window.page.redirect(`/user-login?r=${encodeURIComponent(a)}`);
    }

    static get template() {
        return html`
      <style>
        main {
          height: 300px;
          width: 75%;
          margin: 0 auto;
          padding: 20px;
          display: flex;
          justify-content: center;
          overflow: auto;
          -webkit-user-select: none;
          -moz-user-select: none;
          -khtml-user-select: none;
          -ms-user-select: none;
        }
        main div {
          width: 50%;
          padding: 20px;
          text-align: center;
        }
        .warning-icon {
          color: #f50303;
          height: 4em;
          width: 4em;
        }
        h3 {
          font-size: 1.2em;
          font-weight: 300;
          line-height: 24px;
        }
        .loginBtn {
          color: #f50303;
          border: 1px solid #f50303;
        }
      </style>

      <main id="main">
        <div>
          <iron-icon icon="icons:warning" class="warning-icon"></iron-icon>
          <p>[[code]]</p>
          <h3>[[message]]</h3>
          <template is="dom-if" if="[[showLoginBtn]]">
            <paper-button class="loginBtn" on-click="_login">Login</paper-button>
          </template>
        </div>
      </main>
    `;
    }
}

customElements.define(DirectoryLsError.is, DirectoryLsError);
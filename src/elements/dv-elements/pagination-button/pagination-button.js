import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class PaginationButton extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          display: inline-block;
          /* Prevent text selection after double click */
          -webkit-user-select: none;
          -moz-user-select: none;
          -khtml-user-select: none;
          -ms-user-select: none;
        }
        :host div {
          display: inline;
          width: 100%;
          height: 100%;
        }
        a {
          color: black;
          float: left;
          padding: 8px 16px;
          text-decoration: none;
          border: 1px solid #fafafa;
          transition: background-color 0.3s;
          font-size: 13px;
          background-color: #fafafa;
          border-radius: 3px;
          margin: 0 1px;
        }
        a.active {
          background-color: #fff;
          color: #000;
          border: 1px solid #b9babb;
        }
        a:hover:not(.active) {
          background-color: #efefef;
          cursor: pointer;
          border: 1px solid #f44336;
        }
        .dragEnter {
          border: 1px solid #0e5aff;
        }
      </style>
      <div><a id="button" on-click="_ref">[[name]]</a></div>
    `;
    }

    static get is() {
        return 'pagination-button';
    }

    static get properties() {
        return {
            /**
             * Directory Name
             */
            name: {
                type: String,
                notify: true,
            },

            /**
             * Full path to the directory
             */
            filePath: {
                type: String,
                notify: true,
            },

            active: {
                type: Boolean,
                notify: true,
                value: false,
                observer: '_activeChanged',
            },

            counter: {
                type: Number,
                value: 0,
                notify: true,
            },
        };
    }

    constructor() {
        super();
        this.counter = 0;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('drop', this._drop.bind(this));
        this.addEventListener('dragenter', this._dragenter.bind(this));
        this.addEventListener('dragleave', this._dragleave.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('drop', this._drop.bind(this));
        this.removeEventListener('dragenter', this._dragenter.bind(this));
        this.removeEventListener('dragleave', this._dragleave.bind(this));
    }

    _ref() {
        // Assuming `app.ls` is globally accessible
        if (window.app && typeof window.app.ls === 'function') {
            window.app.ls(this.filePath);
        }
    }

    _activeChanged(active) {
        const btn = this.shadowRoot.getElementById('button');
        if (active) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }

    _drop(event) {
        event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        this.counter = 0;
        this.shadowRoot.getElementById('button').classList.remove('dragEnter');
        this.dispatchEvent(
            new CustomEvent('dv-namespace-drop', {
                detail: { file: this, evt: event, filePath: this.filePath },
                bubbles: true,
                composed: true,
            })
        );
    }

    _dragenter(event) {
        event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        this.counter++;
        this.shadowRoot.getElementById('button').classList.add('dragEnter');
        this.dispatchEvent(
            new CustomEvent('dv-namespace-dragenter', {
                detail: { file: this, evt: event },
                bubbles: true,
                composed: true,
            })
        );
    }

    _dragleave(event) {
        event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        this.counter--;
        if (this.counter === 0) {
            this.shadowRoot.getElementById('button').classList.remove('dragEnter');
            this.dispatchEvent(
                new CustomEvent('dv-namespace-dragleave', {
                    detail: {},
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }
}

window.customElements.define(PaginationButton.is, PaginationButton);

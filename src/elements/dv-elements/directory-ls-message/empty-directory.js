import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
/*
import '@polymer/iron-icon/iron-icon.js';
*/

class EmptyDirectory extends PolymerElement {
    static get is() {
        return 'empty-directory';
    }

    static get template() {
        return html`
      <style>
        main {
          height: 200px;
          width: 70%;
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
          overflow: auto;
          text-align: center;
        }

        iron-icon {
          color: #57bb8a;
          height: 4em;
          width: 4em;
        }
      </style>

      <main id="main">
        <div>
          <iron-icon icon="icons:announcement"></iron-icon>
          <h3>Empty Directory</h3>
        </div>
      </main>
    `;
    }

    connectedCallback() {
        super.connectedCallback();
        const listHeader = window.app?.$.listTableHeader?.querySelector('list-row-header');
        if (listHeader) {
            listHeader.classList.add('hidden');
        }
        this.$.main.addEventListener('contextmenu', (e) => this._openContextMenu(e));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        const listHeader = window.app?.$.listTableHeader?.querySelector('list-row-header');
        if (listHeader) {
            listHeader.classList.remove('hidden');
        }
        this.$.main.removeEventListener('contextmenu', (e) => this._openContextMenu(e));
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
}

customElements.define(EmptyDirectory.is, EmptyDirectory);
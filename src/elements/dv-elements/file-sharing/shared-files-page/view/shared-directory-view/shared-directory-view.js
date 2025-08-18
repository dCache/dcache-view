import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';

// Import any other custom elements you need, for example:
// import './list-row-header.js';
// import '../../../../utils/ajax-ls/view-file.js';

class SharedDirectoryView extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          width: 100%;
          height: 100%;
          display: flex;
          box-sizing: border-box;
        }
        #container, app-header-layout, view-file {
          width: 100%;
          height: 100%;
        }
        .app-header {
          padding: 0 30px;
          background: var(--dv-charcoal-grey);
          height: 45px;
          border-bottom: solid 1px #ccc;
          color: #fafafa;
        }
        #container {
          padding: 0 30px;
          box-sizing: border-box;
        }
        list-row-header {
          margin: 0 !important;
        }
      </style>
      <app-header-layout has-scrolling-region>
        <app-header slot="header" class="app-header" fixed>
          <list-row-header></list-row-header>
        </app-header>
        <div id="container"></div>
      </app-header-layout>
    `;
    }
}

customElements.define('shared-directory-view', SharedDirectoryView);
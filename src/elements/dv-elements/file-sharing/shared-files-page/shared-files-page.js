import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// Import the custom elements used
import './view/shared-file-list/shared-file-list.js';
import './view/shared-directory-view/shared-directory-view.js';
import './context-menu/shared-file-list-contextual-content.js';

class SharedFilesPage extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          width: 100%;
          height: 100%;
          display: flex;
          box-sizing: border-box;
        }
        .none {
          display: none;
        }
        #shared-directory-view {
          width: 100%;
          height: 100%;
        }
      </style>

      <shared-file-list
        id="shared-file-list"
        class="normal"
        on-contextmenu="_openContextMenu">
      </shared-file-list>

      <shared-directory-view
        id="shared-directory-view"
        class="none">
      </shared-directory-view>
    `;
    }

    _openContextMenu(e) {
        // Implement context menu logic here
        console.log('Context menu opened', e);
    }
}

customElements.define('shared-files-page', SharedFilesPage);
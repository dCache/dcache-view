import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-button/paper-button.js';

// Import your local custom elements (update paths accordingly)
import '../pagination-button/pagination-button.js';
import '../upload-files/upload-files-button.js';

import '../create-directory.js';
import '../dcache-namespace.js';
import '../move-icons.js';
import '../move-file.js';

// Import your Commons mixin
import { Commons } from '../dcache-view-mixins.js'; // Adjust path

class SelectedTitle extends Commons(PolymerElement) {
    static get template() {
        return html`
      <style>
        :host {
          display: block;
          color: #333;
          padding-left: 7px;
        }
        .row {
          @apply --layout-horizontal;
          @apply --layout-center;
        }
        .flex {
          @apply --layout-flex;
        }
        .flex2 {
          @apply --layout-flex-2;
        }
        .flex3 {
          @apply --layout-flex-3;
        }
        .standardTools {
          padding-right: 20px;
          @apply --layout-horizontal;
          @apply --layout-end-justified;
        }
        .standardTools > paper-toggle-button {
          display: inline-flex;
          height: 40px;
          --paper-toggle-button-checked-bar-color: red;
          --paper-toggle-button-checked-button-color: red;
          --paper-toggle-button-checked-ink-color: red;
        }
        .standardTools > div {
          display: inline-flex;
          max-height: 40px;
          max-width: 40px;
          @apply --layout-center;
        }
        .standardTools > div + div {
          margin-left: 10px;
        }
        .pagination > div {
          display: inline-flex;
        }
        #pagination,
        #shared-pagination {
          display: inline-block;
          padding: 0;
          margin: 0;
          @apply --layout-horizontal;
        }
        #pagination pagination-button,
        #shared-pagination pagination-button {
          display: inline;
        }
        paper-tooltip {
          --paper-tooltip-background: #5cb5ec;
        }
        .info {
          border: solid 1px #dedede;
          border-radius: 20px;
          background: #f7f7f7;
        }
        .home {
          border-top-right-radius: 20%;
          border-bottom-right-radius: 20%;
          border-top-left-radius: 70%;
          border-bottom-left-radius: 70%;
          color: #616161;
        }
        .create {
          color: #2196F3;
        }
        .none {
          display: none !important;
        }
        .stamp {
          color: #b8b8b8;
          margin-right: 8px;
          font-size: 0.7em;
        }
        .shared {
          text-transform: none;
          font-size: 0.87em;
          color: #36476c;
        }
      </style>
      <div class="row" class$="[[_computedRowClass(isNamespace)]]">
        <div class="stamp">dCache.org</div>
        <div class="flex3 pagination">
          <div id="pagination">
            <pagination-button name="Root" file-path="/" active></pagination-button>
          </div>
        </div>
        <div class="standardTools flex">
          <div class$="[[_computedClass(isSelected)]]">
            <paper-icon-button
              class="move"
              icon="move-icons:movefolder"
              @tap="${this._move}"
            ></paper-icon-button>
            <paper-tooltip
              >move the selected file to another directory</paper-tooltip
            >
          </div>
          <div>
            <paper-icon-button
              class="create"
              icon="create-new-folder"
              @tap="${this._create}"
            ></paper-icon-button>
            <paper-tooltip>create new folder</paper-tooltip>
          </div>
          <div>
            <upload-files-button
              authentication-parameters="[[authenticationParameters]]"
            ></upload-files-button>
          </div>
          <div>
            <paper-icon-button
              class="info"
              icon="icons:info"
              @tap="${this._metadataInfo}"
            ></paper-icon-button>
            <paper-tooltip>metadata information</paper-tooltip>
          </div>
        </div>
      </div>

      <div class$="[[_computedRowClass(isAdmin)]]">
        <div class="stamp">dCache.org</div>
      </div>
      <div class$="[[_computedRowClass(isUserLogin)]]"></div>
      <div class="row" class$="[[_computedRowClass(isSharedPage)]]">
        <div class="stamp">dCache.org</div>
        <div class="flex3 pagination">
          <paper-button class="shared" @tap="${this._shared}"
            >Shared with me</paper-button
          >
          <div id="shared-pagination"></div>
        </div>
        <div
          class="standardTools flex"
          id="sharing-standardTools"
          style="visibility: hidden;"
        >
          <div class$="[[_computedClass(isSelected)]]">
            <paper-icon-button
              class="move"
              icon="move-icons:movefolder"
              @tap="${this._move}"
            ></paper-icon-button>
            <paper-tooltip
              >move the selected file to another directory</paper-tooltip
            >
          </div>
          <div>
            <paper-icon-button
              class="create"
              icon="create-new-folder"
              @tap="${this._create}"
            ></paper-icon-button>
            <paper-tooltip>create new folder</paper-tooltip>
          </div>
          <div>
            <upload-files-button
              authentication-parameters="[[authenticationParameters]]"
            ></upload-files-button>
          </div>
          <div>
            <paper-icon-button
              class="info"
              icon="icons:info"
              @tap="${this._metadataInfo}"
            ></paper-icon-button>
            <paper-tooltip>metadata information</paper-tooltip>
          </div>
        </div>
      </div>
    `;
    }

    static get is() {
        return 'selected-title';
    }

    static get properties() {
        return {
            pgRoute: {
                type: String,
                notify: true,
            },
            isNamespace: {
                type: Boolean,
                notify: true,
            },
            isAdmin: {
                type: Boolean,
                notify: true,
            },
            isUserLogin: {
                type: Boolean,
                notify: true,
            },
            isSelected: {
                type: Boolean,
                value: false,
                notify: true,
            },
            isSharedPage: {
                type: Boolean,
                notify: true,
            },
            _selectedItems: {
                type: Array,
                value: () => [],
                notify: true,
            },
            currentPath: String,
            authenticationParameters: Object,
        };
    }

    static get observers() {
        return ['changedSection(pgRoute)'];
    }

    constructor() {
        super();
        this._isSelectedChanged_ = this._isSelectedChanged.bind(this);
        this._setCurrentPath_ = this._setCurrentPath.bind(this);
        this._resetViewFileDependentParameters_ = this._resetViewFileDependentParameters.bind(this);
        this._setAuthenticationParameters_ = this._setAuthenticationParameters.bind(this);
        this._sharingPageSwitch_ = this._sharingPageSwitchListener.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.getElementById('sharing-standardTools').style.visibility = 'hidden';

        window.addEventListener('dv-namespace-x-selected-items-changed', this._isSelectedChanged_);
        window.addEventListener('dv-namespace-current-path', this._setCurrentPath_);
        window.addEventListener('dv-namespace-view-file-created', this._resetViewFileDependentParameters_);
        window.addEventListener('dv-namespace-current-authenticationParameters', this._setAuthenticationParameters_);
        window.addEventListener('dv-file-sharing-page-switch', this._sharingPageSwitch_);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('dv-namespace-x-selected-items-changed', this._isSelectedChanged_);
        window.removeEventListener('dv-namespace-current-path', this._setCurrentPath_);
        window.removeEventListener('dv-namespace-view-file-created', this._resetViewFileDependentParameters_);
        window.removeEventListener('dv-namespace-current-authenticationParameters', this._setAuthenticationParameters_);
        window.removeEventListener('dv-file-sharing-page-switch', this._sharingPageSwitch_);
    }

    ready() {
        super.ready();
        import('@polymer/polymer/lib/utils/render-status.js').then(({ afterNextRender }) => {
            afterNextRender(this, () => {
                this.dispatchEvent(
                    new CustomEvent('dv-namespace-request-current-path', { bubbles: true, composed: true })
                );
            });
        });
    }

    changedSection(route) {
        if (!route) return;
        this.pgRoute = route;
    }

    _isSelectedChanged(event) {
        this._selectedItems = event.detail.items || [];
        this.isSelected = this._selectedItems.length > 0;
    }

    _setCurrentPath(event) {
        this.currentPath = event.detail.path;
    }

    _resetViewFileDependentParameters() {
        this._selectedItems = [];
        this.isSelected = false;
    }

    _setAuthenticationParameters(event) {
        this.authenticationParameters = event.detail;
    }

    _sharingPageSwitchListener(event) {
        const isShared = event.detail.isSharedPage;
        this.isSharedPage = isShared;
        const tools = this.shadowRoot.getElementById('sharing-standardTools');
        tools.style.visibility = isShared ? 'visible' : 'hidden';
    }

    _computedRowClass(isActive) {
        return isActive ? 'row' : 'none';
    }

    _computedClass(isActive) {
        return isActive ? 'info' : 'none';
    }

    _move() {
        this.dispatchEvent(
            new CustomEvent('dv-namespace-move-clicked', { bubbles: true, composed: true })
        );
    }

    _create() {
        this.dispatchEvent(
            new CustomEvent('dv-namespace-create-clicked', { bubbles: true, composed: true })
        );
    }

    _metadataInfo() {
        this.dispatchEvent(
            new CustomEvent('dv-namespace-metadata-info-clicked', { bubbles: true, composed: true })
        );
    }

    _shared() {
        this.dispatchEvent(
            new CustomEvent('dv-namespace-shared-button-clicked', { bubbles: true, composed: true })
        );
    }
}

customElements.define(SelectedTitle.is, SelectedTitle);

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-input/paper-input-container.js';
// Import your mixin and file-icon accordingly, assuming they are ES modules or wrapped for Polymer 3
import 'mixin/files-viewer-mixin.js';
import 'file-icon.js';

class FilesViewerHeader extends DcacheViewMixins.FilesViewerMixin(PolymerElement) {
    static get template() {
        return html`
      <style>
        :host {
          background-color: rgb(50, 54, 57);
          color: rgb(241, 241, 241);
          display: flex;
          height: 48px;
          width: 100%;
        }
        .toolbar {
          align-items: center;
          display: flex;
          padding: 0 8px;
          width: 100%;
        }
        .title {
          flex: 5;
          font-size: 0.87rem;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .title paper-icon-button {
          margin-right: 12px;
        }
        .buttons {
          flex: 5;
          text-align: end;
          user-select: none;
        }
        .pageselector-container {
          text-align: center;
          white-space: nowrap;
          display: flex;
          align-items: center;
        }
        .page-selector {
          color: #fff;
          font-size: 1.23rem;
          margin-left: 24px;
          margin-right: 24px;
        }
        .page-selector ::selection {
          background: rgba(255, 255, 255, 0.3);
        }
        .page-no-txt {
          --paper-input-container-underline: { display: none; };
          --paper-input-container-underline-focus: { display: none; };
          padding: 0;
          width: 1ch;
        }
        #input {
          -webkit-margin-start: -3px;
          color: #fff;
          height: 100%;
          line-height: 18px;
          padding: 3px;
          text-align: end;
          vertical-align: baseline;
        }
        #input:focus,
        #input:hover {
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 2px;
        }
        .slash {
          padding: 0 3px;
        }
        .total {
          -webkit-margin-start: -2px;
          padding-bottom: 1px;
          text-align: start;
          width: 1ch;
        }
        .page-no-txt,
        .slash,
        .total {
          display: inline-block;
          margin-bottom: 2px;
          vertical-align: middle;
        }
        #input,
        .slash,
        #pagelength {
          font-size: 0.81rem;
        }
        iron-input input {
          @apply --paper-input-container-shared-input-style;
        }
        .page-nav {
          width: 1.23rem;
          height: 1.23rem;
          padding: 0;
        }
        .hide {
          visibility: hidden;
        }
      </style>

      <div class="toolbar">
        <div class="title">
          <paper-icon-button icon="close" on-click="_close"></paper-icon-button>
          <file-icon mime-type="[[fileMimeType]]"></file-icon>
          <strong>[[fileName]]</strong>
        </div>
        <div id="page-navigator-container" class$="pageselector-container [[_computePageNavClass(fileMimeType)]]">
          <paper-icon-button class="page-nav" icon="icons:arrow-back" on-click="_previous"></paper-icon-button>
          <div class="page-selector">
            <paper-input-container class="page-no-txt" no-label-float>
              <iron-input slot="input" allowed-pattern="\\d" bind-value="{{_pageInputValue::input}}">
                <input
                  id="input"
                  prevent-invalid-input
                  value="{{_pageInputValue}}"
                  on-change="_goTo"
                />
              </iron-input>
            </paper-input-container>
            <span class="slash"> / </span>
            <span class="total">
              <span id="pagelength">[[docLengthDisplay]]</span>
            </span>
          </div>
          <paper-icon-button class="page-nav" icon="icons:arrow-forward" on-click="_next"></paper-icon-button>
        </div>
        <div id="buttons" class$="buttons [[_computeButtonsClass(fileMimeType)]]">
          <paper-icon-button icon="icons:more-vert" on-click="_more"></paper-icon-button>
        </div>
      </div>
    `;
    }

    static get is() {
        return 'files-viewer-header';
    }

    static get properties() {
        return {
            fileName: {
                type: String,
                notify: true,
            },
            fileMimeType: {
                type: String,
                notify: true,
            },
            docLength: {
                type: Number,
                value: 0,
            },
            pageNo: {
                type: Number,
                value: 1,
                notify: true,
            },
            _pageInputValue: {
                type: String,
                value: '1',
            },
            docLengthDisplay: {
                type: String,
                computed: '_computeDocLengthDisplay(docLength)',
            },
        };
    }

    static get observers() {
        return ['_load(fileMimeType)'];
    }

    constructor() {
        super();
        this._getDocLengthListener = this._getDocLength.bind(this);
        this._updateCurrentPageNoListener = this._updatePageNo.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('dv-namespace-files-viewer-nav-page-total', this._getDocLengthListener);
        window.addEventListener('dv-namespace-files-viewer-nav-page-change', this._updateCurrentPageNoListener);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('dv-namespace-files-viewer-nav-page-change', this._updateCurrentPageNoListener);
        window.removeEventListener('dv-namespace-files-viewer-nav-page-total', this._getDocLengthListener);
    }

    _load(mime) {
        // No need to toggle visibility here as computed bindings handle it
    }

    _computeButtonsClass(mime) {
        if (!mime) return '';
        if (mime.includes('video') || mime.includes('audio') || mime.includes('json')) {
            return 'hide';
        }
        return '';
    }

    _computePageNavClass(mime) {
        if (!mime) return 'hide';
        return mime.includes('pdf') ? '' : 'hide';
    }

    _computeDocLengthDisplay(docLength) {
        return docLength > 0 ? docLength.toString() : '?';
    }

    _more() {
        this.dispatchEvent(
            new CustomEvent('dv-namespace-files-viewer-addtional-tools', { bubbles: true, composed: true })
        );
    }

    _close() {
        this.dispatchEvent(
            new CustomEvent('dv-namespace-close-files-viewer', { bubbles: true, composed: true })
        );
    }

    _previous() {
        this.dispatchEvent(
            new CustomEvent('dv-namespace-files-viewer-nav-previous', { bubbles: true, composed: true })
        );
    }

    _next() {
        this.dispatchEvent(
            new CustomEvent('dv-namespace-files-viewer-nav-next', { bubbles: true, composed: true })
        );
    }

    _updatePageNo(e) {
        this.pageNo = e.detail.page;
        this._pageInputValue = String(this.pageNo);
    }

    _getDocLength(e) {
        this.docLength = e.detail.total;
    }

    _goTo() {
        const page = Number(this._pageInputValue);
        if (page >= 1 && page <= this.docLength) {
            this.dispatchEvent(
                new CustomEvent('dv-namespace-files-viewer-nav-goto', {
                    detail: { page: page },
                    bubbles: true,
                    composed: true,
                })
            );
        } else {
            this._pageInputValue = String(this.pageNo);
        }
    }
}

customElements.define(FilesViewerHeader.is, FilesViewerHeader);
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-spinner/paper-spinner.js';

import './files-viewer-header.js';
import './pdf/pdf-viewer.js';
import './json/json-viewer.js';
import './additional-tools.js';
import './image/image-viewer.js';
import './video/video-viewer.js';
import './audio/audio-player.js';
import './error/files-viewer-error.js';

import { Commons } from './dcache-view-mixins.js';  // Adjust path for your mixin

class FilesViewer extends Commons(PolymerElement) {
    static get template() {
        return html`
      <style>
        :host {
          display: block;
          width: 100vw;
          height: 100vh;
          background: transparent;
        }
        app-header-layout {
          width: 100%;
          height: 100%;
        }
        app-toolbar {
          padding: 0;
          height: 48px;
        }
        paper-spinner {
          position: absolute;
          top: 40%;
          right: 50%;
        }
        #viewer {
          display: flex;
          height: calc(100vh - 48px);
          overflow: auto;
        }
        additional-tools {
          position: absolute;
          top: 5px;
          right: 10px;
        }
        .none {
          display: none;
        }
        json-viewer {
          --json-viewer-background-color: #f0f0f0;
        }
        .error {
        }
      </style>
      <app-header-layout has-scrolling-region>
        <app-header slot="header" fixed>
          <app-toolbar>
            <files-viewer-header
              id="header"
              file-name="[[file.fileMetaData.fileName]]"
              file-mime-type="[[file.fileMetaData.fileMimeType]]"
            ></files-viewer-header>
          </app-toolbar>
        </app-header>
        <div id="main-content">
          <div id="viewer"></div>
          <paper-spinner active="[[loading]]"></paper-spinner>
          <additional-tools id="additional-tools" class="none"></additional-tools>
          <files-viewer-error
            id="error"
            class="none"
            src="[[src]]"
            name="[[file.fileMetaData.fileName]]"
          ></files-viewer-error>
        </div>
      </app-header-layout>
    `;
    }

    static get is() {
        return 'files-viewer';
    }

    static get properties() {
        return {
            file: {
                type: Object,
            },
            loading: {
                type: Boolean,
                value: true,
            },
            src: {
                type: String,
            },
            authenticationParameters: {
                type: Object,
            }
        };
    }

    constructor() {
        super();
        this.URL = window.URL || window.webkitURL;
        this._cleanUpListener = this._cleanUp.bind(this);
        this._downloadListener = this._download.bind(this);
        this._errorListener = this._error.bind(this);
    }

    ready() {
        super.ready();
        this.$.header.addEventListener('dv-namespace-files-viewer-addtional-tools', () => {
            this.$['additional-tools'].classList.toggle('none');
        });
        // Wait until next render to run controller
        this.updateComplete.then(() => this._controller());
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('dv-namespace-close-files-viewer', this._cleanUpListener);
        window.addEventListener('iron-overlay-canceled', this._cleanUpListener);
        window.addEventListener('dv-namespace-files-viewer-download', this._downloadListener);
        window.addEventListener('dv-namespace-files-viewer-error', this._errorListener);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('dv-namespace-close-files-viewer', this._cleanUpListener);
        window.removeEventListener('iron-overlay-canceled', this._cleanUpListener);
        window.removeEventListener('dv-namespace-files-viewer-download', this._downloadListener);
        window.removeEventListener('dv-namespace-files-viewer-error', this._errorListener);
    }

    _start() {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./scripts/tasks/download-task.js');
            // TODO: fallback logic if getFileWebDavUrl()[0] fails
            const fileURL = this.getFileWebDavUrl(this.file.filePath, "read")[0];
            worker.addEventListener('message', (e) => {
                resolve(e.data);
                worker.terminate();
            }, false);
            worker.addEventListener('error', (e) => {
                worker.terminate();
                reject(e);
            }, false);

            worker.postMessage({
                url: fileURL,
                mime: this.file.fileMetaData.fileMimeType,
                upauth: this.getAuthValue(),
                return: this.file.fileMetaData.fileMimeType.includes('json') ? 'json' : 'blob',
            });
        });
    }

    _controller() {
        this._start().then((res) => {
            let content;
            const mime = this.file.fileMetaData.fileMimeType;
            if (mime === 'application/json') {
                content = document.createElement('json-viewer');
                content.json = res;
                content.addEventListener('dv-namespace-files-viewer-finished-loading', () => {
                    this.loading = false;
                });
            } else {
                const blob = new Blob([res], { type: mime });
                this.src = this.URL.createObjectURL(blob);
                switch (mime) {
                    case 'application/pdf':
                        content = new PdfViewer(this.src);
                        break;
                    case 'video/ogg':
                    case 'video/mpeg':
                    case 'video/webm':
                    case 'video/mp4':
                        content = new VideoViewer(this.src);
                        break;
                    case 'audio/ogg':
                    case 'audio/mpeg':
                    case 'audio/webm':
                    case 'audio/mp4':
                        content = new VideoViewer(this.src);
                        break;
                    case 'image/gif':
                    case 'image/jpeg':
                    case 'image/png':
                    case 'image/x-icon':
                    case 'image/svg+xml':
                        content = new ImageViewer(this.src);
                        break;
                    default:
                        this._error();
                        return;
                }
                content.addEventListener('dv-namespace-files-viewer-finished-loading', () => {
                    this.loading = false;
                    this.URL.revokeObjectURL(blob);
                });
            }

            this.$.viewer.appendChild(content);
        }).catch(() => {
            this._error();
        });
    }

    _cleanUp(e) {
        if (e.type === 'dv-namespace-close-files-viewer') {
            this.dispatchEvent(new CustomEvent('dv-namespace-close-files-viewer-appliance', { bubbles: true, composed: true }));
        } else {
            const path = e.composedPath ? e.composedPath() : e.path || [];
            if (path.find(el => el.tagName === 'FILES-VIEWER-OVERLAY')) {
                this.dispatchEvent(new CustomEvent('dv-namespace-close-files-viewer-appliance', { bubbles: true, composed: true }));
            }
        }
    }

    _download() {
        // TODO: Avoid global style dependency; consider passing link as property or querying safer
        const link = document.querySelector('#download'); // Adjust as needed to select your download anchor
        if (link) {
            link.href = this.src;
            link.download = this.file.fileMetaData.fileName;
            link.click();
        }
    }

    _error() {
        this.loading = false;
        this.$.error.classList.remove('none');
        this.$.error.classList.add('error');
    }
}

customElements.define(FilesViewer.is, FilesViewer);
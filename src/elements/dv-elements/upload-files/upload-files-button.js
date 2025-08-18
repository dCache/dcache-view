// upload-files-button.js
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-tooltip/paper-tooltip.js';

// Make sure to import or define DcacheViewMixins and UploadToastFile and UploadHandler in your project scope

export class UploadFilesButton extends DcacheViewMixins.Commons(PolymerElement) {
    static get template() {
        return html`
      <style>
        :host {
          display: inline-block;
        }
        #files {
          width: 0;
          height: 0;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
        }
      </style>
      <div>
        <input id="files" type="file" multiple on-change="_handleFileSelection" on-click="_resetValue" />
        <label for="files">
          <paper-icon-button icon="icons:cloud-upload"></paper-icon-button>
          <paper-tooltip>upload files</paper-tooltip>
        </label>
      </div>
    `;
    }

    static get is() {
        return 'upload-files-button';
    }

    static get properties() {
        return {
            currentPath: {
                type: String,
            },
            authenticationParameters: {
                type: Object,
            },
        };
    }

    constructor() {
        super();
        this._openFilePicker_ = this._openFilePicker.bind(this);
        this._setCurrentPath_ = this._setCurrentPath.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('dv-namespace-upload-files', this._openFilePicker_);
        window.addEventListener('dv-namespace-current-path', this._setCurrentPath_);
        this.dispatchEvent(
            new CustomEvent('dv-namespace-request-current-path', {
                bubbles: true,
                composed: true,
            })
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('dv-namespace-upload-files', this._openFilePicker_);
        window.removeEventListener('dv-namespace-current-path', this._setCurrentPath_);
    }

    _handleFileSelection(e) {
        e.stopPropagation();
        e.preventDefault();

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            this.dispatchEvent(
                new CustomEvent('dv-namespace-open-upload-toast', {
                    bubbles: true,
                    composed: true,
                })
            );
            this.uploadFile(e.target.files);
        } else {
            this.dispatchEvent(
                new CustomEvent('dv-namespace-show-message-toast', {
                    detail: { message: 'No support for the File API in this web browser.' },
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }

    uploadFile(files) {
        const path = this.currentPath && this.currentPath.endsWith('/')
            ? this.currentPath
            : `${this.currentPath || ''}/`;

        Array.from(files).forEach((file, i) => {
            const el = new UploadToastFile(file.name, 'REGULAR', file.type);
            el.setAttribute('id', i.toString());

            this.dispatchEvent(
                new CustomEvent('dv-namespace-upload-toast-append-child', {
                    detail: { child: el },
                    bubbles: true,
                    composed: true,
                })
            );

            const upLs = el;
            const uploadURL = this.getFileWebDavUrl(`${path}${file.name}`, 'write')[0];

            const uploader = new UploadHandler({
                file,
                upauth: this.getAuthValue(),
                url: uploadURL,

                onComplete: (data) => {
                    const progressBar = upLs.shadowRoot.querySelector('paper-progress');
                    progressBar.indeterminate = false;
                    progressBar.value = 100;
                    progressBar.classList.remove('error', 'progress');
                    progressBar.classList.add('complete');

                    upLs.inProgress = false;
                    upLs.hasError = false;
                    upLs.isComplete = true;
                    upLs.message = 'Uploaded';

                    this.dispatchEvent(
                        new CustomEvent('dv-namespace-add-items', {
                            detail: {
                                files: [
                                    {
                                        fileName: data.name,
                                        fileMimeType: data.type,
                                        fileLocality: '',
                                        size: data.size,
                                        fileType: 'REGULAR',
                                        mtime: data.lastModified,
                                        creationTime: Date.now(),
                                    },
                                ],
                            },
                            bubbles: true,
                            composed: true,
                        })
                    );
                },

                onProgress: (evt) => {
                    const progressBar = upLs.shadowRoot.querySelector('paper-progress');
                    if (evt.lengthComputable) {
                        progressBar.classList.remove('error', 'complete');
                        progressBar.classList.add('progress');
                        progressBar.indeterminate = false;
                        progressBar.value = (evt.loaded / evt.total) * 100;
                    }
                    upLs.progressValue = progressBar.value;
                    upLs.inProgress = true;
                    upLs.isComplete = false;
                    upLs.hasError = false;
                },

                onError: (evt) => {
                    const progressBar = upLs.shadowRoot.querySelector('paper-progress');
                    progressBar.classList.remove('progress', 'complete');
                    progressBar.classList.add('error');
                    progressBar.indeterminate = false;
                    progressBar.value = 100;
                    upLs.message = evt.statusText;
                    upLs.inProgress = false;
                    upLs.isComplete = false;
                    upLs.hasError = true;
                },
            });

            uploader.upload();
        });
    }

    _openFilePicker() {
        this.$.files.click();
    }

    _setCurrentPath(e) {
        this.currentPath = e.detail.currentPath;
    }

    _resetValue(e) {
        this.$.files.value = null;
    }
}

customElements.define(UploadFilesButton.is, UploadFilesButton);

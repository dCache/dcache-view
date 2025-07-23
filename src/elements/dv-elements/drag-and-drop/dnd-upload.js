import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {DcacheViewMixins} from 'path-to-your-dcache-mixins.js'; // Update the actual path
import '@polymer/polymer/lib/elements/dom-if.js';

import '../upload-files/upload-toast-file.js';
import '../upload-files/upload-file-common.js';
import '@polymer/polymer/lib/utils/render-status.js';

class DndUpload extends DcacheViewMixins.Commons(PolymerElement) {
    static get is() {
        return 'dnd-upload';
    }

    static get properties() {
        return {
            path: {
                type: String,
                notify: true
            },
            isCurrentView: {
                type: Boolean,
                value: true,
                notify: true
            },
            authenticationParameters: {
                type: Object
            }
        };
    }

    constructor() {
        super();
        this.path = '';
        this.authenticationParameters = null;
    }

    ready() {
        super.ready();
        this.setAttribute('hidden', true);
    }

    async _scanDirectory(item, path) {
        const dirReader = item.createReader();
        const entries = await new Promise(resolve => dirReader.readEntries(resolve));

        for (const entry of entries) {
            if (entry.isFile) {
                try {
                    this._subDirFileUpload(entry, path);
                } catch (err) {
                    throw new Error(err.message);
                }
            } else if (entry.isDirectory) {
                await this.__createNewDirectory(entry.name, path);
                const newPath = path.endsWith('/') ? path : `${path}/`;
                await this._scanDirectory(entry, `${newPath}${entry.name}`);
            }
        }

        return 'All the contents have been uploaded.';
    }

    __createNewDirectory(name, path) {
        return new Promise((resolve, reject) => {
            const url = `${window.CONFIG['dcache-view.endpoints.webapi']}namespace`;
            const namespace = document.createElement('dcache-namespace');
            namespace.auth = this.getAuthValue();

            namespace.promise
                .then(() => resolve(name))
                .catch(reject);

            namespace.mkdir({
                url,
                path: this.encodePath(path),
                name
            });
        });
    }

    _uploadFileInCurrentView(index, file) {
        const uploadToast = new UploadToastFile(file.name, 'REGULAR', file.type);
        uploadToast.setAttribute('id', index.toString());

        window.dispatchEvent(new CustomEvent('dv-namespace-upload-toast-append-child', {
            detail: {child: uploadToast},
            bubbles: true,
            composed: true
        }));

        const progressBar = uploadToast.shadowRoot.querySelector('paper-progress');
        const fileUploader = new UploadFileCommon(this.path, this.authenticationParameters);

        fileUploader.addEventListener('complete', e => {
            progressBar.indeterminate = false;
            progressBar.value = 100;
            progressBar.classList.remove('error', 'progress');
            progressBar.classList.add('complete');

            Object.assign(uploadToast, {
                inProgress: fileUploader.inProgress,
                hasError: fileUploader.hasError,
                isComplete: fileUploader.isComplete,
                message: fileUploader.message
            });

            if (this.isCurrentView) {
                window.dispatchEvent(new CustomEvent('dv-namespace-add-items', {
                    detail: {files: [e.detail.item]},
                    bubbles: true,
                    composed: true
                }));
            }
        });

        fileUploader.addEventListener('uploading', e => {
            progressBar.classList.remove('error', 'complete');
            progressBar.classList.add('progress');
            progressBar.indeterminate = fileUploader.progressStatus;
            uploadToast.progressValue = e.detail.value;

            Object.assign(uploadToast, {
                inProgress: fileUploader.inProgress,
                isComplete: fileUploader.isComplete,
                hasError: fileUploader.hasError
            });
        });

        fileUploader.addEventListener('error', e => {
            progressBar.classList.remove('progress', 'complete');
            progressBar.classList.add('error');
            progressBar.indeterminate = false;
            progressBar.value = 100;

            Object.assign(uploadToast, {
                inProgress: fileUploader.inProgress,
                isComplete: fileUploader.isComplete,
                hasError: fileUploader.hasError,
                message: e.detail.message
            });
        });

        fileUploader.upload(file);
    }

    _subDirFileUpload(file, path) {
        const fileUploader = new UploadFileCommon(path, this.authenticationParameters);

        fileUploader.addEventListener('error', e => {
            throw new Error(e.detail.message);
        });

        fileUploader.upload(file);
    }

    start(event) {
        window.dispatchEvent(new CustomEvent('dv-namespace-close-upload-toast', {
            bubbles: true,
            composed: true
        }));

        const items = event.dataTransfer.items;

        window.dispatchEvent(new CustomEvent('dv-namespace-open-upload-toast', {
            bubbles: true,
            composed: true
        }));

        if (!items) {
            const files = event.dataTransfer.files;
            Array.from(files).forEach((file, i) => {
                this._uploadFileInCurrentView(i, file);
            });
        } else {
            Array.from(items).forEach((item, i) => {
                const entry = item.webkitGetAsEntry();

                if (entry.isFile) {
                    entry.file(file => this._uploadFileInCurrentView(i, file));
                } else if (entry.isDirectory) {
                    const uploadToast = new UploadToastFile(entry.name, 'DIR', 'application/vnd.dcache.folder');
                    uploadToast.setAttribute('id', i.toString());

                    this.dispatchEvent(new CustomEvent('dv-namespace-upload-toast-append-child', {
                        detail: {child: uploadToast},
                        bubbles: true,
                        composed: true
                    }));

                    const progressBar = uploadToast.shadowRoot.querySelector('paper-progress');

                    this.__createNewDirectory(entry.name, this.path)
                        .then(name => {
                            if (this.isCurrentView) {
                                window.dispatchEvent(new CustomEvent('dv-namespace-add-items', {
                                    detail: {
                                        files: [{
                                            fileName: name,
                                            fileMimeType: 'application/vnd.dcache.folder',
                                            fileLocality: '',
                                            size: '--',
                                            fileType: 'DIR',
                                            mtime: '--',
                                            creationTime: Date.now()
                                        }]
                                    },
                                    bubbles: true,
                                    composed: true
                                }));
                            }

                            return this._scanDirectory(entry, `${this.path}/${entry.name}`);
                        })
                        .then(response => {
                            progressBar.indeterminate = false;
                            progressBar.value = 100;
                            progressBar.classList.remove('error', 'progress');
                            progressBar.classList.add('complete');

                            Object.assign(uploadToast, {
                                inProgress: false,
                                hasError: false,
                                isComplete: true,
                                message: response
                            });
                        })
                        .catch(err => {
                            progressBar.classList.remove('progress', 'complete');
                            progressBar.classList.add('error');
                            progressBar.indeterminate = false;
                            progressBar.value = 100;

                            Object.assign(uploadToast, {
                                inProgress: false,
                                isComplete: false,
                                hasError: true,
                                message: err.toString()
                            });
                        });
                }
            });
        }

        return false;
    }
}

customElements.define(DndUpload.is, DndUpload);
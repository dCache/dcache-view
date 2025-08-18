// upload-file-common.js
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// Dummy mixin placeholder, replace with your actual import/definition
const DcacheViewMixins = {
    Commons: (superClass) => class extends superClass {
        getFileWebDavUrl(path, mode) {
            return [`/webdav/${path}?mode=${mode}`]; // Replace with real logic
        }
        getAuthValue() {
            return this.authenticationParameters || {};
        }
    }
};

export class UploadFileCommon extends DcacheViewMixins.Commons(PolymerElement) {
    static get is() { return 'upload-file-common'; }

    static get properties() {
        return {
            message: { type: String, notify: true },
            progressValue: { type: Number, value: 0, notify: true },
            isComplete: { type: Boolean, notify: true },
            hasError: { type: Boolean, notify: true },
            inProgress: { type: Boolean, notify: true },
            progressStatus: { type: Boolean, value: true, notify: true },
            path: { type: String, notify: true },
            data: { type: Object, notify: true },
            browser: { type: Object, notify: true },
            authenticationParameters: { type: Object }
        };
    }

    constructor() {
        super();
        // Note: no constructor args, pass path/authentication via properties
    }

    ready() {
        super.ready();
        this.browser = app.checkBrowser();
        if (this.path && !this.path.endsWith('/')) {
            this.path = `${this.path}/`;
        }
    }

    upload(file) {
        const uploadUrl = this.getFileWebDavUrl(`${this.path}${file.name}`, 'write')[0];
        new UploadHandler({
            file,
            upauth: this.getAuthValue(),
            url: uploadUrl,
            onComplete: data => {
                this.progressStatus = false;
                this.progressValue = 100;
                this.inProgress = false;
                this.hasError = false;
                this.isComplete = true;
                this.message = 'Uploaded';
                this.dispatchEvent(new CustomEvent('complete', {
                    detail: {
                        item: {
                            fileName: data.name,
                            fileMimeType: data.type,
                            fileLocality: '',
                            size: data.size,
                            fileType: 'REGULAR',
                            mtime: data.lastModified,
                            creationTime: Date.now()
                        }
                    }
                }));
            },
            onProgress: evt => {
                this.message = 'Uploading ...';
                this.inProgress = true;
                this.isComplete = false;
                this.hasError = false;
                if (evt.lengthComputable) {
                    this.progressStatus = false;
                    this.progressValue = ((evt.loaded / evt.total) * 100).toFixed(2);
                }
                this.dispatchEvent(new CustomEvent('uploading', { detail: { value: this.progressValue } }));
            },
            onError: evt => {
                this.progressStatus = false;
                this.progressValue = 100;
                if (evt.statusText === '' && evt.status === 0) {
                    if (!((this.browser.name === 'Firefox' && this.browser.version >= 50) ||
                        (this.browser.name === 'Chrome' && this.browser.version >= 13))) {
                        this.message = 'No support for uploading a folder in this web browser.';
                    }
                } else {
                    this.message = evt.statusText;
                }
                this.inProgress = false;
                this.isComplete = false;
                this.hasError = true;
                this.dispatchEvent(new CustomEvent('error', { detail: { message: this.message } }));
            }
        }).upload();
    }
}

customElements.define(UploadFileCommon.is, UploadFileCommon);

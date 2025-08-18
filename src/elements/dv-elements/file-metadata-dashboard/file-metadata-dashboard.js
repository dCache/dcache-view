import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
/*import "@polymer/polymer/app-header-layout.js";
import "@polymer/polymer/app-header.js";
import "@polymer/polymer/app-toolbar.js";
import "@polymer/polymer/app-scroll-effects.js";
import "@polymer/polymer/google-chart.js";
import "@polymer/polymer//paper-material-styles.js";*/
import "./file-metadata-mapper.js";
import "./raw-file-metadata.js";

class FileMetadataDashboard extends DcacheViewMixins.Namespace(DcacheViewMixins.Commons(PolymerElement)) {
    static get is() {
        return 'file-metadata-dashboard';
    }

    static get properties() {
        return {
            knownMetadata: { type: Object, notify: true },
            metadata: { type: Object, value: () => ({}), notify: true },
            pnfsId: {
                type: String,
                value: "0",
                notify: true,
                observer: '_requestFileMetadataWithPnfsId'
            },
            index: {
                type: Number,
                notify: true,
                observer: '_indexChanged'
            },
            path: { type: String, notify: true },
            children: { type: Array, value: () => [], notify: true, observer: '_childrenChanged' },
            _data: { type: Array, value: () => [["File Type", "Value"]], notify: true },
            _options: {
                type: Object,
                value: () => ({
                    "backgroundColor": "transparent",
                    "backgroundColor.fill": "transparent",
                    "chartArea": {"width": "60%", "height":"90%"},
                    "is3D": true,
                    "legend": {"alignment": "center"},
                    "tooltip": {"trigger": "selection"}
                })
            },
            refreshRequire: { type: Boolean, value: true, notify: true },
            formatStatus: {
                type: Boolean,
                value: () => window.CONFIG["file-metadata-viewer-formatted-mode"] === undefined ?
                    true : window.CONFIG["file-metadata-viewer-formatted-mode"],
                notify: true
            },
            messageIcon: { type: String, value: 'icons:announcement', notify: true },
            message: { type: String, value: 'Empty Directory', notify: true },
            isLoading: { type: Boolean, value: true, notify: true },
            messageIconClass: { type: String, value: "empty-icon", notify: true }
        }
    }

    constructor(file, path, idx, auth) {
        super();
        this._setIndexListener_ = this._setIndexListener.bind(this);
        this._setChildren_ = this._setChildren.bind(this);
        this._close_ = this._close.bind(this);
        this._rawOrFormatted_ = this._rawOrFormatted.bind(this);
        if (!file.fileMimeType && file.fileType === "DIR") {
            file.fileMimeType = "application/vnd.dcache.folder";
        }
        this.knownMetadata = file;
        this.path = path === "" ? "/": this.encodePath(path);
        this.pnfsId = file.pnfsId ? file.pnfsId : "0";
        if (auth) {
            this.authenticationParameters = auth;
        }
        if (idx === 1) {
            this.index = -10;
            window.addEventListener('dv-namespace-receive-children', this._setChildren_);
            window.dispatchEvent(
                new CustomEvent('dv-namespace-request-children', {bubbles: true, composed: true}));
        } else {
            window.addEventListener('dv-namespace-receive-item-index', this._setIndexListener_);
            window.dispatchEvent(
                new CustomEvent('dv-namespace-request-item-index', {
                    detail: {item: file}, bubbles: true, composed: true}));
        }
    }

    ready() {
        super.ready();
        Polymer.RenderStatus.afterNextRender(this, () => this.__formatStyleSwitch(this.formatStatus));
    }

    connectedCallback() {
        super.connectedCallback();
        this.$.close.addEventListener('tap', this._close_);
        this.$.toggle.addEventListener('checked-changed', this._rawOrFormatted_);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('dv-namespace-receive-item-index', this._setIndexListener_);
        window.removeEventListener('dv-namespace-receive-children', this._setChildren_);
        this.$.close.removeEventListener('tap', this._close_);
        this.$.toggle.removeEventListener('checked-changed', this._rawOrFormatted_);
    }

    _indexChanged(idx) {
        if (idx > -1 && this.knownMetadata.fileType === "DIR") {
            this._requestAllChildren();
        }
    }

    _childrenChanged(children) {
        const len = children.length;
        if (len > 0) {
            this.$['message-container'].classList.replace('empty', 'none');
            this.$['preview-container'].classList.replace('none', 'preview-container');
            if (len >= 100) {
                if (this.refreshRequire) {
                    this._requestAllChildren();
                }
            } else {
                this.refreshRequire = false;
            }
            this._setPieChartData(children, len);
        } else {
            this.$['message-container'].classList.replace('none', 'empty');
            this.$['preview-container'].classList.replace('preview-container', 'none');
        }
    }

    _requestAllChildren() {
        this._requestFileMetadata({"scope": "partial", "limit": "max"}).then(data => {
            this.refreshRequire = false;
            this.setProperties({children: data.children});
        }).catch(err => {
            this.message = err.message;
            this.messageIcon = 'icons:warning';
            this.messageIconClass = 'warning-icon';
        })
    }

    _setPieChartData(children, len) {
        const arr = [["File Type", "Value"]];
        for (let i=0; i < len; i++) {
            const len2 = arr.length;
            const name = children[i].fileType === "DIR" ? "folder" : children[i].fileMimeType.split("/")[1];
            if (len2 > 1) {
                for (let j=1; j < len2; j++) {
                    if (arr[j][0] === name) {
                        arr[j][1] += 1;
                        break;
                    } else if (j === len2 - 1) {
                        arr.push([name, 1]);
                    }
                }
            } else {
                arr.push([name, 1]);
            }
        }
        this.setProperties({_data: arr});
    }

    _setIndexListener(e) {
        this.index = e.detail.index;
    }

    _setChildren(e) {
        if (e.detail.message === "successful") {
            this.children = e.detail.children;
        } else {
            this.message = e.detail.message;
            this.messageIcon = 'icons:warning';
            this.messageIconClass = 'warning-icon';
        }
    }

    _close() {
        this.dispatchEvent(new CustomEvent('dv-namespace-close-filemetadata-panel', {
            bubbles: true, composed: true
        }));
    }

    _computePreviewClass(ft) {
        return ft === "DIR" ? 'show' : 'none';
    }

    _rawOrFormatted(e) {
        window.CONFIG["file-metadata-viewer-formatted-mode"] = e.detail.value;
        this.__formatStyleSwitch(e.detail.value);
    }

    __formatStyleSwitch(isFormatted) {
        if (isFormatted) {
            this.$.raw.classList.replace("visible", "none");
            this.$.pretty.classList.replace("none", "visible");
        } else {
            this.$.raw.classList.replace("none", "visible");
            this.$.pretty.classList.replace("visible", "none");
        }
    }

    _requestFileMetadataWithPnfsId(pnfsId) {
        if (pnfsId !== "0" && this.knownMetadata.acl) {
            this.setProperties({metadata: this._filterMetadata(this.knownMetadata)});
            return;
        }
        this._requestFileMetadata({'scope': 'full'}).then(data => {
            this.setProperties({metadata: this._filterMetadata(data)});
        }).catch(() => {
            this.setProperties({metadata: this._filterMetadata(this.knownMetadata)});
        });
    }

    _filterMetadata(metadata) {
        delete metadata["locations"];
        delete metadata["pnfsId"];
        delete metadata["storageInfo"];
        delete metadata["storageClass"];
        delete metadata["hsm"];
        delete metadata["suris"];
        delete metadata["flags"];
        this.isLoading = false;
        return metadata;
    }

    _requestFileMetadata(additionalMessage) {
        const message = {
            'endpoint' : `${window.location.origin}${window.CONFIG['dcache-view.endpoints.webapi']}`,
            'file' : this.knownMetadata,
            'filePath' : this.path,
            'upauth' : this.getAuthValue()
        };
        Object.assign(message, additionalMessage);
        return this.fileMetadataPromise(message);
    }
}

window.customElements.define(FileMetadataDashboard.is, FileMetadataDashboard);

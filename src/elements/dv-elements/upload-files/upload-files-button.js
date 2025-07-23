import './upload-toast-file.js';

/**
 * --- Adopted from ----
 * https://github.com/googledrive/cors-upload-sample/blob/master/upload.js
 *
 * A class that can be use to upload any file into dcache.
 *
 * @constructor
 * @param {object} options Hash of options
 * @param {string} options.upauth Accept both Basic and Bearer. If it is Basic; Encoded Base64 of username:password
 * @param {file} options.file Blob-like item to upload
 * @param {url} options.url
 * @param {string} [options.contentType] Content-type, if overriding the type of the blob.
 * @param {function} [options.onComplete] Callback for when upload is complete
 * @param {function} [options.onProgress] Callback for status for the in-progress upload
 * @param {function} [options.onError] Callback if upload fails
 *
 *  @example
 *  var content = new Blob(["Hello world"], {"type": "text/plain"});
 *  var uploader = new UploadHandler({
 *      file: content,
 *      upauth: xxxx,
 *      onComplete: function(data) { ... },
 *      onError: function(data) { ... }
 *  })
 *  uploader.upload();
 */
const UploadHandler = function (options) {
    const noop = function () {
    };
    this.file = options.file;
    this.contentType = options.contentType || this.file.type || 'application/octet-stream';
    this.upauth = options.upauth;
    this.onComplete = options.onComplete || noop;
    this.onProgress = options.onProgress || noop;
    this.onError = options.onError || noop;
    this.url = options.url;
    this.httpMethod = 'PUT';
};

/**
 * Upload the actual file content.
 */
UploadHandler.prototype.upload = function()
{
    const content = this.file;
    const xhr = new XMLHttpRequest();
    xhr.open(this.httpMethod, this.url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', this.contentType);
    if (this.upauth && this.upauth !=="") {
        xhr.setRequestHeader('Authorization', this.upauth);
    }
    xhr.setRequestHeader('Suppress-WWW-Authenticate', "Suppress");
    if (xhr.upload) {
        xhr.upload.addEventListener('progress', this.onProgress);
    }
    xhr.onload = this.onContentUploadSuccess_.bind(this);
    xhr.onerror = this.onContentUploadError_.bind(this);
    xhr.send(content);
};

/**
 * Handle successful responses for uploads. If complete, invokes
 * the caller's callback.
 *
 * @private
 * @param {object} e XHR event
 */
UploadHandler.prototype.onContentUploadSuccess_ = function(e)
{
    if (e.target.status === 200 || e.target.status === 201) {
        this.onComplete(this.file);
    } else {
        this.onContentUploadError_(e);
    }
};

/**
 * Handles errors for uploads. [Client Side] error.
 *
 * @private
 * @param {object} e XHR event
 */
UploadHandler.prototype.onContentUploadError_ = function(e)
{
    if (e.target.status && e.target.status < 500) {
        this.onError(e.target);
    } else {
        this.onError(e.target);
    }
};
class UploadFilesButton extends DcacheViewMixins.Commons(Polymer.Element)
{
  static get template() {
    return Polymer.html`
        <style>
            :host{
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
            <input id="files" on-tap="_resetValue" type="file" multiple="">
            <label for="files">
                <paper-icon-button icon="icons:cloud-upload"></paper-icon-button>
                <paper-tooltip>upload files</paper-tooltip>
            </label>
        </div>
`;
  }

  constructor(auth)
  {
      super();
      if(auth) {
          this.authenticationParameters = auth;
      }
      this._handleFileSelection = this.handleFileSelection.bind(this);
      this._openFilePicker_ = this._openFilePicker.bind(this);
      this._setCurrentPath_ = this._setCurrentPath.bind(this);
  }
  static get is()
  {
      return 'upload-files-button';
  }
  static get properties()
  {
      return {
          currentPath: {
              type: String
          }
      };
  }
  connectedCallback()
  {
      super.connectedCallback();
      window.addEventListener('dv-namespace-upload-files', this._openFilePicker_);
      window.addEventListener('dv-namespace-current-path', this._setCurrentPath_);

      this.$.files.addEventListener('change', this._handleFileSelection);
      this.dispatchEvent(
          new CustomEvent('dv-namespace-request-current-path', {bubbles: true, composed: true}));
  }
  disconnectedCallback()
  {
      super.disconnectedCallback();
      window.removeEventListener('dv-namespace-upload-files', this._openFilePicker_);
      window.removeEventListener('dv-namespace-current-path', this._setCurrentPath_);

      this.$.files.removeEventListener('change', this._handleFileSelection);
  }
  handleFileSelection(e)
  {
      e.stopPropagation();
      e.preventDefault();
      if (window.File && window.FileReader && window.FileList && window.Blob) {
          this.dispatchEvent(new CustomEvent('dv-namespace-open-upload-toast', {
              bubbles: true, composed: true}));
          this.uploadFile(e.target.files);
      } else {
          this.dispatchEvent(new CustomEvent('dv-namespace-show-message-toast', {
              detail: {message: `No support for the File API in this web browser.`},
              bubbles: true, composed: true}));
      }
  }
  uploadFile(files)
  {
      const path = this.currentPath.endsWith("/") ? this.currentPath: `${this.currentPath}/`;
      const len = files.length;
      for (let i=0; i < len; i++) {
          const el = new UploadToastFile(files[i].name, "REGULAR", files[i].type);
          el.setAttribute("id", i.toString());
          this.dispatchEvent(new CustomEvent('dv-namespace-upload-toast-append-child', {
                  detail: {child: el}, bubbles: true, composed: true}));
          const upLs = el;
          const uploadURL = this.getFileWebDavUrl(`${path}${files[i].name}`, "write")[0];
          const uploader = new UploadHandler({
              file: files[i],
              upauth: this.getAuthValue(),
              url: uploadURL,
              onComplete: function (data) {
                  const progressBar = upLs.shadowRoot.querySelector('paper-progress');
                  progressBar.indeterminate = false;
                  progressBar.value = 100;
                  progressBar.classList.remove("error", "progress");
                  progressBar.classList.add("complete");

                  upLs.inProgress = false;
                  upLs.hasError = false;
                  upLs.isComplete = true;
                  upLs.message = "Uploaded";
                  this.dispatchEvent(new CustomEvent('dv-namespace-add-items', {
                      detail: {files: [{
                              "fileName" : data.name,
                              "fileMimeType" : data.type,
                              "fileLocality" : "",
                              "size" : data.size,
                              "fileType" : "REGULAR",
                              "mtime" : data.lastModified,
                              "creationTime" : Date.now()
                          }]},
                      bubbles: true, composed: true}));
              }.bind(this),

              onProgress: function (evt) {
                  const progressBar = upLs.shadowRoot.querySelector('paper-progress');
                  if (evt.lengthComputable) {
                      progressBar.classList.remove("error", "complete");
                      progressBar.classList.add("progress");
                      progressBar.indeterminate = false;
                      progressBar.value = (evt.loaded / evt.total) * 100;
                  }
                  upLs.progressValue = progressBar.value;
                  upLs.inProgress = true;
                  upLs.isComplete = false;
                  upLs.hasError = false;
              }.bind(this),

              onError: function (evt) {
                  const progressBar = upLs.shadowRoot.querySelector('paper-progress');
                  progressBar.classList.remove("progress", "complete");
                  progressBar.classList.add("error");
                  progressBar.indeterminate = false;
                  progressBar.value = 100;
                  upLs.message = evt.statusText;
                  upLs.inProgress = false;
                  upLs.isComplete = false;
                  upLs.hasError = true;
              }.bind(this)
          });
          uploader.upload();
      }
  }
  _openFilePicker()
  {
      this.$.files.click();
  }
  _setCurrentPath(e)
  {
      this.currentPath = e.detail.currentPath;
  }
  _resetValue(e)
  {
      this.$["files"].value = null;
  }
}
window.customElements.define(UploadFilesButton.is, UploadFilesButton);

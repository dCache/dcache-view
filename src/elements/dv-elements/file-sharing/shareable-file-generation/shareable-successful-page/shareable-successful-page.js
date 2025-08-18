import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-material/paper-material.js';

// If you rely on qr.js, import it or include it differently
// import 'qr.js/qr.js'; // adjust if available as an ES module or use other QR libraries

class ShareableSuccessfulPage extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          width: 100%;
          box-sizing: border-box;
          padding: 0 10px 15px 10px;
        }
        .description {
          display: flex;
          align-items: center;
          height: 40px;
          width: 100%;
          overflow-x: auto;
        }
        .result {
          flex: 1 1 auto;
          display: flex;
          padding: 0 10px;
          box-sizing: border-box;
        }
        .text-container {
          flex: 1 1 auto;
          box-sizing: border-box;
          border-right: 1px solid #ccc;
          padding-right: 10px;
        }
        .qr-container {
          margin-left: 10px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .image-container {
          flex: 1 1 auto;
          box-sizing: border-box;
          text-align: center;
        }
        .link, .macaroon {
          display: flex;
          flex-direction: column;
          height: 20%;
          box-sizing: border-box;
        }
        .link {
          margin-bottom: 10px;
        }
        .macaroon {
          margin-top: 5px;
          border-top: 1px solid #ccc;
        }
        .top, .button {
          height: 26px;
          box-sizing: border-box;
        }
        .body {
          flex: 1 1 auto;
          display: flex;
          box-sizing: border-box;
        }
        .macaroon .button, .link .button {
          margin-top: 4px;
        }
        .txt {
          flex: 1 1 auto;
          word-wrap: break-word;
          word-break: break-all;
          text-align: justify;
          text-justify: inter-word;
          text-indent: 0;
          resize: none;
          overflow-y: scroll;
        }
        .button paper-button {
          height: 100%;
          width: 100%;
          margin: 0;
        }
        .help-icon {
          width:15px;
          height:15px;
          fill: #828282;
        }
        .help-icon-container {
          display:inline-block;
          padding-left: 5px;
        }
        .blue {
          background: #03a9f4;
          color: white;
          border-radius: 0;
        }
        .green {
          background: #009688;
          color: white;
          border-radius: 0;
        }
        .blue iron-icon, .green iron-icon {
          width: 18px;
        }
      </style>

      <div class="description">
        <p>
          [[dirOrFile]] name: <b>[[fullPath]]</b>
        </p>
      </div>
      <div class="result">
        <div class="text-container">
          <div class="link">
            <div class="top">
              <span>
                <b>Shareable Link:</b>
                <div class="help-icon-container">
                  <iron-icon icon="help" class="help-icon"></iron-icon>
                  <paper-tooltip>Shareable link with the [[dirOrFile]] shown on a landing page. Requires a web browser for access.</paper-tooltip>
                </div>
              </span>
            </div>
            <div class="body">
              <textarea id="linkText" class="txt" rows="1" readonly title="">[[generatedLink]]</textarea>
            </div>
            <div class="button">
              <paper-button class="blue" @click="_copyLink" raised>
                <iron-icon icon="link"></iron-icon>&nbsp;Copy link
              </paper-button>
            </div>
          </div>

          <div class="link">
            <div class="top">
              <span>
                <b>Direct Link:</b>
                <div class="help-icon-container">
                  <iron-icon icon="help" class="help-icon"></iron-icon>
                  <paper-tooltip>Direct link to the [[dirOrFile]] for access. Suitable for use with non-browser tools like curl, wget, rclone, download managers, etc.</paper-tooltip>
                </div>
              </span>
            </div>
            <div class="body">
              <textarea id="linkDirect" class="txt" rows="1" readonly title="">[[directLink]]</textarea>
            </div>
            <div class="button">
              <paper-button class="blue" @click="_copyDirect" raised>
                <iron-icon icon="link"></iron-icon>&nbsp;Copy link
              </paper-button>
            </div>
          </div>

          <div class="link">
            <div class="top">
              <span>
                <b><a href="https://rclone.org/webdav/#dcache" target="_blank" rel="noopener noreferrer">Rclone</a> config:</b>
                <template is="dom-if" if="[[_equal(fileType, 'DIR')]]">
                  <div class="help-icon-container">
                    <iron-icon icon="help" class="help-icon"></iron-icon>
                    <paper-tooltip>Configuration snippet for the rclone utility to add a remote named <b>[[fileName]]</b> with access using the generated token. Typically added to your <tt>.config/rclone/rclone.conf</tt> file.</paper-tooltip>
                  </div>
                </template>
              </span>
            </div>
            <div class="body">
              <textarea id="rcloneConf" class="txt" readonly title="">[[rcloneRC]]</textarea>
            </div>
            <div class="button">
              <paper-button class="green" @click="_copyRclone" raised>
                <iron-icon icon="content-copy"></iron-icon>&nbsp;Copy Rclone config
              </paper-button>
            </div>
          </div>

          <div class="macaroon">
            <div class="top">
              <span>
                <b>Macaroon:</b>
                <div class="help-icon-container">
                  <iron-icon icon="help" class="help-icon"></iron-icon>
                  <paper-tooltip>The actual access token (only).</paper-tooltip>
                </div>
              </span>
            </div>
            <div class="body">
              <textarea id="macaroonText" class="txt" rows="1" readonly title="">[[macaroon]]</textarea>
            </div>
            <div class="button">
              <paper-button class="green" @click="_copyMacaroon" raised>
                <iron-icon icon="content-copy"></iron-icon>&nbsp;Copy macaroon
              </paper-button>
            </div>
          </div>
        </div>

        <div class="qr-container">
          <div class="qr">
            <div class="top">
              <span><b>QR Code for the shareable link:</b></span>
            </div>
            <div class="image-container paper-material" elevation="1">
              <img src="[[generatedQR]]" alt="QR code for shareable link" />
              <div class="button">
                <paper-button @click="_downloadGenQR">
                  <iron-icon icon="file-download"></iron-icon>Download QR code
                </paper-button>
              </div>
            </div>
          </div>

          <div class="qr">
            <div class="top">
              <span><b>QR Code for the direct link:</b></span>
            </div>
            <div class="image-container paper-material" elevation="1">
              <img src="[[directQR]]" alt="QR code for direct link" />
              <div class="button">
                <paper-button @click="_downloadDirectQR">
                  <iron-icon icon="file-download"></iron-icon>Download QR code
                </paper-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }

    static get properties() {
        return {
            dirOrFile: String,
            fullPath: String,
            generatedLink: String,
            directLink: String,
            rcloneRC: String,
            macaroon: String,
            generatedQR: String,
            directQR: String,
            fileType: String,
            fileName: String,
        };
    }

    _copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Copied to clipboard:', text);
            }, err => {
                console.error('Could not copy text: ', err);
            });
        } else {
            // Fallback method
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                console.log('Copied to clipboard fallback:', text);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            document.body.removeChild(textarea);
        }
    }

    _copyLink() {
        this._copyToClipboard(this.generatedLink);
    }

    _copyDirect() {
        this._copyToClipboard(this.directLink);
    }

    _copyRclone() {
        this._copyToClipboard(this.rcloneRC);
    }

    _copyMacaroon() {
        this._copyToClipboard(this.macaroon);
    }

    _downloadGenQR() {
        this._downloadImage(this.generatedQR, 'shareable-link-qr.png');
    }

    _downloadDirectQR() {
        this._downloadImage(this.directQR, 'direct-link-qr.png');
    }

    _downloadImage(dataUrl, filename) {
        if (!dataUrl) return;
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        a.click();
    }

    _equal(a, b) {
        return a === b;
    }
}

customElements.define('shareable-successful-page', ShareableSuccessfulPage);
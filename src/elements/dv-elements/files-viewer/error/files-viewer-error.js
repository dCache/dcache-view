import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';

class FilesViewerError extends PolymerElement {
    static get template() {
        return html`
            <style>
                :host {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    padding: 20%;
                    box-sizing: border-box;
                }
                div {
                    margin: auto;
                    background: #333;
                    color: #fafafa;
                    padding: 15px;
                    flex: 1 1 auto;
                    text-align: center;
                }
                p {
                    line-height: 1.9;
                }
                a {
                    color: #f0f8ff;
                    white-space: nowrap;
                }
            </style>
            <div>
                <p>
                    Sorry, the file cannot be viewed, but don't worry, you can
                    <a href="[[src]]" download="[[name]]">
                        <iron-icon icon="file-download"></iron-icon>download
                    </a>
                    and view it with the appropriate viewer!
                </p>
            </div>
        `;
    }

    static get properties() {
        return {
            src: {
                type: String,
                notify: true,
            },
            name: {
                type: String,
                notify: true,
            },
        };
    }
}

customElements.define('files-viewer-error', FilesViewerError);
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';  // npm or node_modules import
import { FilesViewerMixin } from '../mixin/files-viewer-mixin.js';

class VideoViewer extends FilesViewerMixin(PolymerElement) {
    static get template() {
        return html`
      <style>
        :host {
          display: flex;
          width: 100%;
          height: 100%;
        }
        paper-button {
          text-transform: lowercase;
        }
        video {
          width: 100%;
          height: auto;
        }
        .video-container {
          padding: 0 5%;
          box-sizing: border-box;
          flex: 1 1 auto;
          margin: auto;
        }
      </style>
      <div class="video-container">
        <video id="video" on-error="_error" controls></video>
      </div>
    `;
    }
}

customElements.define('video-viewer', VideoViewer);
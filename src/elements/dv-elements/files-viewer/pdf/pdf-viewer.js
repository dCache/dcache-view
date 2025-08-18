import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { FilesViewerMixin } from '../mixin/files-viewer-mixin.js';

class PdfViewer extends FilesViewerMixin(PolymerElement) {
    static get template() {
        return html`
      <style>
        :host {
          margin: auto;
        }
      </style>
      <canvas id="canvas"></canvas>
    `;
    }
}

customElements.define('pdf-viewer', PdfViewer);
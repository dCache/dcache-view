import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../mixin/files-viewer-mixin.js'; // Assuming this is also converted to a module

class ImageViewer extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          margin: auto;
        }
        .none {
          display: none;
        }
        #img {
          transform: rotate(0deg);
        }
      </style>
      <img id="img" class="none" on-error="_error" width$="[[_width]]" height$="[[_height]]">
    `;
    }

    static get is() { return 'image-viewer'; }

    // Add properties or methods as needed, for example:
    static get properties() {
        return {
            _width: String,
            _height: String
        };
    }

    _error(e) {
        // handle image error
        console.error('Image loading error', e);
        this.shadowRoot.getElementById('img').classList.add('none');
    }
}

customElements.define(ImageViewer.is, ImageViewer);
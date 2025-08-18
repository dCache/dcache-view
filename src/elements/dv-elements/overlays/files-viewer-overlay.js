import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior/iron-overlay-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

class FilesViewerOverlay extends mixinBehaviors([IronOverlayBehavior], PolymerElement) {
  static get is() {
    return 'files-viewer-overlay';
  }

  static get template() {
    return html`<slot></slot>`;
  }
}

window.customElements.define(FilesViewerOverlay.is, FilesViewerOverlay);

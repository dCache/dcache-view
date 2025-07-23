import './mixin/files-viewer-mixin.js';
class AdditionalTools extends DcacheViewMixins.FilesViewerMixin(Polymer.Element)
{
  static get template() {
    return Polymer.html`
        <style>
            #wrapper {
                background: rgba(0, 0, 0, 0.4);
                padding: 15px 5px;
                border-radius: 10px;
                border: 1px solid #616161;
            }
            paper-fab {
                --paper-fab-keyboard-focus-background: rgb(189,189,189);
                background-color: #323232;
                width: 36px;
                height: 36px;
            }
            paper-fab+paper-fab {
                margin-top: 14px;
            }
        </style>
        <div id="wrapper">
            <paper-fab mini="" icon="icons:file-download" on-tap="_download"></paper-fab>
            <paper-fab mini="" icon="icons:add" on-tap="_zoomIn"></paper-fab>
            <paper-fab mini="" icon="icons:remove" on-tap="_zoomOut"></paper-fab>
            <paper-fab mini="" icon="image:rotate-left" on-tap="_rotateLeft"></paper-fab>
            <paper-fab mini="" icon="image:rotate-right" on-tap="_rotateRight"></paper-fab>
        </div>
`;
  }

  constructor()
  {
      super();
  }
  static get is()
  {
      return 'additional-tools';
  }
  _zoomIn()
  {
      this.dispatchEvent(
          new CustomEvent('dv-namespace-files-viewer-zoom-in', {bubbles: true, composed: true})
      );
  }
  _zoomOut()
  {
      this.dispatchEvent(
          new CustomEvent('dv-namespace-files-viewer-zoom-out', {bubbles: true, composed: true})
      );
  }
  _rotateLeft()
  {
      this.dispatchEvent(
          new CustomEvent('dv-namespace-files-viewer-rotate-left', {bubbles: true, composed: true})
      );
  }
  _rotateRight()
  {
      this.dispatchEvent(
          new CustomEvent('dv-namespace-files-viewer-rotate-right', {bubbles: true, composed: true})
      );
  }
}
window.customElements.define(AdditionalTools.is, AdditionalTools);

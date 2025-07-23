import '../files-viewer/json/json-viewer.js';
class RawFileMetadata extends Polymer.Element
{
  static get template() {
    return Polymer.html`
        <style>
            :host {
                -webkit-font-smoothing: antialiased;
            }
            .paper-material {
                background: #fff;
                margin: 10px;
                padding: 5px;
                border-radius: 4px;
                border: 1px solid #bbb;
            }
        </style>
        <div class="paper-material">
            <json-viewer json="[[metadata]]"></json-viewer>
        </div>
`;
  }

  constructor()
  {
      super();
  }
  static get is()
  {
      return 'raw-file-metadata';
  }
  static get properties()
  {
      return {
          metadata: {
              type: Object,
              notify: true
          },
          isLoading: {
              type: Boolean,
              value: true,
              notify: true
          }
      }
  }
}
window.customElements.define(RawFileMetadata.is, RawFileMetadata);

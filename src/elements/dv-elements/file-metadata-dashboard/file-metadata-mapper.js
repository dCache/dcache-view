import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';

import '../utils/mixins/commons.js';

class FileMetadataMapper extends DcacheViewMixins.Commons(PolymerElement) {
    static get is() { return 'file-metadata-mapper'; }

    static get properties() {
        return {
            metadata: { type: Object, notify: true, observer: '_namespaceMapper' },
            _metadataSN: { type: Array, value: () => [], notify: true },
            _metadataOA: { type: Array, value: () => [], notify: true },
            isLoading: { type: Boolean, notify: true }
        };
    }

    static get template() {
        return html`
      <style include="paper-material-styles">
        :host {
          -webkit-font-smoothing: antialiased;
        }
        .body { display: block; margin: 10px; box-sizing: border-box; }
        .row { display: flex; line-height: 20px; font-size: 0.8em; }
        .row + .row { padding: 4px 0; }
        .title { flex: 0 0 100px; color: #5f6368; margin-right: 20px; }
        .value { box-sizing: border-box; flex: 1 1 auto; overflow: hidden; word-wrap: break-word; }
        .loading { position: absolute; height: 100%; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; margin-bottom: 2px; text-align: center; font-size: 0.8em; }
        .none { display: none; }
        .paper-material { background: #fff; margin: 10px; padding: 5px; border-radius: 4px; border: 1px solid #bbb; }
        .description { box-sizing: border-box; background: #f1f1f1; font-size: 0.8em; padding: 5px 15px; margin-left: -5px; margin-right: -5px; margin-top: -5px; border-top-left-radius: 4px; border-top-right-radius: 4px; }
        paper-tooltip { max-width: 250px; }
      </style>

      <div class="paper-material" elevation="1">
        <div class="description"><span>DETAILS</span></div>
        <div class="body">
          <template is="dom-repeat" items="[[_metadataSN]]">
            <div class="row">
              <div class="title">
                [[item.name]]
                <paper-tooltip offset="0" position="right" fit-to-visible-bounds>[[item.description]]</paper-tooltip>
              </div>
              <div class="value">[[item.value]]</div>
            </div>
          </template>
        </div>
      </div>

      <template is="dom-repeat" items="[[_metadataOA]]">
        <div class="paper-material" elevation="1">
          <div class="description">
            <span>[[item.name]]</span>
            <paper-tooltip offset="0" fit-to-visible-bounds>[[item.description]]</paper-tooltip>
          </div>
          <div class="body">
            <fm-inner-mapper context="[[item]]"></fm-inner-mapper>
          </div>
        </div>
      </template>

      <div class$="[[computedClass(isLoading)]]">
        <paper-spinner active></paper-spinner>
        <span>requesting for the file metadata</span>
      </div>
    `;
    }

    _isStringOrNumber(type) {
        return type === 'String' || type === 'Number';
    }

    _namespaceMapper(m) {
        // Logic remains the same...
    }

    _formattedDateTime(dateTimeValue) {
        return (new Date(dateTimeValue)).toString();
    }

    computedClass(isLoading) {
        return isLoading ? 'loading' : 'none';
    }
}
customElements.define(FileMetadataMapper.is, FileMetadataMapper);

class FmInnerMapper extends PolymerElement {
    static get is() { return 'fm-inner-mapper'; }

    static get properties() {
        return {
            context: {
                type: Object,
                value: () => ({}),
                notify: true,
                observer: '_contextObserver'
            }
        };
    }

    static get template() {
        return html`
      <style>
        .row { display: flex; line-height: 20px; font-size: 0.8em; }
        .row + .row { padding: 4px 0; }
        .title { flex: 0 0 100px; color: #5f6368; margin-right: 20px; }
        .value { box-sizing: border-box; flex: 1 1 auto; overflow: hidden; word-wrap: break-word; }
        .row-in-column { flex-direction: column; }
      </style>
      <div id="container"></div>
    `;
    }

    _contextObserver(item) {
        // Logic remains the same...
    }

    _appendArrayNode(parentNode, arr, name) {
        // Logic remains the same...
    }

    _appendObjectNode(parentNode, obj, name) {
        // Logic remains the same...
    }

    _emptyNode(parenNode, name) {
        // Logic remains the same...
    }
}
customElements.define(FmInnerMapper.is, FmInnerMapper);

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
/*
import './file-icon.js'; // Adjust path to your file-icon component
*/

class DragEnterToast extends PolymerElement {
    static get is() {
        return 'drag-enter-toast';
    }

    static get properties() {
        return {
            directoryName: {
                type: String,
                value: 'Root',
                notify: true
            }
        };
    }

    static get template() {
        return html`
      <style>
        :host {
          width: 100%;
          display: flex;
          padding-bottom: 10px;
        }

        iron-icon {
          --iron-icon-width: 72px;
          --iron-icon-height: 72px;
          fill: #808080;
        }

        #holderParent {
          flex: 1 1 auto;
        }

        #wrapper {
          display: flex;
          justify-content: center;
        }

        #infoHolder {
          width: 250px;
        }

        .flexContainer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        #content {
          background: #4a806b;
          color: white;
          height: 65px;
          width: 250px;
          border-radius: 2px;
          border: 2px solid #4a806b;
          box-sizing: border-box;
          box-shadow: 20px 20px 100px 40px rgba(0, 0, 0, 0.3);
        }

        file-icon {
          fill: white !important;
        }

        .displayDirName {
          padding-left: 10px;
          width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }

        .bounce {
          animation: bounce 2s 4;
        }
      </style>

      <div style="width:60px;"></div>
      <div id="holderParent">
        <div id="wrapper">
          <div id="infoHolder" class="flexContainer">
            <iron-icon icon="cloud-upload" class="bounce"></iron-icon>
            <div id="content" class="flexContainer">
              <div>
                <span style="letter-spacing: 0.4px; font-weight: 300;">
                  Drop files to upload them into:
                </span>
              </div>
              <div style="margin-top: 10px;">
                <file-icon mime-type="application/vnd.dcache.folder"></file-icon>
                <span class="displayDirName">
                  [[directoryName]]
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }

    static get observers() {
        return ['computeClosingTime(directoryName)'];
    }

    computeClosingTime(name) {
        if (window.app?.closingTime !== undefined) {
            window.app.closingTime += 1000;
            // If using Polymer's data binding, use notifyPath in older setups
            // But in Polymer 3, you usually just reassign or use observered properties.
        }
    }
}

customElements.define(DragEnterToast.is, DragEnterToast);

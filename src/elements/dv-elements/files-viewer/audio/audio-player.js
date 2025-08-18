import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class AudioPlayer extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          margin: auto;
        }
      </style>
      <audio id="audio" controls on-error="_error"></audio>
    `;
    }

    _error(e) {
        console.error('Audio playback error:', e);
        // Add your error handling logic here
    }
}

customElements.define('audio-player', AudioPlayer);
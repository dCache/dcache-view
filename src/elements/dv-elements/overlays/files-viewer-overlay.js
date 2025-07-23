Polymer({
  _template: Polymer.html`
        <slot></slot>
`,

  is: 'files-viewer-overlay',
  behaviors: [Polymer.IronOverlayBehavior]
});

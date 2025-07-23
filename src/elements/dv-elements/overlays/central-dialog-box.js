Polymer({
  _template: Polymer.html`
        <style include="paper-dialog-shared-styles"></style>
        <slot></slot>
`,

  is: 'central-dialog-box',

  behaviors: [
      Polymer.PaperDialogBehavior
  ]
});

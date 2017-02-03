(function(document) {
    'use strict';

    var app = document.querySelector('#app');

    // Sets app default base URL
    app.baseUrl = '/';

    // Listen for template bound event to know when bindings
    // have resolved and content has been stamped to the page
    app.addEventListener('dom-change', function() {
    });

    // See https://github.com/Polymer/polymer/issues/1381
    window.addEventListener('WebComponentsReady', function() {
        // imports are loaded and elements have been registered
    });

    app.menuAction = function(){
        app.$.dfDrawerPanel.togglePanel();
    };
})(document);
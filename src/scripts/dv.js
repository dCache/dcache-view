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

    /**
     * List directory -> use by other elements like:
     * list-row, pagination-button, hover-contextual
     */
    app.ls = function(path)
    {
        app.$.homedir.innerHTML = "";
        app.$.selectedTitle.querySelector("#pagination").innerHTML = "";
        const elRoot = new PaginationButton("Root", "/");
        if ( path == "/" || path == null || path == undefined || path.type == 'tap') {
            elRoot.querySelector('a').classList.add("active");
            app.$.selectedTitle.querySelector("#pagination").appendChild(elRoot);
            path = '/';
        } else {
            elRoot.querySelector('a').classList.remove("active");
            app.$.selectedTitle.querySelector("#pagination").appendChild(elRoot);
            const dirNames = path.split("/");
            let pt =  "";
            for (let i = 1; i < dirNames.length; i++) {
                pt += "/" + dirNames[i];
                const el = new PaginationButton(dirNames[i], pt);
                el.querySelector('a').classList.remove("active");
                if ( i == (dirNames.length-1) ) {
                    el.querySelector('a').classList.add("active");
                }
                app.$.selectedTitle.querySelector("#pagination").appendChild(el);
            }
        }

        const el1 = new ViewFile(path);
        app.$.homedir.appendChild(el1);
    };

    app.lsHomeDir = function()
    {
        app.ls(window.CONFIG.homeDirectory);
    };

    window.addEventListener('paper-responsive-change', function (event) {
        var narrow = event.detail.narrow;
        app.$.mainMenu.hidden = !narrow;
    });

    //Ensure that paper-input in the dialog box is always focused
    window.addEventListener('iron-overlay-opened', function(event) {
        var input = event.target.querySelector('[autofocus]');
        if (input != null) {
            switch(input.tagName.toLowerCase()) {
                case 'input':
                    input.focus();
                    break;
                case 'paper-textarea':
                case 'paper-input':
                    input.$.input.focus();
                    break;
            }
        }
    });
})(document);
(function(document) {
    'use strict';

    var app = document.querySelector('#app');

    // Global variables for monitoring drag and drop activities
    let dndCounter = 0;
    let timeoutID, dndArr = [];
    app.closingTime = 3000;

    // Sets app default base URL
    app.baseUrl = '/';

    // Listen for template bound event to know when bindings
    // have resolved and content has been stamped to the page
    app.addEventListener('dom-change', function() {
    });

    // See https://github.com/Polymer/polymer/issues/1381
    window.addEventListener('WebComponentsReady', function() {
        // imports are loaded and elements have been registered
        if (window.CONFIG.qos === undefined && window.CONFIG.isSomebody) {
            const apiEndPoint = window.CONFIG.webapiEndpoint;

            const qos = new QosBackendInformation(apiEndPoint);
            qos.addEventListener('qos-backend-response', (e) => {
                window.CONFIG.qos = e.detail.response;
            });
        }
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

    app.currentDirContext = function(e)
    {
        if (app.$.centralContextMenu.opened) {
            app.$.centralContextMenu.close();
        }
        app.$.centralContextMenu.innerHTML = "";

        let path = app.$.homedir.querySelector('view-file').path;
        let name;
        if (path === "/") {
            name = 'ROOT';
        } else {
            name = path.slice(path.lastIndexOf("/"));
        }
        let fm = {"name":name,"filePath":path, "fileType":"DIR"};
        let cc = new NamespaceContextualContent(fm, 2);
        app.$.centralContextMenu.appendChild(cc);
        let x = 0, y = 0;

        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else if (e.clientX || e.clientY) {
            x = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }

        const vx = window.innerWidth;
        const vy = window.innerHeight;
        const w = 250;
        const h = 176;

        if (vx - x < w && vy - y >= h) {
            app.x = x-w;
            app.y = y;
        } else if (vx - x < w && vy - y < h) {
            app.x = x-w;
            app.y = y-h;
        } else if (vx - x >= w && vy - y < h) {
            app.x = x;
            app.y = y-h;
        } else {
            app.x = x;
            app.y = y;
        }
        app.notifyPath('x');
        app.notifyPath('y');
        app.$.centralContextMenu.resetFit();
        app.$.centralContextMenu.open();
    };

    /**
     * Get the file name from the file path
     */
    app.getfileName = function (path)
    {
        if (path === null || path === "" || path === "/") {
            return 'Root';
        } else {
            let pt = path.endsWith('/') ? path.slice(0,-1): path;
            return pt.slice(pt.lastIndexOf('/')).substring(1);
        }
    };

    // Listing directory with time delay of @timeDelay
    app.delayedLs = function (path, timeDelay)
    {
        timeoutID = window.setTimeout(()=>{
            app.ls(path);
            dndArr = [];
            dndArr.length = 0;
        },timeDelay);
    };

    // abort request to delayed listing directory
    app.clearDelayedLs = function()
    {
        dndArr = [];
        dndArr.length = 0;
        window.clearTimeout(timeoutID);
    };

    app.delayTact = function (file)
    {
        dndArr.push(file);
        const len = dndArr.length;
        if (len === 1) {
            app.delayedLs(file.__data__.filePath, 2000);
        } else if (dndArr[len - 1].__data__.name !== dndArr[len - 2].__data__.name) {
            app.clearDelayedLs();
        }
    };

    /**
     *
     * current view drag and drop events listeners
     */
    app.drop = function(e)
    {
        let event = e || event;
        event.preventDefault && event.preventDefault();

        app.$.dropZoneToast.close();

        let upload = new DndUpload(app.$.homedir.querySelector('view-file').path);
        upload.start(event);

        dndCounter = 0;
    };
    app.dragenter = function(e)
    {
        let event = e || event;
        event.preventDefault && event.preventDefault();
        dndCounter++;

        app.$.dropZoneContent.querySelector('drag-enter-toast').directoryName =
            app.getfileName(app.$.homedir.querySelector('view-file').path);
        if (!app.$.dropZoneToast.opened){
            app.$.dropZoneToast.open();
        }
    };
    app.dragleave = function()
    {
        dndCounter--;
    };
    app.dragend = function()
    {
        dndCounter = 0;
    };
    app.dragexit = function()
    {
        dndCounter = 0;
    };

    app.checkBrowser = function ()
    {
        const ua = window.navigator.userAgent;
        let tem = [];
        let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i);

        if(/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+.?\d*)/g.exec(ua) || [];
            return {name: 'Internet Explorer', version: tem[1]};
        } else if(/firefox/i.test(M[1])) {
            tem = /\brv[ :]+(\d+.?\d*)/g.exec(ua) || [];
            return {name: 'Firefox', version: tem[1]};
        } else if(/safari/i.test(M[1])) {
            tem = ua.match(/\bVersion\/(\d+.?\d*\s*\w+)/);
            return {name: 'Safari', version: tem[1]};
        } else if(M[1] === 'Chrome') {
            //opera
            const temOpr = ua.match(/\b(OPR)\/(\d+.?\d*.?\d*.?\d*)/);
            //edge
            const temEdge = ua.match(/\b(Edge)\/(\d+.?\d*)/);
            //chrome
            const temChrome = ua.match(/\b(Chrome)\/(\d+.?\d*.?\d*.?\d*)/);
            let genuineChrome = temOpr === null && temEdge === null && temChrome !== null;

            if(temOpr !== null) {
                return {name: temOpr[1].replace('OPR', 'Opera'), version: temOpr[2]};
            }

            if(temEdge !== null) {
                return {name: temEdge[1], version: temEdge[2]};
            }

            if(genuineChrome) {
                return {name: temChrome[1], version: temChrome[2]};
            }
        }
    };

    /**
     * Reset the duration counter for the drag and drop Toast
     */
    app.dndToastClosed = function ()
    {
        app.closingTime = 3000;
    };

    function updateFeListAndMetaDataDrawer(status, itemIndex)
    {
        if (app.$.metadata.selected == 'drawer'){
            app.$.metadata.querySelector('file-metadata').currentQos = status;
        }
        app.$.homeDir.querySelector('#feList')
            .set('items.'+itemIndex+'.currentQos', status);
        app.$.homeDir.querySelector('#feList').notifyPath('items.'+itemIndex+'.currentQos');
    }

    function periodicalCurrentQosRequest(options)
    {
        let namespace = document.createElement('dcache-namespace');
        namespace.auth = sessionStorage.upauth;
        namespace.promise.then( (req) => {
            if (req.response.targetQos !== undefined) {
                updateFeListAndMetaDataDrawer('&#8594; '+ options.targetQos, options.itemIndex);

                //ask every two seconds
                setTimeout(periodicalCurrentQosRequest(options), 2000);
            } else if (req.response.currentQos == options.targetQos) {
                updateFeListAndMetaDataDrawer(req.response.currentQos, options.itemIndex);

                app.$.toast.text = "Transition complete! ";
                app.$.toast.show();
            } else {
                updateFeListAndMetaDataDrawer(options.currentQos, options.itemIndex);

                app.$.toast.text = "Transition terminated. ";
                app.$.toast.show();
            }
        }).catch(
            function(err) {
                app.$.toast.text = err.message + " ";
                app.$.toast.show();
            }
        );
        namespace.getqos({
            url: window.CONFIG.webapiEndpoint + 'namespace',
            path: options.path
        });
    }

    window.addEventListener('qos-in-transition', function(event) {
        //make request after 0.1 seconds
        setTimeout(periodicalCurrentQosRequest(event.detail.options), 100);
    });

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

    // Prevent the default context menu display from right click
    window.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });

    window.addEventListener('iron-overlay-canceled', ()=> {
        app.$.homedir.querySelector('iron-list').selectionEnabled = false;
        setTimeout(()=>{app.$.homedir.querySelector('iron-list').selectionEnabled = true;},10)
    });

    // Prevent drag and drop default behaviour on the page
    window.addEventListener('drag', function(event) {
        event.preventDefault();
        return false;
    });
    window.addEventListener('drop', function(event) {
        event.preventDefault();
        return false;
    });
    window.addEventListener('dragenter', function(event) {
        event.preventDefault();
        return false;
    });
    window.addEventListener('dragover', function(event) {
        event.preventDefault();
        return false;
    });
})(document);
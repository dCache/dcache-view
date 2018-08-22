(function(document) {
    'use strict';

    //console.info("Polymer version:", Polymer.version);

    var app = document.querySelector('#app');

    // Global variables for monitoring drag and drop activities
    let dndCounter = 0;
    let timeoutID, dndArr = [];
    app.closingTime = 3000;
    app.mvObj = {};

    // Sets app default base URL
    app.baseUrl = '/';

    // See https://github.com/Polymer/polymer/issues/1381
    window.addEventListener('WebComponentsReady', function() {
        // imports are loaded and elements have been registered
        app.getQosInformation();
    });

    app.getQosInformation = function()
    {
        const isSomebody = !(app.getAuthValue() ===
            `Basic ${window.btoa('anonymous:nopassword')}`);
        if (window.CONFIG.qos === undefined && isSomebody) {
            const qos = new QosBackendInformation();
            qos.auth = app.getAuthValue();
            qos.apiEndPoint = window.CONFIG["dcache-view.endpoints.webapi"];
            qos.addEventListener('qos-backend-response', (e) => {
                window.CONFIG.qos = e.detail.response;
            });
            qos.trigger();
        }
    };

    app.menuAction = function(){
        app.$.dvDrawerPanel.togglePanel();
    };

    /**
     * List directory -> use by other elements like:
     * list-row, pagination-button, hover-contextual
     * @deprecated
     * TODO: move this to the listener
     */
    app.ls = function(path)
    {
        app.$.homedir.removeChild(app.$.homedir.querySelector('view-file'));
        const el1 = new ViewFile(path);
        app.$.homedir.appendChild(el1);

        setTimeout(()=>{
            app.$.selectedTitle.shadowRoot.querySelector("#pagination").innerHTML = "";

            const elRoot = new PaginationButton("Root", "/");
            app.$.selectedTitle.shadowRoot.querySelector("#pagination").appendChild(elRoot);
            if ( path == "/" || path == null || path == undefined || path.type == 'tap') {
                elRoot.shadowRoot.querySelector('a').classList.add("active");
            } else {
                elRoot.shadowRoot.querySelector('a').classList.remove("active");
                const dirNames = path.split("/");
                let pt =  "";
                for (let i = 1; i < dirNames.length; i++) {
                    pt += "/" + dirNames[i];
                    const el = new PaginationButton(dirNames[i], pt);
                    app.$.selectedTitle.shadowRoot.querySelector("#pagination").appendChild(el);
                    el.shadowRoot.querySelector('a').classList.remove("active");
                    if ( i == (dirNames.length-1) ) {
                        el.shadowRoot.querySelector('a').classList.add("active");
                    }
                }
            }
        },100);
        el1.__listDirectory();
    };

    app.lsHomeDir = function()
    {
        app.ls(sessionStorage.homeDirectory);
    };

    /**
     *
     * @deprecated
     * this should no longer be use for removing all
     * nodes of an element.
     * TODO: Once the implementation of mixins is complete this should be removed.
     *
     */
    app.removeAllChildren = function (node)
    {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    };

    app.currentDirContext = function(e)
    {
        /**
         * This code include a workaround to accommodate firefox.
         * TODO: When firefox support web components fully, revisit
         * this patch and update accordingly
         * ISSUE STATUS: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Status_in_Firefox
         * See also:
         * a. https://caniuse.com/#search=Shadow%20DOM
         * b. https://caniuse.com/#search=Custom%20Elements
         */
        app.$.centralSubContextMenu.close();
        const contextMenu = app.$.centralContextMenu;
        contextMenu.close();
        app.removeAllChildren(contextMenu);

        const vf = app.$.homedir.querySelector('view-file');
        let x = 0, y = 0, h = 110, cc;
        if (e.screenX === 0 & e.screenY === 0) {
            const arr = e.path || (e.composedPath && e.composedPath());
            const lr = arr.find(function (el) {
                return el.tagName === "LIST-ROW";
            });

            if (lr.xSelected && vf._xSelectedItems.length > 1) {
                cc = new NamespaceContextualContent({files: vf._xSelectedItems}, 1);
            } else {
                cc = new NamespaceContextualContent(lr, 0);
            }
            h = 245;
        } else {
            cc = new NamespaceContextualContent(vf.currentDirMetaData, 2);
        }

        const w = 200;
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
        contextMenu.appendChild(cc);
        contextMenu.open();
    };

    app.subContextMenu = function(e)
    {
        if (!app.$.centralSubContextMenu.opened) {
            app.removeAllChildren(app.$.centralSubContextMenu);
            const content = new ChangeQosContextualMenu(e.detail.targetNode);

            const vx = window.innerWidth;
            const w = 198;

            app.a = vx - app.x < w * 2.1 ? app.x - w : w + app.x;
            app.b = app.y + 15;
            app.notifyPath('a');
            app.notifyPath('b');
            app.$.centralSubContextMenu.appendChild(content);
            app.$.centralSubContextMenu.open();
        }
    };

    app.click = function (e) {
        this.dispatchEvent(
            new CustomEvent('dv-namespace-reset-element-internal-parameters', {
                detail: {element: 'view-file'}, bubbles: true, composed: true}));
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
            app.delayedLs(file.__data.filePath, 2000);
        } else if (dndArr[len - 1].__data.name !== dndArr[len - 2].__data.name) {
            app.clearDelayedLs();
        }
    };

    /**
     *
     * current view drag and drop events listeners
     */
    app.drop = function(e)
    {
        let event = e || event, iC = true, path, flag = false;
        if (event.detail === 0) {
            event.preventDefault && event.preventDefault();
            dndCounter = 0;
            path = app.$.homedir.querySelector('view-file').path;
        } else {
            const targetNode = event.detail.file;
            path = event.detail.filePath;
            iC = path === app.$.homedir.querySelector('view-file').path;
            targetNode.removeAttribute('in-drop-zone');
            event = event.detail.evt;
            app.clearDelayedLs();
            flag = true;
        }

        if (event.dataTransfer.types.includes('text/plain')) {
            app.dragNdropMoveFiles(path, flag);
        } else {
            app.$.dropZoneToast.close();
            const upload = new DndUpload(path);
            upload.isCurrentView = iC;
            upload.start(event);
        }
    };
    app.dragenter = function(e)
    {
        let event = e || event;

        let name;
        if (event.detail === 0) {
            event.preventDefault && event.preventDefault();
            dndCounter++;
            name = app.getfileName(app.$.homedir.querySelector('view-file').path);
        } else {
            name = event.detail.file.fileMetaData ?
                event.detail.file.fileMetaData.fileName: event.detail.file.name;
            event = event.detail.evt;
        }

        if (!event.dataTransfer.types.includes('text/plain')) {
            app.$.dropZoneContent.querySelector('drag-enter-toast').directoryName = name;
            if (!app.$.dropZoneToast.opened){
                app.$.dropZoneToast.open();
            }
        }
    };
    app.dragleave = function()
    {
        dndCounter--;
    };
    app.dragend = function()
    {
        dndCounter = 0;

        //Remove all the in-drop-zone and is-dragging attributes of list-row(s)
        const vf = app.$.homedir.querySelector('view-file');
        const allListRows = [...vf.$.feList.querySelectorAll('list-row')];
        const len = allListRows.length;
        for (let i=0; i<len; i++) {
            if (allListRows[i].hasAttribute('in-drop-zone')) {
                allListRows[i].removeAttribute('in-drop-zone');
            }
            if (allListRows[i].hasAttribute('is-dragging')) {
                allListRows[i].removeAttribute('is-dragging');
            }
        }
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

    app.getAuthValue = function ()
    {
        if (sessionStorage.upauth !== undefined) {
            return sessionStorage.authType + ' ' + sessionStorage.upauth;
        } else {
            return "Basic " + window.btoa('anonymous:nopassword');
        }
    };

    app.dragNdropMoveFiles = function (destinationPath, dropFlag)
    {
        const currentViewPath = app.$.homedir.querySelector('view-file').path;
        const sourcePath = ((app.mvObj.source).length > 1  && (app.mvObj.source).endsWith("/")) ?
            (app.mvObj.source).slice(0, -1) : app.mvObj.source;

        // prevent moving file if destination and source path are the same
        if (sourcePath === destinationPath) {
            return;
        }
        let errMsg;
        app.mvObj.files.forEach((file) => {
            let namespace = document.createElement('dcache-namespace');
            namespace.auth = app.getAuthValue();

            namespace.mv({
                url: "/api/v1/namespace",
                path: `${sourcePath}/${file.fileName}`,
                destination: `${destinationPath}/${file.fileName}`
            });

            namespace.promise.then( () => {
                if (currentViewPath === sourcePath) {
                    window.dispatchEvent(new CustomEvent('dv-namespace-remove-items', {
                        detail: {files: [file]},bubbles: true, composed: true}));
                } else {
                    if (!dropFlag) {
                        const item = {
                            "fileName" : file.fileName,
                            "fileMimeType" : file.fileMimeType,
                            "currentQos" : file.currentQos,
                            "size" : file.fileType === "DIR"? "--": file.size,
                            "fileType" : file.fileType,
                            "mtime" : file.mtime,
                            "creationTime" : file.creationTime
                        };
                        window.dispatchEvent(new CustomEvent('dv-namespace-add-items', {
                            detail: {files: [item]},bubbles: true, composed: true}));
                    }
                }
            }).catch((err)=>{
                errMsg = err.message;
            });
        });

        if (errMsg === undefined) {
            const div = document.createElement('div');
            const boldSource = document.createElement('code');
            const boldDestination = document.createElement('code');
            boldSource.innerHTML = sourcePath;
            boldDestination.innerHTML = destinationPath;

            boldSource.setAttribute("style", "color:yellow; font-weight: bold;");
            boldDestination.setAttribute("style", "color:yellow; font-weight: bold;");

            div.appendChild(boldSource);
            div.appendChild(document.createTextNode(" to destination path: "));
            div.appendChild(boldDestination);
            div.appendChild(document.createTextNode(". "));
            div.setAttribute("style", "display:inline;");

            app.$.toast.text = app.mvObj.files.length + " files have been moved from source path: ";
            app.$.toast.insertBefore(div, app.$.toast.querySelector('span'));

            app.$.toast.addEventListener('iron-overlay-closed', ()=>{
                if (app.$.toast.contains(div)) {
                    app.$.toast.removeChild(div);
                }
            });
        } else {
            app.$.toast.text = errMsg;
        }
        app.$.toast.show();
        app.mvObj = {};
    };

    function updateFeListAndMetaDataDrawer(status, itemIndex)
    {
        if (app.$.metadata.selected === 'drawer'){
            app.$.metadata.querySelector('file-metadata').currentQos = status;
        }
        const vf = app.$.homedir.querySelector('view-file');
        vf.shadowRoot.querySelector('#feList')
            .set(`items.${itemIndex}.currentQos`, status);
        vf.shadowRoot.querySelector('#feList').notifyPath(`items.${itemIndex}.currentQos`);
    }

    function periodicalCurrentQosRequest(options)
    {
        const namespace = document.createElement('dcache-namespace');
        namespace.auth = sessionStorage.upauth;
        namespace.promise.then( (req) => {
            if (req.response.targetQos !== undefined) {
                updateFeListAndMetaDataDrawer('&#8594; '+ options.targetQos, options.itemIndex);

                //ask every two seconds
                setTimeout(periodicalCurrentQosRequest(options), 2000);
            } else if (req.response.currentQos === options.targetQos) {
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
            url: `${window.CONFIG["dcache-view.endpoints.webapi"]}namespace`,
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
        const vf = app.$.homedir.querySelector('view-file');
        vf.$.feList.selectionEnabled = false;
        setTimeout(() => {
            vf.$.feList.selectionEnabled = true;
        }, 10)
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
    window.addEventListener('admin-component-url-path', (evt)=>{
        page(evt.detail.path);
    });
    window.addEventListener('dv-namespace-dragstart', function (e) {
        app.mvObj = {};
        app.notifyPath('mvObj');

        const vf = app.$.homedir.querySelector('view-file');
        app.mvObj.files= vf._xSelectedItems;
        app.mvObj.source = vf.path;

        const allListRows = [...vf.$.feList.querySelectorAll('list-row')];
        const len = vf._xSelectedItems.length;

        for (let i=0; i<len; i++) {
            const listRow = allListRows.find(function(lr) {
                return (lr.fileMetaData.fileName === vf._xSelectedItems[i].fileName);
            });
            listRow.setAttribute('is-dragging', true);
        }

        app.notifyPath('mvObj');

        e.detail.evt.dataTransfer.setData('text/plain', 'draggable');
    });
    window.addEventListener('dv-namespace-dragenter', (e)=>{
        app.dragenter(e);
        app.delayTact(e.detail.file);
    });
    window.addEventListener('dv-namespace-dragleave', (e)=>{
        app.clearDelayedLs();
    });
    window.addEventListener('dv-namespace-drop', (e)=>{
        app.drop(e);
    });
    window.addEventListener('dv-namespace-open-file', function (e) {
        if (e.detail.file.fileMetaData.fileType === "DIR") {
            app.ls(e.detail.file.filePath);
            Polymer.dom.flush();
        } else {
            //Download the file
            const webdav = window.CONFIG["dcache-view.endpoints.webdav"];
            const fileURL = webdav === "" ?
                `${window.location.protocol}//${window.location.hostname}:2880${e.detail.file.filePath}` :
                webdav.endsWith("/") ? `${webdav.substring(0, webdav.length - 1)}${e.detail.file.filePath}` :
                `${webdav}${e.detail.file.filePath}`;

            fetch(fileURL, {
                mode: "cors",
                headers: {
                    "Authorization": `${app.getAuthValue()}`,
                    "Suppress-WWW-Authenticate": "Suppress",
                    "Content-Type" : `${e.detail.file.fileMetaData.fileMimeType}`
                }
            })
                .then((file) => {
                    return file.blob();
                })
                .then((blob) => {
                    const windowUrl = window.URL || window.webkitURL;
                    const url = windowUrl.createObjectURL(blob);
                    const link = app.$.download;
                    link.href = url;
                    link.download = e.detail.file.fileMetaData.fileName;
                    link.click();
                    windowUrl.revokeObjectURL(url);//Maybe it might be wise to delay this
                })
                .catch((err)=>{
                    app.$.toast.text = `${err.message} `;
                    app.$.toast.show()
                });
        }
    });
    window.addEventListener('dv-namespace-open-subcontextmenu', e => app.subContextMenu(e));
    window.addEventListener('dv-namespace-close-subcontextmenu', () => {
        app.$.centralSubContextMenu.close();
    });

    window.addEventListener('dv-namespace-open-centralcontextmenu', () => {
        app.$.centralContextMenu.open();
    });
    window.addEventListener('dv-namespace-close-centralcontextmenu', () => {
        app.$.centralContextMenu.close();
    });
    window.addEventListener('dv-namespace-open-filemetadata-panel', e => {
        if (app.$.metadata.selected === "main") {
            app.removeAllChildren(app.$.metadataDrawer);
            const file = e.detail.file;
            const fm = file.fileMetaData ?
                new FileMetadataDashboard(Object.assign({},file.fileMetaData), file.filePath, 0) :
                new FileMetadataDashboard(Object.assign({},
                    app.$.homedir.querySelector('view-file').currentDirMetaData), file.filePath, 1);
            app.$.metadataDrawer.appendChild(fm);
            app.$.metadata.openDrawer();
        } else {
            app.$.metadata.closeDrawer();
        }
    });
    window.addEventListener('dv-namespace-close-filemetadata-panel', e => {
        app.$.metadata.closeDrawer();
    });
    window.addEventListener('dv-namespace-open-central-dialogbox',(e)=>{
        app.removeAllChildren(app.$.centralDialogBox);
        app.$.centralDialogBox.appendChild(e.detail.node);
        app.$.centralDialogBox.open()
    });
    window.addEventListener('dv-namespace-close-central-dialogbox',()=>{
        app.$.centralDialogBox.close();
    });
    window.addEventListener('dv-authentication-successful', (e) => {
        window.CONFIG.isSomebody = true;
        window.CONFIG.isAdmin = e.detail.roles.includes('admin');
        app.notifyPath('config.isSomebody');
        app.notifyPath('config.isAdmin');
        app.getQosInformation();
    });
    window.addEventListener('dv-namespace-open-upload-toast', (e) => {
        app.$.uploadToast.close();
        app.removeAllChildren(app.$.uploadToast.querySelector("#uploadList"));
        app.$.uploadToast.open();
    });
    window.addEventListener('dv-namespace-close-upload-toast', (e) => {
        app.$.uploadToast.close();
    });
    window.addEventListener('dv-namespace-upload-toast-append-child', (e) => {
        const child = e.detail.child;
        app.$.uploadToast.querySelector("#uploadList").appendChild(child);
    });
    window.addEventListener('dv-namespace-show-message-toast', (e) => {
        app.$.toast.text = `${e.detail.message} `;
        app.$.toast.show()
    });
    window.addEventListener('dv-namespace-ls-path', (e) => {
        if (app.route !== "home") page("/");
        app.ls(e.detail.path);
    });
})(document);
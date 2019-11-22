importScripts('../../lazy-loads/dcache-eventsource.js');
self.addEventListener('message', function(e) {
    if (!e.data["channel-url"] && e.data["channel-url"] === "") {
        throw new ReferenceError("Please specify either channel-id or channel-url");
    }
    const init = {};
    if (e.data.auth && e.data.auth !== "") init["auth"] = e.data.auth;

    const source = new dCacheEventSource(e.data["channel-url"], init);

    source.addEventListener(e.data.type, (event) => {
        console.debug(JSON.parse(event.detail.data).event);
        self.postMessage(JSON.parse(event.detail.data).event);
    });
    source.addEventListener("SYSTEM", (event) => {
        console.debug(JSON.parse(event.detail.data));
        self.postMessage(JSON.parse(event.detail.data));
    });
    source.addEventListener('error', (event)=> {
        console.debug("Error with SSE connected");
        console.debug('%O', event);
        source.close();
        throw new Error(event.detail.message);
    })
});
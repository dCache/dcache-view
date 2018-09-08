self.addEventListener('message', function(e) {

    const headers = new Headers({
        "Suppress-WWW-Authenticate": "Suppress",
        "Content-Type": e.data.mime
    });
    if (!e.data.usesCert) {
        headers.append("Authorization", `${e.data.upauth}`);
    }
    const request = new Request(e.data.url, {
        headers: headers
    });

    fetch(request).then((file) => {
        switch (e.data.return) {
            case 'json':
                return file.json();
            case 'blob':
                return file.blob();
            default:
                return file.arrayBuffer();
        }
    }).then((data)=>{
        if (e.data.return === 'json') {
            self.postMessage(data);
        } else {
            self.postMessage(data, [data])
        }
    }).catch((err)=>{throw new Error(err)})
}, false);
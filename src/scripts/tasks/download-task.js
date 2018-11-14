self.addEventListener('message', function(e) {

    const headers = new Headers({
        "Suppress-WWW-Authenticate": "Suppress",
        "Content-Type": e.data.mime
    });
    if (e.data.upauth && e.data.upauth !== "") {
        headers.append("Authorization", `${e.data.upauth}`);
    }
    const request = new Request(e.data.url, {
        headers: headers,
        mode: "cors",
        redirect: "follow"
    });

    fetch(request).then(file => {
        switch (e.data.return) {
            case 'json':
                return file.json();
            default:
                return file.blob();
        }
    }).then(data => {
        self.postMessage(data);
    }).catch(err => {setTimeout(function(){throw error;});})
}, false);
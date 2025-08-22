export class BaseClient {
    constructor(endpoint = "") {
        const token = localStorage.getItem('token')
        this.baseUrl = "http://localhost:3880/api/v1";
        this.url = `${this.baseUrl}/${endpoint}`;
        //this.headers = { ContentType: 'application/json', Authorization: `Basic ${token}`};
        this.headers = { ContentType: 'application/json', Authorization: "Basic YWRtaW46ZGlja2VyZWxjaA=="};

    }

     async get( params = {}) {
        const url = new URL(`${this.url}/${params}`);
        console.log("get url", url)

        const response = await fetch(`${this.url}/${params}`, {
            method: 'GET',
            headers: this.headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async post(data = {}) {
        const response = await fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async put(data = {}) {
        const response = await fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async delete() {
        const response = await fetch(this.url, {
            method: 'DELETE',
            headers: this.headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async getById(id, params = {}) {
        const url = new URL(`${this.url}/${id}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url, {
            method: 'GET',
            headers: this.headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }
}
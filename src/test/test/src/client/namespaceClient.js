/*  (async () => {
            try {
                const res = await fetch(
                    `http://localhost:3880/api/v1/namespace/${id || ""}?children=true&offset=0&limit=10000&qos=true`,
                    {
                        method: "GET",
                        headers: {
                            ContentType: "application/json",
                            Authorization: "Basic YWRtaW46ZGlja2VyZWxjaA==",
                        },
                    }
                );

                const json = await res.json();
                setData(json.children || []);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        })();*/

import {BaseClient} from "./baseClient";

// class NamespaceClient extends BaseClient {
//     constructor() {
//         super("namespace");
//     }
//     async getNamespace(params = {}) {
//
//         return this.get("namespace", params);
//     }
//
//     async getNamespace(id, params = {}) {
//         const query = new URLSearchParams(params).toString();
//         return this.get(`${id}?${query}`);
//     }
//
//     async getRootNamespace(params = {}) {
//         const query = new URLSearchParams(params).toString();
//         return this.get(`?${query}`);
//     }
// }

export const NamespaceClient = new BaseClient("namespace");

import React, { useState, useEffect } from "react";
import { Table } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { FolderOutlined, FileOutlined, DownOutlined } from "@ant-design/icons";
import {NamespaceClient} from "../client/namespaceClient";

export function RootV1() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

/*    useEffect(() => {
        // (async () => {
        //     try {
        //         const res = await fetch(
        //             `http://localhost:3880/api/v1/namespace/${id || ""}?children=true&offset=0&limit=10000&qos=true`,
        //             {
        //                 method: "GET",
        //                 headers: {
        //                     ContentType: "application/json",
        //                     Authorization: "Basic YWRtaW46ZGlja2VyZWxjaA==",
        //                 },
        //             }
        //         );
        //
        //         const json = await res.json();
        //         setData(json.children || []);
        //     } catch (error) {
        //         console.error("Fetch error:", error);
        //     } finally {
        //         setLoading(false);
        //     }
        // })();

        console.log("Initial", `http://localhost:3880/api/v1/namespace/${id || ""}?children=true&offset=0&limit=10000&qos=true`);
        (async () => {
            const res = await NamespaceClient.get(`${id || ""}?children=true&offset=0&limit=10000&qos=true`)
            console.log("res", res)
        })();
    }, [id]);

 /!*   const columns = [
        {
            title: "Size",
            dataIndex: "size",
            key: "size",
        },
    ];*!/*/

    useEffect(() => {
        (async () => {
            try {
                const res = await NamespaceClient.get(`${id || ""}?children=true&offset=0&limit=10000&qos=true`);
                console.log("res", res);
                setData(res.children || []); // <- update data
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false); // <- stop loading spinner
            }
        })();
    }, [id]);

    const columns = [
        {
            title: "Size",
            dataIndex: "size",
            key: "size",
        },
        {
            title: "Creation Time",
            dataIndex: "creationTime",
            key: "creationTime",
            render: (value) => new Date(value).toLocaleString(), // optional formatting
        },
        {
            title: "Current QoS",
            dataIndex: "currentQos",
            key: "currentQos",
        },
    ];

    return (
        <Table
            data={data}
            columns={columns}
            loading={loading}
        />
    );
}

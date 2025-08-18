import React, { useState, useEffect } from "react";
import { Dropdown, Menu, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { FolderOutlined, FileOutlined, DownOutlined } from "@ant-design/icons";
import { Table } from "../components"

export function NamespaceTable() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
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
        })();
    }, [id]);


    return (
        <Table
            data={data}
            columns={[]}
            loading={loading}
        />
    );
}

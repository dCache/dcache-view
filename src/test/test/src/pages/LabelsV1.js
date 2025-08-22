import React, { useState } from "react";
import { Table } from "../components";
import { Input, Button, Space } from "antd";

export function LabelsV1() {
    const [folderName, setFolderName] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFolder = async (name) => {
        if (!name) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3880/api/v1/labels/${name}`, {
                method: "GET",
                headers: {
                    ContentType: "application/json",
                    Authorization: "Basic YWRtaW46ZGlja2VyZWxjaA==",
                },
            });
            const json = await res.json();
            setData(json?.children || []); // adjust depending on API response
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

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
            render: (value) => new Date(value).toLocaleString(),
        },
        {
            title: "Current QoS",
            dataIndex: "currentQos",
            key: "currentQos",
        },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Enter folder name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    style={{ width: 300 }}
                />
                <Button type="primary" onClick={() => fetchFolder(folderName)}>
                    Fetch
                </Button>
            </Space>

            <Table data={data} columns={columns} loading={loading} />
        </div>
    );
}

import React, { useState, useEffect } from "react";
import { Table, Dropdown, Menu, Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { FolderOutlined, FileOutlined, DownOutlined } from "@ant-design/icons";
import axios from "axios";

export function Labels() {
    const navigate = useNavigate();

    const [folderName, setFolderName] = useState(""); // input box value
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const toggleExpand = (key) => {
        setExpandedRowKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    const fetchFolderData = async () => {
        if (!folderName.trim()) return;
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:3880/api/v1/labels/${folderName}?children=true&offset=0&limit=10000&qos=true`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Basic YWRtaW46ZGlja2VyZWxjaA==",
                    },
                }
            );
            setData(res.data.children || []);
        } catch (err) {
            console.error(err);
            message.error("Failed to fetch folder data");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "fileName",
            key: "fileName",
            render: (_, record) => {
                const isFolder = record.children && record.children.length > 0;
                const isExpanded = expandedRowKeys.includes(record.fileName);
                return (
                    <div
                        style={{ display: "flex", alignItems: "center", cursor: isFolder ? "pointer" : "default" }}
                        onClick={() => isFolder && toggleExpand(record.fileName)}
                    >
                        {isFolder ? (
                            <FolderOutlined
                                style={{
                                    marginRight: 8,
                                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                                    transition: "transform 0.2s",
                                }}
                            />
                        ) : (
                            <FileOutlined style={{ marginRight: 8 }} />
                        )}
                        {record.fileName}
                    </div>
                );
            },
        },
        {
            key: "action",
            fixed: "right",
            render: (_, record) => {
                const isFolder = record.children && record.children.length > 0;

                const menu = (
                    <Menu
                        onClick={({ key }) => {
                            if (key === "open" && isFolder) navigate(`/namespace/${record.fileName}`);
                            if (key === "rename") console.log("Rename:", record.fileName);
                            if (key === "move") console.log("Move:", record.fileName);
                        }}
                        items={[
                            { label: "Open", key: "open" },
                            { label: "Move", key: "move" },
                            { label: "Rename", key: "rename" },
                        ]}
                    />
                );

                return (
                    <Dropdown overlay={menu}>
                        <Button size="small">
                            Actions <DownOutlined />
                        </Button>
                    </Dropdown>
                );
            },
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
                <Input
                    placeholder="Enter folder name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onPressEnter={fetchFolderData}
                    style={{ width: 300 }}
                />
                <Button type="primary" onClick={fetchFolderData}>
                    Show Files
                </Button>
            </div>

            <Table
                dataSource={data}
                columns={columns}
                rowKey="fileName"
                loading={loading}
                pagination={false}
                expandedRowKeys={expandedRowKeys}
                onExpand={(expanded, record) => toggleExpand(record.fileName)}
            />
        </div>
    );
}
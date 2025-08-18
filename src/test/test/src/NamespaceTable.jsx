/*
/!*
import React, {useEffect} from "react";
import {Table as AntTable} from "antd";

const columns = [
    {
        title: 'Name',
        dataIndex: 'fileName',
        key: 'fileName',
    },
    // {
    //     title: 'Type',
    //     dataIndex: 'type',
    //     key: 'type',
    // },
    // {
    //     title: 'Locality',
    //     dataIndex: 'locality',
    //     key: 'locality',
    // },
    // {
    //     title: 'Qos',N
    //     dataIndex: 'qos',
    //     key: 'qos',
    // },
]

export function Table({ path = "/"}) {
    const [data, setData] = React.useState([]);
    useEffect(() => {
       (async () => {
            const j = await fetch(`http://localhost:3880/api/v1/namespace/?children=true&offset=0&limit=10000&qos=true`, {
                method: 'GET',
                headers: {
                    ContentType: 'application/json',
                   // Authentication: 'Basic YWRtaW46ZGlja2VyZWxjaA==',
                    Authorization: 'Basic YWRtaW46ZGlja2VyZWxjaA=='
                }
            });
            setData(j.children);
        })()

    }, []);

    return <AntTable dataSource={data} columns={columns}/>
}*!/
/!*
import React, { useEffect, useState } from "react";
import { Table as AntTable } from "antd";
import { FolderOutlined, FileOutlined } from '@ant-design/icons';

const columns = [
    {
        title: 'Name',
        dataIndex: 'fileName',
        key: 'fileName',
        render: (_, record) =>
            record.children && record.children.length > 0 ? (
                <>
                    <FolderOutlined style={{ marginRight: 8 }} />
                    {record.fileName}
                </>
            ) : (
                <>
                    <FileOutlined style={{ marginRight: 8 }} />
                    {record.fileName}
                </>
            ),
    },
];

export function Table({ path = "/" }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`http://localhost:3880/api/v1/namespace/?children=true&offset=0&limit=10000&qos=true`, {
                    method: 'GET',
                    headers: {
                        ContentType: 'application/json',
                        Authorization: 'Basic YWRtaW46ZGlja2VyZWxjaA==',
                    },
                });

                const json = await res.json();
                setData(json.children || []);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <AntTable
            dataSource={data}
            columns={columns}
            rowKey="fileName"
            loading={loading}
            pagination={false}
        />
    );
}*!/


import React, { useEffect, useState } from "react";
import { Table } from "antd";
//import { FolderOutlined, FileOutlined } from "@ant-design/icons";
import {useNavigate, useParams} from "react-router";
/!*
const columns = (toggleExpand, expandedRowKeys) => [
    {
        title: "Name",
        dataIndex: "fileName",
        key: "fileName",
        render: (_, record) => {
            const isFolder = record.children && record.children.length > 0;
            const isExpanded = expandedRowKeys.includes(record.fileName);

            return (
                <span
                    onClick={() => {
                        if (isFolder) {
                            toggleExpand(record.fileName);
                        }
                    }}
                    style={{
                        cursor: isFolder ? "pointer" : "default",
                        userSelect: "none",
                    }}
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
        </span>
            );
        },
    },
];*!/

import { Dropdown, Menu, Button } from "antd";
import { DownOutlined, FolderOutlined, FileOutlined } from "@ant-design/icons";

const columns = (toggleExpand, expandedRowKeys) => [
    {
        title: "Name",
        dataIndex: "fileName",
        key: "fileName",
        render: (_, record) => {
            const isFolder = record.children && record.children.length > 0;
            const isExpanded = expandedRowKeys.includes(record.fileName);

            // Menu for dropdown actions
            const menu = (
                <Menu
                    onClick={({ key }) => {
                        switch (key) {
                            case "open":
                                window.location.href = `/${record.fileName}`;
                                break;
/!*                            case "move":
                                console.log("Move action for:", record.fileName);
                                break;*!/
                            case "move":
                                setFileToMove(record);
                                setMoveModalVisible(true);
                                break;
                            case "rename":
                                console.log("Rename action for:", record.fileName);
                                break;
                            default:
                                break;
                        }
                    }}
                    items={[
                        { label: "Open", key: "open" },
                        { label: "Move", key: "move" },
                        { label: "Rename", key: "rename" },
                    ]}
                />
            );

            return (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        userSelect: "none",
                    }}
                    onClick={(e) => {
                        if (isFolder) {
                            toggleExpand(record.fileName);
                        }
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", cursor: isFolder ? "pointer" : "default" }}>
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

                    {/!* Dropdown button *!/}
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Button
                            size="small"
                            onClick={(e) => e.stopPropagation()} // Prevent toggleExpand when clicking dropdown
                            icon={<DownOutlined />}
                        />
                    </Dropdown>
                </div>
            );
        },
    },
];

export function NamespaceTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const {id} = useParams()
    // const navigate = useNavigate()
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
    }, []);

    const toggleExpand = (key) => {
        setExpandedRowKeys((prev) =>
            prev.includes(key)
                ? prev.filter((k) => k !== key)
                : [...prev, key]
        );
    };

    return (
        <Table
            dataSource={data}
            columns={columns(toggleExpand, expandedRowKeys)}
            rowKey="fileName"
           /!* onRow={({fileName}) => ({
               onClick: () => window.location.href = `/${fileName}`
            })}*!/
            loading={loading}
            pagination={false}
            expandedRowKeys={expandedRowKeys}
            onExpand={(expanded, record) => {
                toggleExpand(record.fileName);
            }}
        />
    );
}*/

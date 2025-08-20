"use client";

import { Card, Table, Input } from "antd";
import { SwapOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function AffectedProject() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const data = [
    { name: "iOS-Retail-App", suffix: "4.6.0-beta", active: true },
    { name: "iOS-Retail-App", suffix: "4.5.1", active: false },
    { name: "ECommerce-Platform", suffix: "prod", active: true },
    { name: "ECommerce-Platform", suffix: "staging", active: true },
    { name: "Payment-Service", suffix: "PCI-v3", active: false },
    { name: "Mobile-Banking", suffix: "v2.1.0", active: true },
    { name: "CRM-System", suffix: "v1.0.0", active: false },
    { name: "Inventory-App", suffix: "v3.2.5", active: true },
    { name: "POS-Terminal", suffix: "v5.0.1", active: true },
    { name: "HR-Portal", suffix: "v1.2.3", active: false },
    { name: "Analytics-Service", suffix: "v4.0.0", active: true },
    { name: "ECommerce-Platform", suffix: "test", active: false },
    { name: "Payment-Service", suffix: "PCI-v2", active: true },
    { name: "Mobile-Banking", suffix: "v2.0.0", active: false },
    { name: "CRM-System", suffix: "v1.1.0", active: true },
    { name: "Inventory-App", suffix: "v3.1.0", active: false },
    { name: "POS-Terminal", suffix: "v5.0.0", active: true },
    { name: "HR-Portal", suffix: "v1.2.0", active: true },
    { name: "Analytics-Service", suffix: "v3.9.9", active: false },
    { name: "Payment-Service", suffix: "PCI-v1", active: true },
  ];
  const filtered = data.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const columns = [
    {
      title: (
        <div
          style={{
            color: "#222",
            textAlign: "center",
            width: "100%",
          }}
        >
          Project Name
        </div>
      ),
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span style={{ color: "#6c3fc7", fontWeight: 500 }}>{text}</span>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortIcon: ({ sortOrder }) => (
        <SwapOutlined
          style={{
            transform: "rotate(90deg)",
            color: "#222",
            fontSize: 16,
          }}
        />
      ),
    },
    {
      title: (
        <div
          style={{
            color: "#222",
            textAlign: "center",
            width: "100%",
          }}
        >
          Suffix
        </div>
      ),
      dataIndex: "suffix",
      key: "suffix",
      sorter: (a, b) => a.suffix.localeCompare(b.suffix),
      sortIcon: ({ sortOrder }) => (
        <SwapOutlined
          style={{
            transform: "rotate(90deg)",
            color: "#222",
            fontSize: 16,
          }}
        />
      ),
    },
    {
      title: (
        <div
          style={{
            color: "#222",
            textAlign: "center",
            width: "100%",
          }}
        >
          Active
        </div>
      ),
      dataIndex: "active",
      key: "active",
      align: "center" as const,
      render: (v) => (
        <input
          type="checkbox"
          checked={!!v}
          readOnly
          style={{
            accentColor: "#a259e6",
            background: "#fff",
            borderRadius: 4,
            width: 18,
            height: 18,
            border: "1px solid #d9d9d9",
          }}
        />
      ),
      sorter: (a, b) => Number(b.active) - Number(a.active),
      sortIcon: ({ sortOrder }) => (
        <SwapOutlined
          style={{
            transform: "rotate(90deg)",
            color: "#222",
            fontSize: 16,
          }}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        padding: 0,
      }}
    >
      <Card
        bordered={false}
        style={{
          background: "transparent",
          boxShadow: "none",
          borderRadius: 12,
          margin: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 20 }}>
            Affected Project{" "}
            <span
              style={{
                color: "#a259e6",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              ({filtered.length})
            </span>
          </div>
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ width: 220 }}
            prefix={
              <SearchOutlined style={{ color: "#dbdadb", fontSize: 16 }} />
            }
          />
        </div>
        <Table
          columns={columns}
          dataSource={paged}
          pagination={false}
          rowKey={(r, i) => i}
          bordered
          size="middle"
          style={{
            borderRadius: 8,
            overflow: "hidden",
            background: "#fff",
          }}
          tableLayout="fixed"
          scroll={{ x: true }}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    ...props.style,
                    background: "#a259e6",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                />
              ),
            },
            body: {
              cell: (props) => (
                <td
                  {...props}
                  style={{
                    ...props.style,
                    background: "#fff",
                    fontSize: 16,
                    color: "#6c3fc7",
                  }}
                />
              ),
            },
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 18,
          }}
        >
          <div style={{ color: "#888", fontSize: 16 }}>
            Total <b>{filtered.length}</b> projects
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{
                border: "none",
                background: "#f3f0fa",
                color: "#a259e6",
                borderRadius: 6,
                width: 32,
                height: 32,
                fontSize: 20,
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              -
            </button>
            <span style={{ fontWeight: 600, fontSize: 16 }}>{page}</span>
            <button
              disabled={page * pageSize >= filtered.length}
              onClick={() => setPage(page + 1)}
              style={{
                border: "none",
                background: "#f3f0fa",
                color: "#a259e6",
                borderRadius: 6,
                width: 32,
                height: 32,
                fontSize: 20,
                cursor:
                  page * pageSize >= filtered.length
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

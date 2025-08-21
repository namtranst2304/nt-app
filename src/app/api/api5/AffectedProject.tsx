"use client";

import { Card, Table, Input, Typography, Button, Space, Flex, Checkbox } from "antd";
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
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text) => (
        <Typography.Text style={{ color: '#6c3fc7', fontWeight: 500 }}>{text}</Typography.Text>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortIcon: ({ sortOrder }) => (
        <SwapOutlined style={{ transform: 'rotate(90deg)', color: '#222', fontSize: 16 }} />
      ),
    },
    {
      title: 'Suffix',
      dataIndex: 'suffix',
      key: 'suffix',
      width: 120,
      render: (text) => (
        <Typography.Text style={{ color: '#222' }}>{text}</Typography.Text>
      ),
      sorter: (a, b) => a.suffix.localeCompare(b.suffix),
      sortIcon: ({ sortOrder }) => (
        <SwapOutlined style={{ transform: 'rotate(90deg)', color: '#222', fontSize: 16 }} />
      ),
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      align: 'center' as const,
      render: (v) => (
        <input
          type="checkbox"
          checked={!!v}
          readOnly
          style={{ accentColor: '#a259e6', background: '#fff', borderRadius: 4, width: 18, height: 18, border: '1px solid #d9d9d9' }}
        />
      ),
      sorter: (a, b) => Number(b.active) - Number(a.active),
      sortIcon: ({ sortOrder }) => (
        <SwapOutlined style={{ transform: 'rotate(90deg)', color: '#222', fontSize: 16 }} />
      ),
    },
  ];

  return (
    <Card bordered={false} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 18 }}>
      <Table
        title={() => (
          <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
            <Typography.Title level={5} style={{ fontWeight: 600, fontSize: 20, margin: 0 }}>
              Affected Project <Typography.Text style={{ color: '#a259e6', fontWeight: 700, fontSize: 16 }}>({filtered.length})</Typography.Text>
            </Typography.Title>
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{ width: 220 }}
              prefix={<SearchOutlined style={{ color: '#dbdadb', fontSize: 16 }} />}
            />
          </Flex>
        )}
        columns={columns.map(col => ({
          ...col,
          render: col.dataIndex === 'name'
            ? (text) => <Typography.Text style={{ color: '#6c3fc7', fontWeight: 500 }}>{text}</Typography.Text>
            : col.dataIndex === 'suffix'
              ? (text) => <Typography.Text style={{ color: '#222' }}>{text}</Typography.Text>
              : col.dataIndex === 'active' 
                ? (v) => <Checkbox checked={!!v} disabled style={{ accentColor: '#a259e6' }} />
                : col.render,
        }))}
        dataSource={paged}
        pagination={false}
        rowKey={(r, i) => i}
        bordered
        size="middle"
        tableLayout="fixed"
        scroll={{ x: true }}
        components={{
          header: {
            cell: (props) => (
              <th
                {...props}
                style={{
                  ...props.style,
                  background: '#a259e6',
                  color: '#fff',
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
                  background: '#fff',
                  fontSize: 16,
                  color: '#6c3fc7',
                }}
              />
            ),
          },
        }}
        footer={() => (
          <Flex justify="space-between" align="center" style={{ marginTop: 18 }}>
            <Typography.Text style={{ color: '#888', fontSize: 16 }}>
              Total <Typography.Text strong>{filtered.length}</Typography.Text> projects
            </Typography.Text>
            <Space size={8}>
              <Button
                size="small"
                style={{ background: '#f3f0fa', color: '#a259e6', border: 'none', borderRadius: 6, width: 32, height: 32, fontSize: 20 }}
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                -
              </Button>
              <Typography.Text style={{ fontWeight: 600, fontSize: 16 }}>{page}</Typography.Text>
              <Button
                size="small"
                style={{ background: '#f3f0fa', color: '#a259e6', border: 'none', borderRadius: 6, width: 32, height: 32, fontSize: 20 }}
                disabled={page * pageSize >= filtered.length}
                onClick={() => setPage(page + 1)}
              >
                +
              </Button>
            </Space>
          </Flex>
        )}
      />
    </Card>
  );
}

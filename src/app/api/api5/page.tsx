"use client";

import { Card, Tabs, Spin, Alert, Row, Col, Space, Typography, Flex } from "antd";
import { BugOutlined, SafetyOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { cveApi } from "@/lib/api/cve";
import Overview from "./Overview";
import AffectedProject from "./AffectedProject";

export default function CVEPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [cveData, setCveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCVEData = async () => {
      try {
        setLoading(true);
        const response = await cveApi.getMockData();
        if (response.success) {
          setCveData(response.data);
        } else {
          setError("Failed to fetch CVE data");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
        console.error("Error fetching CVE data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCVEData();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return '#ff4d4f';
      case 'high': return '#fa541c';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const tabItems = [
    {
      key: "overview",
      label: "Overview",
      children: <Overview />,
    },
    {
      key: "affected",
      label: "Affected Project",
      children: <AffectedProject />,
    },
  ];

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ padding: 50 }}>
        <Space direction="vertical" align="center">
          <Spin size="large" />
          <Typography.Text>Loading CVE information...</Typography.Text>
        </Space>
      </Flex>
    );
  }

  if (error) {
    return (
      <Card style={{ maxWidth: 1500, margin: "40px auto", padding: 24 }}>
        <Alert
          message="Error Loading CVE Data"
          description={error}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 1500, margin: "40px auto", padding: 24, background: '#e8e6e6', borderRadius: 16 }}>
      {cveData && (
        <Card
          bordered={false}
          style={{ marginBottom: 24, borderRadius: 12, background: '#fff' }}
        >
          <Row align="middle" justify="space-between" style={{ padding: '18px 24px 0 24px' }}>
            <Col>
              <Space align="center" size={16}>
                <SafetyOutlined style={{ fontSize: 36, color: '#1890ff' }} />
                <Space direction="vertical" size={0}>
                  <Typography.Title level={5} style={{ fontWeight: 700, fontSize: 20, color: '#222', margin: 0 }}>
                    {cveData.vuln_id} ({cveData.source?.toUpperCase()})
                  </Typography.Title>
                  <Typography.Text style={{ color: '#8c8c8c', fontSize: 15 }}>
                    National Vulnerability Database
                  </Typography.Text>
                </Space>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" align="end" size={4}>
                <Typography.Text style={{ color: '#8c8c8c', fontSize: 14 }}>Severity</Typography.Text>
                <Flex
                  align="center"
                  style={{ 
                    background: getSeverityColor(cveData.severity), 
                    border: `2px solid ${getSeverityColor(cveData.severity)}`, 
                    borderRadius: 6,
                    height: 32,
                    marginTop: 2
                  }}
                >
                  <BugOutlined style={{ fontSize: 18, color: '#fff', background: getSeverityColor(cveData.severity), margin: '0 6px', borderRadius: 4 }} />
                  <Typography.Text
                    style={{ 
                      color: getSeverityColor(cveData.severity), 
                      background: '#fff', 
                      fontWeight: 700, 
                      fontSize: 16, 
                      padding: '0 4px', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      borderRadius: 4 
                    }}
                  >
                    {cveData.severity && cveData.severity.charAt(0).toUpperCase() + cveData.severity.slice(1)}
                  </Typography.Text>
                </Flex>
              </Space>
            </Col>
          </Row>
          <Typography.Text style={{ color: '#8c8c8c', fontSize: 15, margin: '4px 24px 0 24px', textAlign: 'right', display: 'block' }}>
            Published: {new Date(cveData.published).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </Typography.Text>
        </Card>
      )}
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        tabBarStyle={{ fontWeight: 600, fontSize: 24 }}
      />
    </Card>
  );
}

"use client";

import { Card, Tabs, Spin, Alert, Tag } from "antd";
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
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading CVE information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 1500, margin: "40px auto", padding: 24 }}>
        <Alert
          message="Error Loading CVE Data"
          description={error}
          type="error"
          showIcon
          style={{ margin: '20px 0' }}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1500, margin: "40px auto", padding: 24, background: '#e8e6e6', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {cveData && (
        <Card
          bordered={false}
          style={{
            marginBottom: 24,
            borderRadius: 12,
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            padding: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <SafetyOutlined style={{ fontSize: 36, color: '#1890ff' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#222' }}>
                  {cveData.vuln_id} ({cveData.source?.toUpperCase()})
                </div>
                <div style={{ color: '#8c8c8c', fontSize: 15 }}>
                  National Vulnerability Database
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <div style={{ color: '#8c8c8c', fontSize: 14, marginBottom: 0 }}>Severity</div>
                <div style={{
                  display: 'flex',
                  background: getSeverityColor(cveData.severity),
                  border: `2px solid ${getSeverityColor(cveData.severity)}`,
                  borderRight: `2px solid ${getSeverityColor(cveData.severity)}`,
                  color: getSeverityColor(cveData.severity),
                  fontWeight: 700,
                  fontSize: 15,
                  height: 32,
                  marginTop: 2
                }}>
                  <BugOutlined style={{ fontSize: 18, color: '#fff', background: getSeverityColor(cveData.severity), margin: '0 6px'}} />
                  <span style={{ color: getSeverityColor(cveData.severity), background: '#fff', fontWeight: 700, fontSize: 16, padding: '0 4px', height: '100%', display: 'flex', alignItems: 'center' }}>
                    {cveData.severity && cveData.severity.charAt(0).toUpperCase() + cveData.severity.slice(1)}
                  </span>
                </div>
            </div>
          </div>
          <div style={{ color: '#8c8c8c', fontSize: 15, margin: '4px 24px 0 24px', textAlign: 'right' }}>
            Published: {new Date(cveData.published).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </Card>
      )}
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        tabBarStyle={{ fontWeight: 600, fontSize: 24 }}
      />
    </div>
  );
}

"use client";

import { Card, Progress, Row, Col, Spin, Alert, Typography, List, Divider, Space, Flex } from "antd";
import { useState, useEffect } from "react";
import { cveApi } from "@/lib/api/cve";

// ===== Helper: Get color by score value =====
function getScoreColor(val: number) {
  if (val < 3) return "#52c41a"; // xanh
  if (val < 6) return "#faad14"; // vàng
  if (val < 8) return "#fa541c"; // cam
  return "#ff4d4f"; // đỏ
}

export default function Overview() {
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

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ padding: 50 }}>
        <Space direction="vertical" align="center">
          <Spin size="large" />
          <Typography.Text>Loading CVE data...</Typography.Text>
        </Space>
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: '20px 0' }}
      />
    );
  }

  if (!cveData) {
    return (
      <Alert
        message="No Data"
        description="No CVE data available"
        type="warning"
        showIcon
        style={{ margin: '20px 0' }}
      />
    );
  }

  // Dynamic scores from backend data
  const scores = [
    {
      label: "CVSS Base Score",
      value: cveData.cvss_v3_base_score || 0,
    },
    {
      label: "CVSS Impact Subscore",
      value: cveData.cvss_v3_impact_score || 0,
    },
    {
      label: "CVSS Exploitability Subscore",
      value: cveData.cvss_v3_exploit_score || 0,
    },
    {
      label: "EPSS Score",
      value: cveData.epssscore || 0,
    },
    {
      label: "EPSS Percentile",
      value: cveData.epsspercentile || 0,
    },
  ];

  // Parse references from backend data
  const parseReferences = (refString) => {
    if (!refString) return [];
    
    const refs = refString.split('\n').filter(ref => ref.trim());
    return refs.map((ref, index) => {
      const urlMatch = ref.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (urlMatch) {
        return {
          label: urlMatch[1],
          url: urlMatch[2],
        };
      }
      return {
        label: `Reference ${index + 1}`,
        url: ref.trim(),
      };
    });
  };

  const references = parseReferences(cveData.references);

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Card bordered={false} style={{ background: '#fff', borderRadius: 12, padding: 24 }}>
        <Typography.Title level={4} style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Overview</Typography.Title>
        <Typography.Text style={{ color: '#555', fontSize: 16, marginBottom: 16, display: 'block' }}>{cveData.description}</Typography.Text>
        <Divider style={{ margin: '0 0 24px 0' }} />
        <Row gutter={24}>
          {scores.map((score) => {
            const color = getScoreColor(score.value);
            return (
              <Col flex="1 1 20%" key={score.label} style={{ textAlign: 'center' }}>
                <Typography.Text style={{ color: '#888', fontSize: 15, display: 'block', marginBottom: 4 }}>
                  {score.label}
                </Typography.Text>
                <Typography.Text style={{ fontWeight: 600, fontSize: 20, color, display: 'block', marginBottom: 4 }}>
                  {score.value.toFixed(2)}
                </Typography.Text>
                <Progress
                  percent={Math.min(score.value * 10, 100)}
                  showInfo={false}
                  strokeColor={color}
                  trailColor="#eee"
                  status="active"
                  style={{ maxWidth: 160, margin: '0 auto' }}
                />
              </Col>
            );
          })}
        </Row>
      </Card>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ background: '#fff', borderRadius: 12, height: '90%', padding: 18 }}>
            <Typography.Title level={5} style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Weakness</Typography.Title>
            {cveData.cwes && cveData.cwes.length > 0 ? (
              <List
                dataSource={cveData.cwes}
                renderItem={(cwe) => {
                  const item = cwe as { title: string; info_link: string };
                  return (
                    <List.Item style={{ paddingLeft: 0 }}>
                      <Typography.Link href={item.info_link} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff', fontWeight: 500, marginRight: 8 }}>
                        {item.title.split(':')[0]}
                      </Typography.Link>
                      <Typography.Text>{item.title.split(':')[1]?.trim() || item.title}</Typography.Text>
                    </List.Item>
                  );
                }}
              />
            ) : (
              <Typography.Text style={{ color: '#999', fontStyle: 'italic' }}>No weakness information available</Typography.Text>
            )}
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ background: '#fff', borderRadius: 12, height: '90%', padding: 18 }}>
            <Typography.Title level={5} style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>References</Typography.Title>
            {references && references.length > 0 ? (
              <List
                dataSource={references}
                renderItem={(ref) => {
                  const item = ref as { label: string; url: string };
                  return (
                    <List.Item style={{ paddingLeft: 0 }}>
                      <Typography.Link href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff', fontSize: 15 }}>
                        {item.label}
                      </Typography.Link>
                    </List.Item>
                  );
                }}
              />
            ) : (
              <Typography.Text style={{ color: '#999', fontStyle: 'italic' }}>No references available</Typography.Text>
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

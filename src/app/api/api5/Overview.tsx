"use client";

import { Card, Progress, Row, Col, Spin, Alert } from "antd";
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
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading CVE data...</div>
      </div>
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
    <div>
      <Card bordered={false} style={{ background: "#fff", marginBottom: 24 }}>
        <h2 style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Overview</h2>
        <div style={{ color: "#555", fontSize: 16, marginBottom: 16 }}>{cveData.description}</div>

        <div style={{ width: '100%', borderBottom: '2px solid #eee', marginBottom: 24, }} />

        {/* ===== Scores Row ===== */}
        <Row gutter={24}>
          {scores.map((score) => {
            const color = getScoreColor(score.value);
            return (
              <Col flex="1 1 20%" key={score.label} style={{ textAlign: 'center' }}>
                <div style={{ color: "#888" }}>{score.label}</div>
                <div style={{ fontWeight: 600, color, fontSize: 20 }}>{score.value.toFixed(2)}</div>
                <Progress 
                  percent={Math.min(score.value * 10, 100)} 
                  showInfo={false} 
                  strokeColor={color} 
                  trailColor="#eee"
                  status="active"
                  style={{ maxWidth: 160 }}
                />
              </Col>
            );
          })}
        </Row>
      </Card>

      <Row gutter={24}>
        {/* ===== Weakness ===== */}
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ background: "#fff", marginBottom: 24, height: "100%" }}>
            <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Weakness</h3>
            {cveData.cwes && cveData.cwes.length > 0 ? (
              <ul style={{ paddingLeft: 18 }}>
                {cveData.cwes.map((cwe, index) => (
                  <li key={index} style={{ marginBottom: 4 }}>
                    <a 
                      href={cwe.info_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: "#1890ff", fontWeight: 500, marginRight: 8 }}
                    >
                      {cwe.title.split(':')[0]}
                    </a>
                    <span>{cwe.title.split(':')[1]?.trim() || cwe.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: "#999", fontStyle: "italic" }}>No weakness information available</div>
            )}
          </Card>
        </Col>
        
        {/* ===== References ===== */}
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ background: "#fff", marginBottom: 24, height: "100%" }}>
            <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>References</h3>
            {references && references.length > 0 ? (
              <ul style={{ paddingLeft: 18 }}>
                {references.map((ref, index) => (
                  <li key={index} style={{ marginBottom: 4 }}>
                    <a 
                      href={ref.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: "#1890ff", fontSize: 15 }}
                    >
                      {ref.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: "#999", fontStyle: "italic" }}>No references available</div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

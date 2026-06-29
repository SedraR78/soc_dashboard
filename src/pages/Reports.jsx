import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export function ReportsPage() {
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  const incidentDetails = {
    'SSH Brute Force': {
      description: 'Unauthorized SSH login attempts detected from external IP. Multiple failed authentication attempts indicate potential credential brute force attack.',
      recommendation: 'Implement IP blocking, enable MFA, review SSH logs',
      affectedServices: 'SSH Service (Port 22)',
      impactLevel: 'HIGH'
    },
    'Port Scan': {
      description: 'Network reconnaissance detected. Attacker scanning for open ports to identify vulnerabilities and available services.',
      recommendation: 'Monitor firewall rules, implement port filtering, enable intrusion detection',
      affectedServices: 'Multiple Ports',
      impactLevel: 'MEDIUM'
    },
    'SQL Injection': {
      description: 'SQL injection attack detected on web application endpoint. Attacker attempting to manipulate database queries to extract or modify data.',
      recommendation: 'Patch application, implement input validation, use parameterized queries',
      affectedServices: 'Web Application API',
      impactLevel: 'CRITICAL'
    },
    'DDoS Attack': {
      description: 'Distributed Denial of Service attack flooding server with traffic. Service availability compromised due to excessive concurrent connections.',
      recommendation: 'Enable DDoS protection, implement rate limiting, scale infrastructure',
      affectedServices: 'Web Server (Port 80/443)',
      impactLevel: 'CRITICAL'
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem('soc_token');
      const response = await axios.get(`${API_URL}/api/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIncidents(response.data.alerts || []);
      if (response.data.alerts && response.data.alerts.length > 0) {
        setSelectedIncident(response.data.alerts[0]);
      }
    } catch (err) {
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIncidentInfo = (incidentType) => {
    return incidentDetails[incidentType] || {
      description: 'Security incident detected during system monitoring.',
      recommendation: 'Review incident logs and implement appropriate security measures',
      affectedServices: 'System Services',
      impactLevel: 'MEDIUM'
    };
  };

  const generateReport = () => {
    if (!selectedIncident) {
      alert('Select an incident first');
      return;
    }

    const incidentInfo = getIncidentInfo(selectedIncident.type);
    const reportContent = {
      incidentId: selectedIncident.id,
      timestamp: new Date(selectedIncident.timestamp).toLocaleString(),
      type: selectedIncident.type || 'Unknown Attack',
      sourceIP: selectedIncident.sourceIP || 'N/A',
      severity: selectedIncident.severity?.toUpperCase() || 'MEDIUM',
      status: selectedIncident.status || 'Open',
      description: incidentInfo.description,
      recommendation: incidentInfo.recommendation,
      affectedServices: incidentInfo.affectedServices,
      impactLevel: incidentInfo.impactLevel,
      generatedDate: new Date().toLocaleString()
    };

    setReport(reportContent);
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`incident-report-${report.incidentId}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#f1f5f9', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '40px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '32px', fontWeight: '700', margin: 0 }}>📋 Incident Report Generator</h1>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>← Back to Dashboard</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          <div>
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 12px 0', fontWeight: '600', textTransform: 'uppercase' }}>🎯 Select Incident</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                {incidents.map((incident, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedIncident(incident)}
                    style={{
                      padding: '12px',
                      background: selectedIncident?.id === incident.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                      border: selectedIncident?.id === incident.id ? '2px solid #10b981' : '1px solid transparent',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <p style={{ fontSize: '12px', color: '#f1f5f9', fontWeight: '600', margin: '0 0 4px 0' }}>{incident.type}</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 2px 0' }}>{incident.sourceIP}</p>
                    <p style={{ fontSize: '10px', color: incident.severity === 'critical' ? '#ef4444' : incident.severity === 'high' ? '#f59e0b' : '#10b981', fontWeight: '600' }}>{incident.severity?.toUpperCase()}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={generateReport}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '12px',
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                🔍 Generate Report
              </button>

              {report && (
                <button
                  onClick={downloadPDF}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    padding: '12px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  📥 Download PDF
                </button>
              )}
            </div>
          </div>

          {report && (
            <div
              ref={reportRef}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                padding: '30px',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                color: '#f1f5f9'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #3b82f6' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0', color: '#3b82f6' }}>INCIDENT REPORT</h1>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Holberton SOC — Security Analysis</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Incident ID</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6', margin: 0, fontFamily: 'monospace' }}>{report.incidentId}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Severity</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: report.severity === 'CRITICAL' ? '#ef4444' : report.severity === 'HIGH' ? '#f59e0b' : '#10b981', margin: 0 }}>{report.severity}</p>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Attack Type</p>
                <p style={{ fontSize: '14px', color: '#f1f5f9', margin: 0, fontWeight: '600' }}>{report.type}</p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Source IP Address</p>
                <p style={{ fontSize: '14px', color: '#f1f5f9', margin: 0, fontFamily: 'monospace', fontWeight: '600' }}>{report.sourceIP}</p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Affected Services</p>
                <p style={{ fontSize: '14px', color: '#f1f5f9', margin: 0 }}>{report.affectedServices}</p>
              </div>

              <div style={{ marginBottom: '24px', paddingTop: '20px', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Description & Analysis</p>
                <p style={{ fontSize: '13px', color: '#f1f5f9', margin: 0, lineHeight: '1.6' }}>{report.description}</p>
              </div>

              <div style={{ marginBottom: '24px', paddingTop: '20px', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Recommended Actions</p>
                <p style={{ fontSize: '13px', color: '#10b981', margin: 0, lineHeight: '1.6' }}>{report.recommendation}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', paddingTop: '20px', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Status</p>
                  <p style={{ fontSize: '14px', color: '#10b981', margin: 0, fontWeight: '600', textTransform: 'uppercase' }}>{report.status}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Detected</p>
                  <p style={{ fontSize: '13px', color: '#f1f5f9', margin: 0 }}>{report.timestamp}</p>
                </div>
              </div>

              <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
                <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>Report Generated: {report.generatedDate}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

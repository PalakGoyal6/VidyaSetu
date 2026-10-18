'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';

interface Endpoint {
  id: string;
  name: string;
  method: 'POST' | 'GET';
  path: string;
  targetUser: string;
  description: string;
  defaultPayload: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    id: 'recommend',
    name: 'Recommend Rural Student',
    method: 'POST',
    path: '/api/v1/interop/students/recommend',
    targetUser: 'NGOs, Village Facilitators, School Teachers',
    description: 'Programmatically register student profiles discovered in rural schools to match them with scholarships and apprenticeships.',
    defaultPayload: JSON.stringify({
      partnerId: "PRATHAM-UP-04",
      studentName: "Sunita Yadav",
      grade: "Class 10",
      district: "Mirzapur",
      state: "Uttar Pradesh",
      interests: ["Computer Science", "Mathematics"],
      skills: ["Problem Solving", "Hindi Communication"],
      contact: "facilitator@pratham.org"
    }, null, 2),
  },
  {
    id: 'apprentice',
    name: 'Post NAPS Apprenticeship',
    method: 'POST',
    path: '/api/v1/interop/apprenticeships/post',
    targetUser: 'Corporates, MSMEs, Industrial Employers',
    description: 'Publish NAPS-backed vocational and technical apprenticeship openings directly to rural youth.',
    defaultPayload: JSON.stringify({
      companyName: "Mahindra Heavy Industries",
      role: "Solar Panel & Electrician Technician",
      sector: "Renewable Energy",
      stipendMonthly: "₹9,500/mo",
      seats: 120,
      duration: "1 Year",
      location: "Nagpur, Maharashtra",
      napsRegistrationNo: "NAPS-MAH-2026-99"
    }, null, 2),
  },
  {
    id: 'schemes',
    name: 'Query Scheme Eligibility',
    method: 'POST',
    path: '/api/v1/interop/schemes/match',
    targetUser: 'Common Service Centres (CSC), Gram Panchayats',
    description: 'Verify instant welfare scheme and scholarship eligibility based on income, age, and academic stream.',
    defaultPayload: JSON.stringify({
      age: 17,
      annualFamilyIncome: 180000,
      educationLevel: "Class 11",
      category: "Vocational"
    }, null, 2),
  },
  {
    id: 'aishe',
    name: 'Search AISHE Institutions',
    method: 'GET',
    path: '/api/aishe?state=Rajasthan',
    targetUser: 'Colleges, Education Researchers, Policy Makers',
    description: 'Query accredited colleges, polytechnics, and government vocational institutes grounded in AISHE data.',
    defaultPayload: '{}',
  },
];

export default function InteropPage() {
  const [lang, setLang] = useState<string>('en');
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS[0]);
  const [payload, setPayload] = useState(ENDPOINTS[0].defaultPayload);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectEndpoint = (ep: Endpoint) => {
    setSelectedEndpoint(ep);
    setPayload(ep.defaultPayload);
    setResponseOutput(null);
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponseOutput(null);
    try {
      const isGet = selectedEndpoint.method === 'GET';
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (!isGet) {
        options.body = payload;
      }
      const res = await fetch(selectedEndpoint.path, options);
      const data = await res.json();
      setResponseOutput(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      setResponseOutput(JSON.stringify({ error: 'Request failed', details: String(err) }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const curlCommand = selectedEndpoint.method === 'GET'
    ? `curl -X GET "https://vidyasetu.vercel.app${selectedEndpoint.path}"`
    : `curl -X POST "https://vidyasetu.vercel.app${selectedEndpoint.path}" \\\n  -H "Content-Type: application/json" \\\n  -d '${payload.replace(/\n/g, ' ')}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell lang={lang} onLangChange={setLang}>
      <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: '1.8rem' }}>🔌</span>
                <h1>Open APIs & Standards-Based Interoperability</h1>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Standards-based open architecture connecting Colleges (AISHE), Employers (NAPS), NGOs, and Government Portals.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span className="badge badge-success">REST API v1</span>
              <span className="badge badge-primary">Open-Source Ready</span>
            </div>
          </div>
        </div>

        <div className="section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Left Column: Endpoint selector & documentation */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Select Partner API</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {ENDPOINTS.map(ep => (
                <div
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  style={{
                    background: selectedEndpoint.id === ep.id ? 'rgba(79,70,229,0.18)' : 'var(--bg-card)',
                    border: `1px solid ${selectedEndpoint.id === ep.id ? 'var(--primary-light)' : 'var(--bg-glass-border)'}`,
                    borderRadius: 12, padding: 14, cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{ep.name}</span>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: 4,
                      background: ep.method === 'POST' ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)',
                      color: ep.method === 'POST' ? 'var(--success)' : '#60a5fa',
                    }}>{ep.method}</span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                    {ep.path}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {ep.description}
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.68rem', color: 'var(--accent-light)' }}>
                    🏢 Target: {ep.targetUser}
                  </div>
                </div>
              ))}
            </div>

            {/* Integration Specifications */}
            <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)', borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-primary)' }}>Integrations Grounded in Real Data:</h4>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 18 }}>
                <li><strong>AISHE Survey:</strong> 45,000+ Colleges & Polytechnics with rural quota mapping</li>
                <li><strong>NAPS Portal:</strong> Direct stipend matching for industrial apprenticeship</li>
                <li><strong>BHASHINI:</strong> Regional voice & translation pipeline (7 Indian languages)</li>
                <li><strong>SWAYAM & DIKSHA:</strong> Free MOOC certifications & school curriculum</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Live Testing Console */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1.1rem' }}>Interactive Test Console</h3>
              <button
                onClick={handleCopyCurl}
                style={{
                  background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)',
                  color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 6,
                  cursor: 'pointer', fontSize: '0.75rem',
                }}>
                {copied ? '✓ Copied cURL' : '📋 Copy cURL'}
              </button>
            </div>

            {/* Request Payload Editor */}
            {selectedEndpoint.method !== 'GET' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Request JSON Body:
                </label>
                <textarea
                  value={payload}
                  onChange={e => setPayload(e.target.value)}
                  rows={8}
                  style={{
                    width: '100%', fontFamily: 'monospace', fontSize: '0.8rem',
                    background: '#070712', border: '1px solid var(--bg-glass-border)',
                    borderRadius: 10, padding: 12, color: '#a5f3fc', resize: 'vertical',
                  }}
                />
              </div>
            )}

            <button
              onClick={handleExecute}
              disabled={loading}
              style={{
                width: '100%', background: 'var(--gradient-primary)', border: 'none',
                color: 'white', padding: '12px', borderRadius: 10, fontWeight: 700,
                fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              {loading ? 'Sending Request to Live Server...' : `▶ Send ${selectedEndpoint.method} Request`}
            </button>

            {/* Live Output */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Live Response:
              </label>
              <pre style={{
                background: '#070712', border: '1px solid var(--bg-glass-border)',
                borderRadius: 10, padding: 14, minHeight: 180, maxHeight: 340,
                overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.78rem',
                color: responseOutput ? '#86efac' : 'var(--text-muted)',
              }}>
                {responseOutput || '// Click "Send Request" to test against the live backend route.'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

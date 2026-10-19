'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';

interface Student {
  id: string;
  name: string;
  class: string;
  state: string;
  interests: string[];
  careerInterest: string;
  careerIcon: string;
  profileScore: number;
  lastActive: string;
  scholarshipEligible: boolean;
  recommended?: boolean;
  tags: string[];
}

interface Module {
  id: string;
  title: string;
  subject: string;
  duration: string;
  price: 'free' | number;
  enrolled: number;
  rating: number;
  status: 'draft' | 'published' | 'review';
  earnings: number;
}

export default function FacilitatorPage() {
  const [lang, setLang] = useState<string>('en');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'modules' | 'create'>('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: '', subject: '', duration: '', pricing: 'free', price: '' });
  const [recommendedStudents, setRecommendedStudents] = useState<string[]>([]);
  const [moduleCreated, setModuleCreated] = useState(false);

  const students: Student[] = [
    { id: 's1', name: 'Ravi Kumar', class: '10', state: 'UP', interests: ['Computer', 'Math'], careerInterest: 'Software Developer', careerIcon: '💻', profileScore: 78, lastActive: '2 hours ago', scholarshipEligible: true, tags: ['Talented', 'Scholar-eligible'] },
    { id: 's2', name: 'Sunita Devi', class: '9', state: 'Bihar', interests: ['Art', 'Design'], careerInterest: 'Graphic Designer', careerIcon: '🎨', profileScore: 65, lastActive: 'Yesterday', scholarshipEligible: true, tags: ['Creative', 'First-gen'] },
    { id: 's3', name: 'Mohan Lal', class: '11', state: 'MP', interests: ['Farming', 'Science'], careerInterest: 'Agricultural Technologist', careerIcon: '🌾', profileScore: 82, lastActive: '3 hours ago', scholarshipEligible: false, tags: ['High achiever'] },
    { id: 's4', name: 'Priya Yadav', class: '10', state: 'UP', interests: ['Health', 'Biology'], careerInterest: 'Nursing Professional', careerIcon: '🏥', profileScore: 71, lastActive: 'Today', scholarshipEligible: true, tags: ['Scholar-eligible', 'Motivated'] },
    { id: 's5', name: 'Anil Sharma', class: '12', state: 'Rajasthan', interests: ['Repair', 'Electronics'], careerInterest: 'Mobile Repair Technician', careerIcon: '📱', profileScore: 55, lastActive: '2 days ago', scholarshipEligible: false, tags: ['Vocational-ready'] },
    { id: 's6', name: 'Geeta Kumari', class: '9', state: 'Jharkhand', interests: ['Teaching', 'Communication'], careerInterest: 'School Teacher', careerIcon: '📚', profileScore: 88, lastActive: '1 hour ago', scholarshipEligible: true, tags: ['Top performer', 'Scholar-eligible'] },
  ];

  const modules: Module[] = [
    { id: 'm1', title: 'Basic Computer Skills for Class 9-10', subject: 'Technology', duration: '4 weeks', price: 'free', enrolled: 234, rating: 4.7, status: 'published', earnings: 0 },
    { id: 'm2', title: 'Farm Management & Modern Techniques', subject: 'Agriculture', duration: '6 weeks', price: 299, enrolled: 87, rating: 4.9, status: 'published', earnings: 26013 },
    { id: 'm3', title: 'Hindi Communication for Job Seekers', subject: 'Language', duration: '3 weeks', price: 149, enrolled: 45, rating: 4.5, status: 'published', earnings: 6705 },
    { id: 'm4', title: 'Local Govt Scheme Awareness Module', subject: 'Civic', duration: '2 weeks', price: 'free', enrolled: 0, rating: 0, status: 'draft', earnings: 0 },
  ];

  const toggleRecommend = (studentId: string) => {
    setRecommendedStudents(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleCreateModule = () => {
    setModuleCreated(true);
    setTimeout(() => { setModuleCreated(false); setActiveTab('modules'); setModuleForm({ title: '', subject: '', duration: '', pricing: 'free', price: '' }); }, 2000);
  };

  const totalEarnings = modules.reduce((sum, m) => sum + m.earnings, 0);
  const totalStudents = students.length;
  const scholarshipEligibleCount = students.filter(s => s.scholarshipEligible).length;

  return (
    <AppShell lang={lang} onLangChange={setLang}>
      <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: '1.8rem' }}>👩‍🏫</span>
                <h2>{lang === 'hi' ? 'सुविधाकर्ता डैशबोर्ड' : 'Facilitator Dashboard'}</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {lang === 'hi' ? 'छात्रों की प्रतिभा खोजें, अवसर सिफारिश करें और अपना मॉड्यूल बनाएं' : 'Spot student talent, recommend opportunities, and build monetizable training modules'}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="avatar avatar-lg">RS</div>
              <div>
                <div style={{ fontWeight: 700 }}>Rajesh Sir</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Facilitator • Govt School, UP</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 4, marginTop: 20, background: 'var(--bg-glass)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
            {[
              { key: 'dashboard', label: lang === 'hi' ? '📊 डैशबोर्ड' : '📊 Dashboard' },
              { key: 'students', label: lang === 'hi' ? '👥 छात्र' : '👥 Students' },
              { key: 'modules', label: lang === 'hi' ? '📦 मॉड्यूल' : '📦 Modules' },
              { key: 'create', label: lang === 'hi' ? '✏️ बनाएं' : '✏️ Create' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: 600, fontSize: '0.85rem',
                background: activeTab === tab.key ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === tab.key ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}>{tab.label}</button>
            ))}
          </div>
        </div>

        <div className="section">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                {[
                  { icon: '👥', value: totalStudents, label: lang === 'hi' ? 'कुल छात्र' : 'Total Students', color: 'var(--primary-light)' },
                  { icon: '🎓', value: scholarshipEligibleCount, label: lang === 'hi' ? 'छात्रवृत्ति योग्य' : 'Scholarship Eligible', color: 'var(--success)' },
                  { icon: '📦', value: modules.filter(m => m.status === 'published').length, label: lang === 'hi' ? 'प्रकाशित मॉड्यूल' : 'Published Modules', color: 'var(--accent)' },
                  { icon: '💰', value: `₹${(totalEarnings).toLocaleString()}`, label: lang === 'hi' ? 'कुल आय' : 'Total Earnings', color: '#fbbf24' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)', borderRadius: 16, padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Recent Students */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)', borderRadius: 16, padding: '20px' }}>
                  <h4 style={{ marginBottom: 16, fontSize: '0.95rem' }}>
                    🌟 {lang === 'hi' ? 'आज सबसे सक्रिय छात्र' : 'Most Active Students Today'}
                  </h4>
                  {students.slice(0, 4).map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--bg-glass-border)' }}>
                      <div className="avatar" style={{ background: 'var(--gradient-primary)', flexShrink: 0 }}>{s.name[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class {s.class} • {s.careerIcon} {s.careerInterest}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-light)' }}>{s.profileScore}%</div>
                        {s.scholarshipEligible && <span style={{ fontSize: '0.65rem', color: 'var(--success)' }}>🎓 Eligible</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Insights */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)', borderRadius: 16, padding: '20px' }}>
                  <h4 style={{ marginBottom: 16, fontSize: '0.95rem' }}>
                    🤖 {lang === 'hi' ? 'AI अंतर्दृष्टि' : 'AI Insights'}
                  </h4>
                  {[
                    { icon: '🚨', text: lang === 'hi' ? '3 छात्र NSP छात्रवृत्ति के लिए पात्र हैं — अंतिम तिथि: 31 अक्टूबर' : '3 students eligible for NSP scholarship — deadline Oct 31', color: 'var(--warning)', action: lang === 'hi' ? 'अभी सिफारिश करें' : 'Recommend Now' },
                    { icon: '💡', text: lang === 'hi' ? 'Geeta Kumari NAPS अप्रेंटिसशिप के लिए तैयार है' : 'Geeta Kumari is ready for NAPS apprenticeship', color: 'var(--success)', action: lang === 'hi' ? 'आगे भेजें' : 'Forward' },
                    { icon: '📈', text: lang === 'hi' ? '\'कृषि प्रबंधन\' मॉड्यूल में 87 नए एनरोलमेंट इस सप्ताह' : '\'Farm Management\' module has 87 enrollments this week', color: 'var(--primary-light)', action: lang === 'hi' ? 'देखें' : 'View' },
                    { icon: '🎯', text: lang === 'hi' ? 'Anil Sharma को vocational counseling की जरूरत है' : 'Anil Sharma needs vocational counseling — low engagement', color: '#a78bfa', action: lang === 'hi' ? 'संपर्क करें' : 'Contact' },
                  ].map((insight, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: 'var(--bg-glass)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--bg-glass-border)' }}>
                      <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{insight.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{insight.text}</p>
                        <button style={{ background: 'none', border: `1px solid ${insight.color}`, color: insight.color, padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                          {insight.action} →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <>
              {recommendedStudents.length > 0 && (
                <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>
                    ✓ {recommendedStudents.length} {lang === 'hi' ? 'छात्र सिफारिश के लिए चिह्नित' : 'students marked for recommendation'}
                  </span>
                  <button style={{ background: 'var(--gradient-success)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem' }}>
                    {lang === 'hi' ? '📤 NSP को भेजें' : '📤 Submit to NSP'}
                  </button>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {students.map(student => (
                  <div key={student.id} style={{
                    background: 'var(--bg-card)', border: `1px solid ${recommendedStudents.includes(student.id) ? 'rgba(16,185,129,0.4)' : 'var(--bg-glass-border)'}`,
                    borderRadius: 16, padding: '18px', transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                      <div className="avatar" style={{ background: 'var(--gradient-primary)', flexShrink: 0 }}>{student.name[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{student.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class {student.class} • {student.state}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: 'var(--primary-light)', fontSize: '1rem' }}>{student.profileScore}%</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>profile</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <span style={{ fontSize: '1.1rem' }}>{student.careerIcon}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{student.careerInterest}</span>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <div className="progress-bar" style={{ height: 4 }}>
                        <div className="progress-fill" style={{ width: `${student.profileScore}%` }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                      {student.tags.map((tag, j) => (
                        <span key={j} className="badge badge-primary" style={{ fontSize: '0.62rem' }}>{tag}</span>
                      ))}
                      {student.scholarshipEligible && <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>🎓 Scholar</span>}
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 12 }}>🕐 {student.lastActive}</div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => toggleRecommend(student.id)}
                        style={{
                          flex: 1, border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '8px', borderRadius: 8, fontWeight: 600, fontSize: '0.78rem',
                          background: recommendedStudents.includes(student.id) ? 'var(--gradient-success)' : 'var(--gradient-primary)',
                          color: 'white', transition: 'all 0.2s',
                        }}>
                        {recommendedStudents.includes(student.id) ? '✓ Recommended' : (lang === 'hi' ? 'सिफारिश करें' : 'Recommend')}
                      </button>
                      <button style={{
                        border: '1px solid var(--bg-glass-border)', background: 'var(--bg-glass)',
                        color: 'var(--text-muted)', padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem',
                      }}>📩</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Modules Tab */}
          {activeTab === 'modules' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <button
                  onClick={() => setActiveTab('create')}
                  style={{ background: 'var(--gradient-accent)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  ✏️ {lang === 'hi' ? 'नया मॉड्यूल बनाएं' : 'Create New Module'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {modules.map(mod => (
                  <div key={mod.id} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)',
                    borderRadius: 16, padding: '20px', display: 'flex', alignItems: 'center', gap: 20,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <h4 style={{ fontSize: '0.95rem' }}>{mod.title}</h4>
                        <span style={{
                          fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100,
                          background: mod.status === 'published' ? '#f0fdf4' : mod.status === 'draft' ? '#fefce8' : '#fff7ed',
                          color: mod.status === 'published' ? 'var(--success)' : mod.status === 'draft' ? 'var(--warning)' : 'var(--primary)',
                          border: `1px solid ${mod.status === 'published' ? '#bbf7d0' : mod.status === 'draft' ? '#fef08a' : '#fed7aa'}`,
                          fontWeight: 700,
                        }}>{mod.status}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>📚 {mod.subject}</span>
                        <span>⏱️ {mod.duration}</span>
                        <span>👥 {mod.enrolled} enrolled</span>
                        {mod.rating > 0 && <span>⭐ {mod.rating}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: 100 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'hi' ? 'मूल्य' : 'Price'}</div>
                      <div style={{ fontWeight: 700, color: mod.price === 'free' ? 'var(--success)' : 'var(--accent)', fontSize: '1rem' }}>
                        {mod.price === 'free' ? 'FREE' : `₹${mod.price}`}
                      </div>
                    </div>
                    {mod.earnings > 0 && (
                      <div style={{ textAlign: 'center', minWidth: 100 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'hi' ? 'आय' : 'Earnings'}</div>
                        <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '1rem' }}>₹{mod.earnings.toLocaleString()}</div>
                      </div>
                    )}
                    <button style={{ background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' }}>
                      {lang === 'hi' ? 'संपादित करें' : 'Edit'}
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>💰 {lang === 'hi' ? 'कुल मासिक आय' : 'Total Monthly Earnings'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lang === 'hi' ? 'सभी प्रकाशित मॉड्यूल से' : 'From all published modules'}</div>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>₹{totalEarnings.toLocaleString()}</div>
                </div>
              </div>
            </>
          )}

          {/* Create Module Tab */}
          {activeTab === 'create' && (
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-glass-border)', borderRadius: 20, padding: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--gradient-accent)' }} />
                <h3 style={{ marginBottom: 4 }}>✏️ {lang === 'hi' ? 'नया ट्रेनिंग मॉड्यूल बनाएं' : 'Create New Training Module'}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24 }}>
                  {lang === 'hi' ? 'अपना ज्ञान साझा करें और कमाएं — मुफ़्त, प्रति मॉड्यूल या सब्स्क्रिप्शन' : 'Share your knowledge and earn — free, per module, or subscription'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                      {lang === 'hi' ? 'मॉड्यूल का नाम *' : 'Module Title *'}
                    </label>
                    <input type="text" className="input" value={moduleForm.title}
                      onChange={e => setModuleForm(p => ({ ...p, title: e.target.value }))}
                      placeholder={lang === 'hi' ? 'जैसे: ग्रामीण उद्यमिता के 5 कदम' : 'e.g., 5 Steps to Rural Entrepreneurship'} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                        {lang === 'hi' ? 'विषय' : 'Subject'}
                      </label>
                      <select className="input" value={moduleForm.subject}
                        onChange={e => setModuleForm(p => ({ ...p, subject: e.target.value }))}>
                        <option value="">{lang === 'hi' ? 'विषय चुनें' : 'Select Subject'}</option>
                        {['Agriculture', 'Technology', 'Commerce', 'Healthcare', 'Vocational', 'Life Skills', 'Finance'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                        {lang === 'hi' ? 'अवधि' : 'Duration'}
                      </label>
                      <input type="text" className="input" value={moduleForm.duration}
                        onChange={e => setModuleForm(p => ({ ...p, duration: e.target.value }))}
                        placeholder={lang === 'hi' ? '4 सप्ताह' : '4 weeks'} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                      {lang === 'hi' ? 'मूल्य निर्धारण मॉडल' : 'Pricing Model'}
                    </label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {[
                        { value: 'free', label: lang === 'hi' ? '🆓 मुफ़्त' : '🆓 Free', desc: lang === 'hi' ? 'सबके लिए उपलब्ध' : 'Open for all' },
                        { value: 'paid', label: lang === 'hi' ? '💳 प्रति मॉड्यूल' : '💳 Per Module', desc: lang === 'hi' ? 'एकमुश्त भुगतान' : 'One-time fee' },
                        { value: 'subscription', label: lang === 'hi' ? '🔄 सब्स्क्रिप्शन' : '🔄 Subscription', desc: lang === 'hi' ? 'मासिक' : 'Monthly' },
                      ].map(opt => (
                        <button key={opt.value} onClick={() => setModuleForm(p => ({ ...p, pricing: opt.value }))} style={{
                          flex: 1, padding: '12px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                          border: `2px solid ${moduleForm.pricing === opt.value ? 'var(--primary)' : 'var(--bg-glass-border)'}`,
                          background: moduleForm.pricing === opt.value ? 'var(--bg-glass)' : 'var(--bg-card)',
                          boxShadow: 'var(--shadow-sm)',
                          textAlign: 'center', transition: 'all 0.2s',
                        }}>
                          <div style={{ fontWeight: 700, color: moduleForm.pricing === opt.value ? 'var(--primary)' : 'var(--text-primary)', fontSize: '0.85rem' }}>{opt.label}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                    {moduleForm.pricing !== 'free' && (
                      <input type="number" className="input" value={moduleForm.price}
                        onChange={e => setModuleForm(p => ({ ...p, price: e.target.value }))}
                        placeholder={lang === 'hi' ? 'मूल्य ₹ में' : 'Price in ₹ (e.g. 299)'}
                        style={{ marginTop: 10 }} />
                    )}
                  </div>

                  <button
                    onClick={handleCreateModule}
                    disabled={!moduleForm.title || moduleCreated}
                    style={{
                      width: '100%', background: moduleCreated ? 'var(--gradient-success)' : 'var(--gradient-accent)',
                      border: 'none', color: 'white', padding: '16px', borderRadius: 12,
                      cursor: moduleForm.title ? 'pointer' : 'not-allowed',
                      fontFamily: 'inherit', fontWeight: 700, fontSize: '1rem',
                      opacity: moduleForm.title ? 1 : 0.5, transition: 'all 0.3s',
                    }}>
                    {moduleCreated ? '✓ Module Created Successfully!' : (lang === 'hi' ? '🚀 मॉड्यूल प्रकाशित करें' : '🚀 Publish Module')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

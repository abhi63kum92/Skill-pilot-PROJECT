import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Download, Printer, CheckCircle, ExternalLink, ShieldCheck, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

const CERTIFICATES = [
  {
    id: 'CERT-001',
    title: 'Python for Statistical Analysis & Data Processing',
    issuer: 'Ministry of Statistics & Programme Implementation (MoSPI) & iGOT Karmayogi',
    issueDate: '15 August 2026',
    credentialId: 'IGOT-MOSPI-2026-8891A',
    score: '92%',
    hours: '20 Hours',
    domain: 'Technical Competency'
  },
  {
    id: 'CERT-002',
    title: 'Sustainable Development Goals (SDG) Indicator Framework',
    issuer: 'National Statistical Systems Training Academy (NSSTA TPAC)',
    issueDate: '22 July 2026',
    credentialId: 'NSSTA-TPAC-2026-4412B',
    score: '96%',
    hours: '12 Hours',
    domain: 'Statistical Methodology'
  },
  {
    id: 'CERT-003',
    title: 'Cybersecurity & Government Data Privacy Frameworks',
    issuer: 'iGOT Karmayogi Digital Governance Division',
    issueDate: '10 June 2026',
    credentialId: 'IGOT-GOV-2026-1198C',
    score: '88%',
    hours: '10 Hours',
    domain: 'Digital Governance'
  }
];

export default function Certificates() {
  const { user } = useAuth();
  const [selectedCert, setSelectedCert] = useState(CERTIFICATES[0]);
  const [showModal, setShowModal] = useState(false);

  const handlePrint = () => {
    window.print();
    toast.success('Preparing certificate for print/PDF export');
  };

  const handleDownload = (cert) => {
    setSelectedCert(cert);
    setShowModal(true);
  };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">📜 Verified Certifications & Badges</h1>
            <p className="page-subtitle">
              Official capacity building certificates verified under India's iGOT Karmayogi & MoSPI digital governance framework
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-success">3 Verified Badges</span>
          </div>
        </div>
      </div>

      {/* Certificate Cards Grid */}
      <div className="grid-3" style={{ gap: '20px', marginBottom: '32px' }}>
        {CERTIFICATES.map((cert) => (
          <div key={cert.id} className="card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2))',
              border: '1px solid rgba(99,102,241,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
            }}>
              <Award size={24} color="#818cf8" />
            </div>

            <span className="badge badge-primary" style={{ width: 'fit-content', marginBottom: '10px' }}>
              {cert.domain}
            </span>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4 }}>
              {cert.title}
            </h3>

            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '16px', flex: 1 }}>
              {cert.issuer}
            </p>

            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.75rem', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Score: <strong style={{ color: '#10b981' }}>{cert.score}</strong></span>
              <span>Issued: <strong>{cert.issueDate}</strong></span>
            </div>

            <button className="btn btn-primary" onClick={() => handleDownload(cert)} style={{ width: '100%', justifyContent: 'center' }}>
              <Award size={15} /> View & Export Certificate
            </button>
          </div>
        ))}
      </div>

      {/* Official Certificate Preview Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', color: '#0f172a',
            width: '100%', maxWidth: '820px', borderRadius: '16px',
            padding: '40px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: '#f1f5f9', border: 'none', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              ✕
            </button>

            {/* Certificate Frame */}
            <div style={{
              border: '6px double #312e81', padding: '32px',
              borderRadius: '8px', textAlign: 'center', position: 'relative', background: '#fafaf9'
            }}>
              {/* Header Logos */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#312e81', letterSpacing: '0.05em' }}>
                    GOVERNMENT OF INDIA
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Ministry of Statistics & Programme Implementation
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
                  🇮🇳
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7' }}>
                    iGOT KARMAYOGI
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    National Capacity Building Framework
                  </div>
                </div>
              </div>

              <h2 style={{ fontSize: '1.8rem', fontFamily: 'Georgia, serif', color: '#1e1b4b', marginBottom: '8px' }}>
                Certificate of Competency Achievement
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', marginBottom: '20px' }}>
                This is officially awarded under the Official Statistical System Capacity Framework to:
              </div>

              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#4338ca', borderBottom: '2px solid #c7d2fe', paddingBottom: '8px', display: 'inline-block', minWidth: '320px', marginBottom: '14px', fontFamily: 'Space Grotesk, sans-serif' }}>
                {user?.name || 'Rajesh Kumar'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '20px' }}>
                Designation: <strong>{user?.designation || 'Statistical Officer'}</strong> | Department: <strong>{user?.department || 'National Statistical Office (NSO)'}</strong>
              </div>

              <p style={{ fontSize: '0.92rem', color: '#334155', maxWidth: '580px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                For successfully fulfilling the continuous capacity assessment and mastering 
                <strong> "{selectedCert.title}"</strong> with a verified proficiency grade of <strong>{selectedCert.score}</strong>.
              </p>

              {/* Certificate Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                <div style={{ textAlign: 'left', fontSize: '0.75rem', color: '#64748b' }}>
                  <div>Credential ID: <strong>{selectedCert.credentialId}</strong></div>
                  <div>Issued Date: <strong>{selectedCert.issueDate}</strong></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', marginTop: '4px', fontWeight: 600 }}>
                    <ShieldCheck size={14} /> Digilocker & iGOT Karmayogi Verified
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', border: '1px solid #cbd5e1', padding: '4px', borderRadius: '6px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={48} color="#1e293b" />
                  </div>
                  <span style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '4px' }}>Scan to Verify</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontFamily: 'cursive', color: '#312e81', fontWeight: 700 }}>
                    Dr. Priya Sharma
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', borderTop: '1px solid #94a3b8', paddingTop: '2px' }}>
                    Director General, Training (MoSPI / NSSTA)
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={handlePrint}>
                <Printer size={16} /> Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

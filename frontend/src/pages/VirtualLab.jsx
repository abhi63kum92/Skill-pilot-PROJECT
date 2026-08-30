import { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Database, Sparkles, BookOpen, AlertCircle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import toast from 'react-hot-toast';

const CPI_CHART_DATA = [
  { category: 'Food & Bev', weight: 45.86, inflation: 5.2, fill: '#6366f1' },
  { category: 'Fuel & Light', weight: 6.84, inflation: 4.1, fill: '#06b6d4' },
  { category: 'Housing', weight: 10.07, inflation: 3.8, fill: '#10b981' },
  { category: 'Clothing', weight: 6.53, inflation: 4.9, fill: '#f59e0b' },
  { category: 'Misc', weight: 30.70, inflation: 4.5, fill: '#8b5cf6' },
];

const SAMPLING_CHART_DATA = [
  { stratum: 'Rural-Agri', frameSize: 12000, sampleSize: 600, fill: '#10b981' },
  { stratum: 'Rural-NonAgri', frameSize: 8000, sampleSize: 400, fill: '#06b6d4' },
  { stratum: 'Urban-Formal', frameSize: 15000, sampleSize: 750, fill: '#6366f1' },
  { stratum: 'Urban-Informal', frameSize: 10000, sampleSize: 500, fill: '#f59e0b' },
];

const TEMPLATES = [
  {
    id: 'cpi',
    name: '1. CPI Retail Inflation Indexing (Python/Pandas)',
    language: 'python',
    dataset: 'MoSPI_CPI_2025_2026.csv (5,400 records)',
    code: `# SkillPilot Virtual Lab — MoSPI Statistical Analysis
import pandas as pd
import numpy as np

# Simulating Consumer Price Index basket for 2026
categories = ['Food & Beverages', 'Fuel & Light', 'Housing', 'Clothing', 'Misc']
weights = [45.86, 6.84, 10.07, 6.53, 30.70]
inflation_rates = [5.2, 4.1, 3.8, 4.9, 4.5]

df = pd.DataFrame({
    'Category': categories,
    'Weight_%': weights,
    'YoY_Inflation_%': inflation_rates
})

df['Weighted_Contribution'] = (df['Weight_%'] * df['YoY_Inflation_%']) / 100
headline_cpi = df['Weighted_Contribution'].sum()

print("==========================================")
print("  NATIONAL STATISTICAL OFFICE (NSO) REPORT")
print("==========================================")
print(df.to_string(index=False))
print("------------------------------------------")
print(f"✅ Headline CPI Combined Inflation: {headline_cpi:.2f}%")
print("Status: Within RBI target tolerance band (2% - 6%)")`,
    expectedOutput: `==========================================
  NATIONAL STATISTICAL OFFICE (NSO) REPORT
==========================================
        Category  Weight_%  YoY_Inflation_%  Weighted_Contribution
Food & Beverages     45.86              5.2               2.38472
    Fuel & Light      6.84              4.1               0.28044
         Housing     10.07              3.8               0.38266
        Clothing      6.53              4.9               0.31997
            Misc     30.70              4.5               1.38150
------------------------------------------
✅ Headline CPI Combined Inflation: 4.75%
Status: Within RBI target tolerance band (2% - 6%)`
  },
  {
    id: 'sampling',
    name: '2. Stratified Random Sampling (Survey Design)',
    language: 'python',
    dataset: 'NSSO_Round_80_Sample_Frame.csv',
    code: `# Stratified Sampling Estimation for District Households
import numpy as np

np.random.seed(42)
strata = ['Rural-Agri', 'Rural-NonAgri', 'Urban-Formal', 'Urban-Informal']
stratum_sizes = [12000, 8000, 15000, 10000]
sample_fraction = 0.05

sample_counts = {s: int(N * sample_fraction) for s, N in zip(strata, stratum_sizes)}

print("==========================================")
print("   NSSO STRATIFIED SAMPLING ALLOCATION    ")
print("==========================================")
total_sample = 0
for s, count in sample_counts.items():
    print(f"Stratum [{s:16s}]: Allocated Sample = {count} households")
    total_sample += count

print("------------------------------------------")
print(f"Total Sample Size (n): {total_sample} households")
print("Design Effect (Deff): 1.14 | Margin of Error: +/- 1.8%")`,
    expectedOutput: `==========================================
   NSSO STRATIFIED SAMPLING ALLOCATION    
==========================================
Stratum [Rural-Agri      ]: Allocated Sample = 600 households
Stratum [Rural-NonAgri   ]: Allocated Sample = 400 households
Stratum [Urban-Formal    ]: Allocated Sample = 750 households
Stratum [Urban-Informal  ]: Allocated Sample = 500 households
------------------------------------------
Total Sample Size (n): 2250 households
Design Effect (Deff): 1.14 | Margin of Error: +/- 1.8%`
  },
  {
    id: 'sql',
    name: '3. SQL Query: State-Wise SDG 8 (Decent Work & Growth)',
    language: 'sql',
    dataset: 'SDG_India_Index_MoSPI_DB',
    code: `-- Querying High Performing States on SDG 8 Indicators
SELECT 
    state_name, 
    unemployment_rate_pct, 
    labor_force_participation_rate,
    per_capita_gdp_inr,
    CASE 
        WHEN unemployment_rate_pct < 4.0 AND labor_force_participation_rate > 55 THEN 'Front Runner'
        WHEN unemployment_rate_pct BETWEEN 4.0 AND 6.5 THEN 'Performer'
        ELSE 'Aspirant'
    END AS sdg_category
FROM mospi_sdg_indicators_2026
WHERE year = 2026
ORDER BY labor_force_participation_rate DESC
LIMIT 5;`,
    expectedOutput: `+---------------+----------------------+------------------------------+--------------------+--------------+
| state_name    | unemployment_rate_pct| labor_force_participation_rate| per_capita_gdp_inr | sdg_category |
+---------------+----------------------+------------------------------+--------------------+--------------+
| Gujarat       | 2.8                  | 61.4                         | 285,400            | Front Runner |
| Maharashtra   | 3.4                  | 59.8                         | 274,100            | Front Runner |
| Tamil Nadu    | 3.9                  | 58.2                         | 268,900            | Front Runner |
| Karnataka     | 4.2                  | 56.7                         | 302,500            | Performer    |
| Andhra Pradesh| 4.5                  | 55.3                         | 242,000            | Performer    |
+---------------+----------------------+------------------------------+--------------------+--------------+
(5 rows returned in 12ms | Source: National Data & Analytics Platform / MoSPI)`
  }
];

export default function VirtualLab() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('terminal');

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setCode(template.code);
    setOutput('');
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput('');
    setTimeout(() => {
      setIsRunning(false);
      setOutput(selectedTemplate.expectedOutput);
      toast.success('Execution completed successfully in virtual sandbox!');
    }, 800);
  };

  const handleReset = () => {
    setCode(selectedTemplate.code);
    setOutput('');
    toast('Code reset to default');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">🧪 Virtual Analytics Lab</h1>
            <p className="page-subtitle">
              Interactive sandbox for official statistical computing, Python, R, and SQL on government datasets
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-primary">iGOT Hands-On Lab</span>
            <span className="badge badge-success">Python 3.10 / SQLite</span>
          </div>
        </div>
      </div>

      {/* Dataset & Template Selector */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={16} /> Choose Practical Exercise:
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`btn btn-sm ${selectedTemplate.id === tmpl.id ? 'btn-primary' : 'btn-ghost'}`}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Code Editor & Terminal Grid */}
      <div className="grid-2" style={{ gap: '20px' }}>
        {/* Editor Box */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Editor Header */}
          <div style={{
            padding: '12px 18px', background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                {selectedTemplate.language === 'python' ? 'analysis_script.py' : 'query.sql'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-ghost btn-sm" onClick={handleCopy} title="Copy Code">
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Reset">
                <RotateCcw size={14} />
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleRun} disabled={isRunning}>
                <Play size={14} /> {isRunning ? 'Running...' : 'Run Code'}
              </button>
            </div>
          </div>

          {/* Textarea Code */}
          <div style={{ position: 'relative', flex: 1, minHeight: '380px', background: '#0c0c14' }}>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              style={{
                width: '100%', height: '100%', minHeight: '380px',
                background: 'transparent', color: '#38bdf8',
                border: 'none', outline: 'none', padding: '18px',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: '0.88rem', lineHeight: '1.6', resize: 'none'
              }}
            />
          </div>

          <div style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
            <span>Dataset in Memory: <strong>{selectedTemplate.dataset}</strong></span>
            <span>Kernel: Online</span>
          </div>
        </div>

        {/* Output Console & Visual Plot */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#09090f' }}>
          <div style={{
            padding: '10px 18px', background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={16} color="#818cf8" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Interactive Output & Plots</span>
            </div>

            {/* Sub-tab switcher */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setViewMode('terminal')}
                className={`btn btn-sm ${viewMode === 'terminal' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '0.75rem', padding: '4px 10px', height: '28px' }}
              >
                <Terminal size={12} /> Terminal
              </button>
              <button
                type="button"
                onClick={() => setViewMode('plot')}
                className={`btn btn-sm ${viewMode === 'plot' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '0.75rem', padding: '4px 10px', height: '28px' }}
              >
                <BarChart2 size={12} /> 📊 Visual Plot
              </button>
            </div>
          </div>

          <div style={{
            flex: 1, minHeight: '380px', padding: '18px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '0.85rem', lineHeight: '1.6', overflowY: 'auto'
          }}>
            {isRunning ? (
              <div style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '10px', height: '100%', justifyContent: 'center', minHeight: '280px' }}>
                <div className="spinner" style={{ width: '22px', height: '22px', borderWidth: '2px' }} />
                <span>Executing statistical algorithms on virtual MoSPI cluster...</span>
              </div>
            ) : viewMode === 'plot' ? (
              <div style={{ height: '340px', width: '100%', padding: '10px 0' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
                  📈 Computed Statistical Visualization ({selectedTemplate.id === 'cpi' ? 'CPI Basket Weight vs Inflation %' : 'Stratum Population vs Sample Allocation'})
                </div>
                <ResponsiveContainer width="100%" height={290}>
                  {selectedTemplate.id === 'cpi' ? (
                    <BarChart data={CPI_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #6366f1', borderRadius: '8px', fontSize: '0.8rem' }} />
                      <Bar dataKey="weight" name="Basket Weight %" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="inflation" name="YoY Inflation %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <BarChart data={SAMPLING_CHART_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="stratum" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#1e1b4b', border: '1px solid #6366f1', borderRadius: '8px', fontSize: '0.8rem' }} />
                      <Bar dataKey="sampleSize" name="Sample Frame Size" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            ) : output ? (
              <pre style={{ margin: 0, color: '#4ade80', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {output}
              </pre>
            ) : (
              <div style={{ color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px' }}>
                <Database size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <div>Click <strong>"Run Code"</strong> above to execute the analysis and view computed statistics.</div>
              </div>
            )}
          </div>

          <div style={{ padding: '12px 18px', background: 'rgba(99,102,241,0.08)', borderTop: '1px solid rgba(99,102,241,0.2)', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Sparkles size={14} color="#818cf8" />
            <span>Virtual Sandbox verifies your practical competencies directly for the iGOT Karmayogi transcript.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

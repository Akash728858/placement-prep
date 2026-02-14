import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { runAnalysis } from '../utils/analysis';
import { saveAnalysis } from '../utils/storage';
import { FileText } from 'lucide-react';

export default function Analyze() {
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const trimmed = (jdText || '').trim();
    if (!trimmed) {
      setError('Please paste a job description to analyze.');
      return;
    }
    setLoading(true);
    try {
      const { extractedSkills, checklist, plan, questions, readinessScore, companyIntel, roundMapping } = runAnalysis(
        trimmed,
        company.trim(),
        role.trim()
      );
      const entry = saveAnalysis({
        company: company.trim(),
        role: role.trim(),
        jdText: trimmed,
        extractedSkills,
        plan,
        checklist,
        questions,
        readinessScore,
        companyIntel,
        roundMapping,
      });
      navigate(`/dashboard/results?id=${encodeURIComponent(entry.id)}`);
    } catch (err) {
      setError(err?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analyze Job Description</h1>
        <p className="text-slate-600">Paste a JD to get a readiness score, skill breakdown, and a preparation plan.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" strokeWidth={2} />
              Job details
            </CardTitle>
            <CardDescription>Optional: company and role improve your readiness score.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Microsoft"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Role
                </label>
                <input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. SDE 1, Frontend Developer"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label htmlFor="jdText" className="block text-sm font-medium text-slate-700 mb-1.5">
                Job description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="jdText"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={12}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y font-mono text-sm"
                required
              />
              {(jdText.trim().length > 0 && jdText.trim().length < 200) && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
                  This JD is too short to analyze deeply. Paste full JD for better output.
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">Longer JDs (800+ chars) add to your readiness score.</p>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium text-white bg-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing…' : 'Analyze'}
              </button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

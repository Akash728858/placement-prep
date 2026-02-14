import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import {
  getProofSubmission,
  setProofSubmission,
  setProofStep,
  validateUrl,
  TOTAL_STEPS,
} from '../utils/proofStorage';
import { ClipboardCheck, Link as LinkIcon } from 'lucide-react';

const STEP_LABELS = [
  'Landing page & Get Started',
  'Dashboard shell & navigation',
  'Analyze JD & Results flow',
  'History & persistence',
  'Company Intel & Round Mapping',
  'Skill toggles & live score',
  'Export (copy & download)',
  'Test checklist passed',
];

const CAPABILITIES = [
  'JD skill extraction (deterministic)',
  'Round mapping engine',
  '7-day prep plan',
  'Interactive readiness scoring',
  'History persistence',
];

export default function Proof() {
  const [submission, setSubmission] = useState(() => getProofSubmission());
  const [copyFeedback, setCopyFeedback] = useState('');
  const [errors, setErrors] = useState({ lovableUrl: '', githubUrl: '', deployedUrl: '' });

  useEffect(() => {
    setSubmission(getProofSubmission());
  }, []);

  function handleStepToggle(index, value) {
    setProofStep(index, value);
    setSubmission(getProofSubmission());
  }

  function handleLinkChange(field, value) {
    const next = { ...submission, [field]: value };
    setProofSubmission(next);
    setSubmission(getProofSubmission());
    const result = validateUrl(value);
    setErrors((e) => ({ ...e, [field]: result.valid ? '' : (result.message || '') }));
  }

  function handleCopyFinalSubmission() {
    const { lovableUrl, githubUrl, deployedUrl } = getProofSubmission();
    const lines = [
      '------------------------------------------',
      'Placement Readiness Platform — Final Submission',
      '',
      'Lovable Project: ' + (lovableUrl || '(not set)'),
      'GitHub Repository: ' + (githubUrl || '(not set)'),
      'Live Deployment: ' + (deployedUrl || '(not set)'),
      '',
      'Core Capabilities:',
      ...CAPABILITIES.map((c) => '- ' + c),
      '------------------------------------------',
    ];
    const text = lines.join('\n');
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyFeedback('Copied to clipboard.');
        setTimeout(() => setCopyFeedback(''), 2500);
      },
      () => setCopyFeedback('Copy failed.')
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="text-sm font-medium text-primary hover:underline">← Home</Link>
          <Link to="/prp/07-test" className="text-sm font-medium text-slate-600 hover:underline">Test checklist</Link>
          <Link to="/prp/08-ship" className="text-sm font-medium text-slate-600 hover:underline">Ship</Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" strokeWidth={2} />
              Build proof
            </CardTitle>
            <CardDescription>Complete steps and add artifact links. Required for Shipped status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="font-semibold text-slate-900 mb-3">Step completion overview</h3>
              <ul className="space-y-2">
                {STEP_LABELS.map((label, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`step-${index}`}
                      checked={submission.steps[index] ?? false}
                      onChange={(e) => handleStepToggle(index, e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`step-${index}`} className="text-sm font-medium text-slate-700 cursor-pointer">
                      {submission.steps[index] ? 'Completed' : 'Pending'} — {label}
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-primary" strokeWidth={2} />
                Artifact inputs (required for Ship status)
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="lovableUrl" className="block text-sm font-medium text-slate-700 mb-1">
                    Lovable Project Link
                  </label>
                  <input
                    id="lovableUrl"
                    type="url"
                    value={submission.lovableUrl}
                    onChange={(e) => handleLinkChange('lovableUrl', e.target.value)}
                    onBlur={() => {
                      const r = validateUrl(submission.lovableUrl);
                      setErrors((e) => ({ ...e, lovableUrl: r.valid ? '' : (r.message || '') }));
                    }}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  {errors.lovableUrl && <p className="text-sm text-red-600 mt-1">{errors.lovableUrl}</p>}
                </div>
                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-700 mb-1">
                    GitHub Repository Link
                  </label>
                  <input
                    id="githubUrl"
                    type="url"
                    value={submission.githubUrl}
                    onChange={(e) => handleLinkChange('githubUrl', e.target.value)}
                    onBlur={() => {
                      const r = validateUrl(submission.githubUrl);
                      setErrors((e) => ({ ...e, githubUrl: r.valid ? '' : (r.message || '') }));
                    }}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  {errors.githubUrl && <p className="text-sm text-red-600 mt-1">{errors.githubUrl}</p>}
                </div>
                <div>
                  <label htmlFor="deployedUrl" className="block text-sm font-medium text-slate-700 mb-1">
                    Deployed URL
                  </label>
                  <input
                    id="deployedUrl"
                    type="url"
                    value={submission.deployedUrl}
                    onChange={(e) => handleLinkChange('deployedUrl', e.target.value)}
                    onBlur={() => {
                      const r = validateUrl(submission.deployedUrl);
                      setErrors((e) => ({ ...e, deployedUrl: r.valid ? '' : (r.message || '') }));
                    }}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  {errors.deployedUrl && <p className="text-sm text-red-600 mt-1">{errors.deployedUrl}</p>}
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-slate-900 mb-2">Final submission export</h3>
              <button
                type="button"
                onClick={handleCopyFinalSubmission}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-primary hover:opacity-90 transition-opacity"
              >
                Copy Final Submission
              </button>
              {copyFeedback && <span className="ml-3 text-sm text-slate-600">{copyFeedback}</span>}
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

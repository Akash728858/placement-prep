import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { getTestSummary } from '../utils/testChecklistStorage';
import { getProofSubmission, isShipped } from '../utils/proofStorage';
import { Lock, Rocket } from 'lucide-react';

export default function Ship() {
  const [testSummary, setTestSummary] = useState(() => getTestSummary());
  const [proofSubmission, setProofSubmission] = useState(() => getProofSubmission());

  useEffect(() => {
    setTestSummary(getTestSummary());
    setProofSubmission(getProofSubmission());
  }, []);

  const shipped = isShipped(testSummary, proofSubmission);
  const testsPassed = testSummary.allPassed;
  const stepsComplete = proofSubmission.steps.length >= 8 && proofSubmission.steps.every(Boolean);
  const linksComplete =
    proofSubmission.lovableUrl &&
    proofSubmission.githubUrl &&
    proofSubmission.deployedUrl;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="text-sm font-medium text-primary hover:underline">← Home</Link>
          <Link to="/prp/07-test" className="text-sm font-medium text-slate-600 hover:underline">Test checklist</Link>
          <Link to="/prp/proof" className="text-sm font-medium text-slate-600 hover:underline">Proof</Link>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
              shipped ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {shipped ? 'Shipped' : 'In Progress'}
          </span>
        </div>

        {shipped ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Rocket className="w-5 h-5 text-primary" strokeWidth={2} />
                  Shipped
                </CardTitle>
                <CardDescription>All conditions met. This is your proof of work.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  You built a real product.<br />
                  Not a tutorial. Not a clone.<br />
                  A structured tool that solves a real problem.
                </p>
                <p className="font-semibold text-slate-900">
                  This is your proof of work.
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Lock className="w-5 h-5 text-slate-500" strokeWidth={2} />
                In Progress
              </CardTitle>
              <CardDescription>
                Status becomes &quot;Shipped&quot; only when: all 8 proof steps completed, all 10 tests passed, and all 3 artifact links provided.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-slate-700 space-y-1">
                <li>{testsPassed ? '✓' : '○'} Test checklist: {testSummary.passed} / {testSummary.total} passed</li>
                <li>{stepsComplete ? '✓' : '○'} Proof steps: {proofSubmission.steps.filter(Boolean).length} / 8 completed</li>
                <li>{linksComplete ? '✓' : '○'} Artifact links: Lovable, GitHub, Deployed URL</li>
              </ul>
              <div className="flex gap-2 pt-2">
                <Link
                  to="/prp/07-test"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50"
                >
                  Test checklist
                </Link>
                <Link
                  to="/prp/proof"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white bg-primary hover:opacity-90"
                >
                  Proof & links
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

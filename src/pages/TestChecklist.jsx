import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { getTestChecklist, setTestChecked, resetTestChecklist, getTestSummary } from '../utils/testChecklistStorage';
import { CheckSquare, AlertTriangle, RotateCcw } from 'lucide-react';

const TESTS = [
  { label: 'JD required validation works', hint: 'Submit Analyze with empty JD; you must see an error and analysis must not run.' },
  { label: 'Short JD warning shows for <200 chars', hint: 'Paste 1–199 characters in JD; the amber warning about short JD should appear.' },
  { label: 'Skills extraction groups correctly', hint: 'Analyze a JD with DSA, React, SQL; Results should show skills under Core CS, Web, Data (or similar).' },
  { label: 'Round mapping changes based on company + skills', hint: 'Analyze with company "Infosys" + DSA in JD vs company "Startup" + React; round mapping sections should differ.' },
  { label: 'Score calculation is deterministic', hint: 'Run the same JD + company + role twice; base score on Results should be identical.' },
  { label: 'Skill toggles update score live', hint: 'On Results, change a skill to "I know this"; the readiness score circle should increase within a second.' },
  { label: 'Changes persist after refresh', hint: 'Toggle a few skills, refresh the page, reopen the same result from History; toggles and score should match.' },
  { label: 'History saves and loads correctly', hint: 'Run an analysis, open History; the entry appears with date, company, role, score. Click it to open Results.' },
  { label: 'Export buttons copy the correct content', hint: 'Use Copy 7-day plan, Copy round checklist, Copy 10 questions; paste in a text editor and confirm content matches.' },
  { label: 'No console errors on core pages', hint: 'Open Dashboard, Analyze, Results, History; DevTools Console should show no red errors.' },
];

export default function TestChecklist() {
  const [checks, setChecks] = useState(() => getTestChecklist());

  useEffect(() => {
    setChecks(getTestChecklist());
  }, []);

  const summary = getTestSummary();

  function handleToggle(index, value) {
    setTestChecked(index, value);
    setChecks(getTestChecklist());
  }

  function handleReset() {
    resetTestChecklist();
    setChecks(getTestChecklist());
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="text-sm font-medium text-primary hover:underline">← Home</Link>
          <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:underline">Dashboard</Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" strokeWidth={2} />
              Test checklist
            </CardTitle>
            <CardDescription>Verify placement readiness flows. Checklist is stored in localStorage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
              <span className="font-semibold text-slate-900">Tests passed: {summary.passed} / {summary.total}</span>
              {!summary.allPassed && (
                <p className="text-sm text-amber-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                  Fix issues before shipping.
                </p>
              )}
            </div>

            <ul className="space-y-3">
              {TESTS.map((test, index) => (
                <li key={index} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                  <label className="flex items-start gap-3 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={checks[index] ?? false}
                      onChange={(e) => handleToggle(index, e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <div className="min-w-0">
                      <span className="font-medium text-slate-900">{test.label}</span>
                      {test.hint && (
                        <p className="text-sm text-slate-500 mt-1">How to test: {test.hint}</p>
                      )}
                    </div>
                  </label>
                </li>
              ))}
            </ul>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" strokeWidth={2} />
                Reset checklist
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <Link
                to="/prp/08-ship"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white bg-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
                style={summary.allPassed ? {} : { opacity: 0.7 }}
              >
                Go to Ship
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

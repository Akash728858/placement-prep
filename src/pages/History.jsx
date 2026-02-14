import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { getAnalyses } from '../utils/storage';
import { Clock, ChevronRight } from 'lucide-react';

function formatDate(value) {
  try {
    if (value == null || value === '') return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '—';
  }
}

export default function History() {
  const location = useLocation();
  const [entries, setEntries] = useState([]);

  const [skippedCount, setSkippedCount] = useState(0);

  useEffect(() => {
    try {
      const { list, skippedCount: skipped } = getAnalyses();
      setEntries(Array.isArray(list) ? list : []);
      setSkippedCount(skipped ?? 0);
    } catch {
      setEntries([]);
      setSkippedCount(0);
    }
  }, [location.pathname]);

  const safeEntries = Array.isArray(entries) ? entries.filter((e) => e && e.id != null) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analysis history</h1>
        <p className="text-slate-600">Past JD analyses. Click one to view full results.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" strokeWidth={2} />
            Saved analyses
          </CardTitle>
          <CardDescription>Stored in this browser (localStorage). Persists after refresh.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {skippedCount > 0 && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              One saved entry couldn&apos;t be loaded. Create a new analysis.
            </p>
          )}
          {safeEntries.length === 0 ? (
            <div className="py-12 text-center text-slate-600">
              <p className="mb-4">No analyses yet.</p>
              <Link
                to="/dashboard/analyze"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white bg-primary hover:opacity-90"
              >
                Analyze a JD
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {safeEntries.map((e) => (
                <li key={String(e.id)}>
                  <Link
                    to={`/dashboard/results?id=${encodeURIComponent(String(e.id))}`}
                    className="flex items-center justify-between py-4 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {String(e.company ?? '').trim() || 'No company'}
                        {e.role ? ` · ${String(e.role)}` : ''}
                      </p>
                      <p className="text-sm text-slate-500">{formatDate(e.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                        {Number(e.readinessScore) || 0}/100
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

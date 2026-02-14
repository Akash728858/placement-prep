import { Link } from 'react-router-dom';
import { Code2, Video, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Ace Your Placement
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-xl">
          Practice, assess, and prepare for your dream job
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-white bg-primary hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </section>

      {/* Features grid */}
      <section className="px-6 py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Code2 className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Practice Problems</h3>
            <p className="text-slate-600 text-sm">
              Solve curated problems and build coding fluency.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Video className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Mock Interviews</h3>
            <p className="text-slate-600 text-sm">
              Simulate real interviews with timed practice sessions.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <BarChart3 className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Track Progress</h3>
            <p className="text-slate-600 text-sm">
              See your strengths and areas to improve over time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-slate-500 text-sm border-t border-slate-200">
        © {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.
      </footer>
    </div>
  );
}

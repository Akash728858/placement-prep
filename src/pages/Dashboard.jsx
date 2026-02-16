import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, FileSearch } from 'lucide-react';

const READINESS_SCORE = 72;
const READINESS_MAX = 100;
const circumference = 2 * Math.PI * 45;
const strokeDashoffset = circumference - (READINESS_SCORE / READINESS_MAX) * circumference;

const skillData = [
  { subject: 'DSA', value: 75, fullMark: 100 },
  { subject: 'System Design', value: 60, fullMark: 100 },
  { subject: 'Communication', value: 80, fullMark: 100 },
  { subject: 'Resume', value: 85, fullMark: 100 },
  { subject: 'Aptitude', value: 70, fullMark: 100 },
];

const weeklyDays = [
  { label: 'Mon', active: true },
  { label: 'Tue', active: true },
  { label: 'Wed', active: false },
  { label: 'Thu', active: true },
  { label: 'Fri', active: true },
  { label: 'Sat', active: true },
  { label: 'Sun', active: false },
];

const upcomingAssessments = [
  { title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', time: 'Wed, 2:00 PM' },
  { title: 'HR Interview Prep', time: 'Friday, 11:00 AM' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Your placement readiness at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Analyze JD - entry point */}
        <Card className="md:col-span-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileSearch className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Analyze a job description</h3>
                  <p className="text-sm text-slate-600">Paste a JD to get readiness score, skill breakdown, and a 7-day plan.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/dashboard/analyze"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-white bg-primary hover:opacity-90 transition-opacity"
                >
                  Analyze JD
                </Link>
                <Link
                  to="/dashboard/history"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  History
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Readiness */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
            <CardDescription>Your current readiness score</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-44 h-44">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="text-primary transition-[stroke-dashoffset] duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">
                  {READINESS_SCORE}
                  <span className="text-lg font-medium text-slate-500">/{READINESS_MAX}</span>
                </span>
                <span className="text-sm text-slate-500 mt-0.5">Readiness Score</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
            <CardDescription>Scores across key areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillData}>
                  <PolarGrid stroke="hsl(215 20% 90%)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'hsl(215 16% 47%)', fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: 'hsl(215 16% 47%)', fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#8B0000"
                    fill="#8B0000"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Continue Practice */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Practice</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-slate-900 mb-3">Dynamic Programming</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Progress</span>
                <span>3/10 completed</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: '30%' }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link
              to="/dashboard/practice"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Link>
          </CardFooter>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
            <CardDescription>Problems solved this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Problems Solved</span>
                <span className="font-medium text-slate-900">12/20 this week</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: '60%' }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              {weeklyDays.map((day) => (
                <div
                  key={day.label}
                  className="flex flex-col items-center gap-1.5 flex-1"
                >
                  <div
                    className={`w-8 h-8 rounded-full ${
                      day.active ? 'bg-primary' : 'bg-slate-200'
                    }`}
                  />
                  <span className="text-xs text-slate-500">{day.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assessments - span full width on 2-col grid */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
            <CardDescription>Next scheduled assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-slate-100">
              {upcomingAssessments.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

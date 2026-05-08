import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { RUBRIC, ALL_CRITERIA_IDS } from './rubric';
import { AllAssessments, AssessmentData, StudentScores } from './types';
import { calcSectionResults } from './scoring';
import { exportCSV, exportJSON } from './export';
import Header from './components/Header';
import SectionCard from './components/SectionCard';
import ScoreSummary from './components/ScoreSummary';

const STORAGE_KEY = 'osce_assessments_v1';
const TODAY = new Date().toISOString().slice(0, 10);

function emptyScores(): StudentScores {
  return Object.fromEntries(ALL_CRITERIA_IDS.map(id => [id, 0]));
}

function loadAssessments(): AllAssessments {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAssessments(data: AllAssessments): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function App() {
  const [allAssessments, setAllAssessments] = useState<AllAssessments>(loadAssessments);
  const [studentId, setStudentId] = useState(1);
  const [date, setDate] = useState(TODAY);
  const [assessorName, setAssessorName] = useState('');

  const currentAssessment: AssessmentData = allAssessments[studentId] ?? {
    studentId,
    studentName: `Student ${studentId}`,
    date,
    assessorName,
    scores: emptyScores(),
  };

  const scores = currentAssessment.scores;

  const updateAssessment = useCallback(
    (patch: Partial<AssessmentData>) => {
      setAllAssessments(prev => {
        const existing: AssessmentData = prev[studentId] ?? {
          studentId,
          studentName: `Student ${studentId}`,
          date,
          assessorName,
          scores: emptyScores(),
        };
        const updated: AllAssessments = {
          ...prev,
          [studentId]: { ...existing, ...patch },
        };
        saveAssessments(updated);
        return updated;
      });
    },
    [studentId, date, assessorName]
  );

  // Sync date/assessor from stored data when student changes
  useEffect(() => {
    const stored = allAssessments[studentId];
    if (stored) {
      setDate(stored.date);
      setAssessorName(stored.assessorName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const handleScore = useCallback(
    (criterionId: string, value: number) => {
      updateAssessment({ scores: { ...scores, [criterionId]: value } });
    },
    [scores, updateAssessment]
  );

  const handleDateChange = (d: string) => {
    setDate(d);
    updateAssessment({ date: d });
  };

  const handleAssessorChange = (n: string) => {
    setAssessorName(n);
    updateAssessment({ assessorName: n });
  };

  const handleStudentChange = (id: number) => {
    setStudentId(id);
  };

  const handleClearScores = () => {
    if (window.confirm(`Clear all scores for Student ${studentId}?`)) {
      updateAssessment({ scores: emptyScores() });
    }
  };

  const handleExportCSV = () => {
    exportCSV({ ...currentAssessment, date, assessorName });
  };

  const handleExportJSON = () => {
    exportJSON({ ...currentAssessment, date, assessorName });
  };

  const sectionResults = calcSectionResults(scores);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <div className="bg-blue-800 text-white px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bold leading-tight">Paramedic OSCE Assessment</h1>
            <p className="text-xs text-blue-200">Week 1 — Primary &amp; Secondary Survey</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 py-4">
        {/* Header / metadata */}
        <Header
          studentId={studentId}
          studentName={currentAssessment.studentName}
          date={date}
          assessorName={assessorName}
          onStudentChange={handleStudentChange}
          onDateChange={handleDateChange}
          onAssessorChange={handleAssessorChange}
        />

        {/* Score summary bar */}
        <ScoreSummary
          results={sectionResults}
          scores={scores}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          onClearScores={handleClearScores}
        />

        {/* Section cards */}
        <div className="flex flex-col gap-3">
          {RUBRIC.map((section, i) => (
            <SectionCard
              key={section.id}
              section={section}
              result={sectionResults[i]}
              scores={scores}
              onScore={handleScore}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6 pb-4">
          The aim of the Week 1 OSCE is to familiarise the student with the primary and secondary survey and the OSCE process.
          Scores are saved automatically to local storage.
        </p>
      </div>
    </div>
  );
}

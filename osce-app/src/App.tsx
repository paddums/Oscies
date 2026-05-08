import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { RUBRIC, ALL_CRITERIA_IDS } from './rubric';
import { AllAssessments, AssessmentData, StudentScores } from './types';
import { calcSectionResults } from './scoring';
import { exportCSV, exportJSON, exportPDF } from './export';
import Header from './components/Header';
import SectionCard from './components/SectionCard';
import ScoreSummary from './components/ScoreSummary';

const STORAGE_KEY = 'osce_assessments_v2';
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

function makeKey(firstName: string, surname: string, payNumber: string): string {
  return `${payNumber}_${firstName}_${surname}`.toLowerCase().replace(/\s+/g, '');
}

export default function App() {
  const [allAssessments, setAllAssessments] = useState<AllAssessments>(loadAssessments);
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [payNumber, setPayNumber] = useState('');
  const [date, setDate] = useState(TODAY);
  const [assessorName, setAssessorName] = useState('');

  const studentKey = makeKey(firstName, surname, payNumber);

  const currentAssessment: AssessmentData = allAssessments[studentKey] ?? {
    firstName,
    surname,
    payNumber,
    date,
    assessorName,
    scores: emptyScores(),
  };

  const scores = currentAssessment.scores;

  const updateAssessment = useCallback(
    (patch: Partial<AssessmentData>) => {
      setAllAssessments(prev => {
        const key = makeKey(firstName, surname, payNumber);
        if (!key || key === '__') return prev;
        const existing: AssessmentData = prev[key] ?? {
          firstName,
          surname,
          payNumber,
          date,
          assessorName,
          scores: emptyScores(),
        };
        const updated: AllAssessments = {
          ...prev,
          [key]: { ...existing, ...patch },
        };
        saveAssessments(updated);
        return updated;
      });
    },
    [firstName, surname, payNumber, date, assessorName]
  );

  useEffect(() => {
    const key = makeKey(firstName, surname, payNumber);
    const stored = allAssessments[key];
    if (stored) {
      setDate(stored.date);
      setAssessorName(stored.assessorName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentKey]);

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

  const handleFirstNameChange = (v: string) => {
    setFirstName(v);
  };

  const handleSurnameChange = (v: string) => {
    setSurname(v);
  };

  const handlePayNumberChange = (v: string) => {
    setPayNumber(v);
  };

  const handleClearScores = () => {
    const name = `${firstName} ${surname}`.trim() || 'this student';
    if (window.confirm(`Clear all scores for ${name}?`)) {
      updateAssessment({ scores: emptyScores() });
    }
  };

  const getExportData = (): AssessmentData => ({
    ...currentAssessment,
    firstName,
    surname,
    payNumber,
    date,
    assessorName,
  });

  const handleExportCSV = () => exportCSV(getExportData());
  const handleExportJSON = () => exportJSON(getExportData());
  const handleExportPDF = () => exportPDF(getExportData());

  const sectionResults = calcSectionResults(scores);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <div className="bg-blue-800 text-white px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bold leading-tight">Paramedic OSCE Assessment</h1>
            <p className="text-xs text-blue-200">Week 1 \u2014 Primary &amp; Secondary Survey</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 py-4">
        <Header
          firstName={firstName}
          surname={surname}
          payNumber={payNumber}
          date={date}
          assessorName={assessorName}
          onFirstNameChange={handleFirstNameChange}
          onSurnameChange={handleSurnameChange}
          onPayNumberChange={handlePayNumberChange}
          onDateChange={handleDateChange}
          onAssessorChange={handleAssessorChange}
        />

        <ScoreSummary
          results={sectionResults}
          scores={scores}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          onExportPDF={handleExportPDF}
          onClearScores={handleClearScores}
        />

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

        <p className="text-center text-xs text-gray-400 mt-6 pb-4">
          The aim of the Week 1 OSCE is to familiarise the student with the primary and secondary survey and the OSCE process.
          Scores are saved automatically to local storage.
        </p>
      </div>
    </div>
  );
}

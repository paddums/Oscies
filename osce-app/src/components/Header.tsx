import React from 'react';

interface Props {
  studentId: number;
  studentName: string;
  date: string;
  assessorName: string;
  onStudentChange: (id: number) => void;
  onDateChange: (d: string) => void;
  onAssessorChange: (n: string) => void;
}

const STUDENT_COUNT = 36;

export default function Header({
  studentId,
  studentName,
  date,
  assessorName,
  onStudentChange,
  onDateChange,
  onAssessorChange,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Student selector */}
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Student
          </label>
          <select
            value={studentId}
            onChange={e => onStudentChange(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: STUDENT_COUNT }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>
                Student {n}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="flex-1 min-w-36">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={e => onDateChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Assessor */}
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Assessor
          </label>
          <input
            type="text"
            value={assessorName}
            placeholder="Assessor name"
            onChange={e => onAssessorChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

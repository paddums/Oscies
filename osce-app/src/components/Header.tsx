import React from 'react';

interface Props {
  firstName: string;
  surname: string;
  payNumber: string;
  date: string;
  assessorName: string;
  onFirstNameChange: (v: string) => void;
  onSurnameChange: (v: string) => void;
  onPayNumberChange: (v: string) => void;
  onDateChange: (d: string) => void;
  onAssessorChange: (n: string) => void;
}

export default function Header({
  firstName,
  surname,
  payNumber,
  date,
  assessorName,
  onFirstNameChange,
  onSurnameChange,
  onPayNumberChange,
  onDateChange,
  onAssessorChange,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* First Name */}
        <div className="flex-1 min-w-36">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            placeholder="First name"
            onChange={e => onFirstNameChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Surname */}
        <div className="flex-1 min-w-36">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Surname
          </label>
          <input
            type="text"
            value={surname}
            placeholder="Surname"
            onChange={e => onSurnameChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Pay Number */}
        <div className="flex-1 min-w-32">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Pay Number
          </label>
          <input
            type="text"
            value={payNumber}
            placeholder="Pay number"
            onChange={e => onPayNumberChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

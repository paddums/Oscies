export type ScoreType = '0/1' | '0/1/2';

export interface CriterionDef {
  id: string;
  label: string;
  scoreType: ScoreType;
}

export interface SubsectionDef {
  id: string;
  label: string;
  criteria: CriterionDef[];
}

export interface SectionDef {
  id: string;
  label: string;
  /** Weight as a percentage of the final score (null = unweighted / pass-fail) */
  weight: number | null;
  subsections: SubsectionDef[];
  /** colour theme for the section header */
  color: 'blue' | 'teal' | 'orange' | 'brown' | 'green';
}

export const RUBRIC: SectionDef[] = [
  {
    id: 'primary',
    label: 'Primary Survey',
    weight: 20,
    color: 'blue',
    subsections: [
      {
        id: 'scene_safety',
        label: 'Scene Safety',
        criteria: [
          { id: 'infection_control', label: 'Infection control precautions', scoreType: '0/1' },
          { id: 'scene_survey', label: 'Scene survey: identify chief complaint / MOI', scoreType: '0/1' },
          { id: 'catastrophic_haem', label: 'Identify catastrophic haemorrhage / C-spine intervention', scoreType: '0/1' },
        ],
      },
      {
        id: 'airway',
        label: 'Airway',
        criteria: [
          { id: 'airway_inspection', label: 'Airway inspection + intervention (OPA/NPA/suction)', scoreType: '0/1/2' },
        ],
      },
      {
        id: 'breathing',
        label: 'Breathing',
        criteria: [
          { id: 'breathing_assessed', label: 'Breathing assessed and intervention', scoreType: '0/1/2' },
          { id: 'auscultation', label: 'Auscultation', scoreType: '0/1/2' },
        ],
      },
      {
        id: 'circulation',
        label: 'Circulation',
        criteria: [
          { id: 'peripheral_pulses', label: 'Assess peripheral and/or central pulses', scoreType: '0/1/2' },
          { id: 'skin_colour_temp', label: 'Check for skin colour and temperature', scoreType: '0/1/2' },
        ],
      },
      {
        id: 'disability',
        label: 'Disability',
        criteria: [
          { id: 'avpu', label: 'Assess level of consciousness (AVPU)', scoreType: '0/1' },
          { id: 'pearrl', label: 'Assess PEARRL', scoreType: '0/1/2' },
        ],
      },
      {
        id: 'expose',
        label: 'Expose',
        criteria: [
          { id: 'expose_examine', label: 'Expose and examine: check for medicalert/rashes', scoreType: '0/1/2' },
          { id: 'clinical_status', label: 'Clinical Status Decision / ALS', scoreType: '0/1/2' },
        ],
      },
    ],
  },
  {
    id: 'secondary',
    label: 'Secondary Survey',
    weight: 14,
    color: 'teal',
    subsections: [
      {
        id: 'vitals',
        label: 'Vitals',
        criteria: [
          { id: 'breathing_rate', label: 'Assess breathing (rate / depth / effort)', scoreType: '0/1/2' },
          { id: 'spo2', label: 'Determine SpO2', scoreType: '0/1' },
          { id: 'pulse', label: 'Assess pulse (rate / rhythm / regularity)', scoreType: '0/1' },
          { id: 'blood_pressure', label: 'Determine blood pressure', scoreType: '0/1/2' },
          { id: 'ecg', label: 'ECG monitoring / 12-Lead ECG (verbalise)', scoreType: '0/1/2' },
          { id: 'temperature', label: 'Determine temperature', scoreType: '0/1' },
          { id: 'bgl', label: 'Determine blood glucose measurement', scoreType: '0/1' },
        ],
      },
      {
        id: 'sample',
        label: 'SAMPLE',
        criteria: [
          { id: 'assess_sample', label: 'Assess SAMPLE', scoreType: '0/1/2' },
        ],
      },
      {
        id: 'opqrst',
        label: 'OPQRST',
        criteria: [
          { id: 'assess_opqrst', label: 'Assess OPQRST', scoreType: '0/1/2' },
        ],
      },
    ],
  },
  {
    id: 'care_plan',
    label: 'Care Plan and Differential Diagnosis',
    weight: 5,
    color: 'orange',
    subsections: [
      {
        id: 'care_plan_items',
        label: '',
        criteria: [
          { id: 'oxygen', label: 'Consider / administer oxygen if appropriate', scoreType: '0/1/2' },
          { id: 'communicate', label: 'Communicate with the patient', scoreType: '0/1' },
          { id: 'reassess_vitals_item', label: 'Reassess vital signs', scoreType: '0/1/2' },
        ],
      },
    ],
  },
  {
    id: 'reassess',
    label: 'Reassess',
    weight: 1,
    color: 'green',
    subsections: [
      {
        id: 'reassess_items',
        label: '',
        criteria: [
          { id: 'reassess_score', label: 'Reassess vital signs (documented)', scoreType: '0/1' },
        ],
      },
    ],
  },
  {
    id: 'transport',
    label: 'Transport',
    weight: null,
    color: 'brown',
    subsections: [
      {
        id: 'transport_items',
        label: '',
        criteria: [
          { id: 'packaging', label: 'Packaging / extrication / transport plan / pre-alert', scoreType: '0/1' },
        ],
      },
    ],
  },
];

/** Maximum raw score for a section */
export function sectionMax(section: SectionDef): number {
  return section.subsections.reduce((total, sub) => {
    return total + sub.criteria.reduce((t, c) => t + (c.scoreType === '0/1/2' ? 2 : 1), 0);
  }, 0);
}

export const ALL_CRITERIA_IDS: string[] = RUBRIC.flatMap(s =>
  s.subsections.flatMap(sub => sub.criteria.map(c => c.id))
);

export interface StudentScores {
  [criterionId: string]: number;
}

export interface AssessmentData {
  studentId: number;
  studentName: string;
  date: string;
  assessorName: string;
  scores: StudentScores;
}

export type AllAssessments = {
  [studentId: number]: AssessmentData;
};

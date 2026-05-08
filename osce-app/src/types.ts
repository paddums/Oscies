export interface StudentScores {
  [criterionId: string]: number;
}

export interface AssessmentData {
  firstName: string;
  surname: string;
  payNumber: string;
  date: string;
  assessorName: string;
  scores: StudentScores;
}

export type AllAssessments = {
  [payNumber: string]: AssessmentData;
};

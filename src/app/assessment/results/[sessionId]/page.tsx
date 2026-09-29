import { redirect } from 'next/navigation';

interface AssessmentResultsRedirectPageProps {
  params: {
    sessionId: string;
  };
}

export default function AssessmentResultsRedirectPage({ params }: AssessmentResultsRedirectPageProps) {
  redirect(`/assessments/results/${encodeURIComponent(params.sessionId)}`);
}

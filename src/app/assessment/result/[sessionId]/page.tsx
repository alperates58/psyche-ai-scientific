import { redirect } from 'next/navigation';

interface AssessmentResultRedirectPageProps {
  params: {
    sessionId: string;
  };
}

export default function AssessmentResultRedirectPage({ params }: AssessmentResultRedirectPageProps) {
  redirect(`/assessments/results/${encodeURIComponent(params.sessionId)}`);
}

import Chatbot from '../components/Chatbot';
import { useOnboarding } from '../hooks/useOnboarding';

export default function Assistant() {
  const { application } = useOnboarding();
  return (
    <div className="mx-auto max-w-3xl">
      <Chatbot currentStep={application?.currentStep ?? 0} />
    </div>
  );
}

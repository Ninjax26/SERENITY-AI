import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getEnvWarnings } from '@/lib/env';

const EnvWarning = () => {
  const warnings = getEnvWarnings();
  if (warnings.length === 0) return null;

  return (
    <div className="px-4 pt-4">
      <Alert variant="destructive" className="max-w-4xl mx-auto">
        <AlertTitle>Configuration required</AlertTitle>
        <AlertDescription>
          <p className="mb-2">Copy <code>.env.example</code> to <code>.env</code> and set these values:</p>
          <ul className="list-disc pl-5 space-y-1">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EnvWarning;

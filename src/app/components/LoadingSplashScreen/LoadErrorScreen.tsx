import { FallbackProps } from 'react-error-boundary';

import BareBoneStatusPage from './BareBoneStatusPage';

const LoadErrorScreen: React.ComponentType<FallbackProps> = ({
  error,
}: FallbackProps) => (
  <BareBoneStatusPage>
    <div className="m-4 flex flex-col gap-4 font-sans">
      <h2>Oops, something went wrong...</h2>
      <p>
        We&apos;re sorry for the inconvenience. Please try reloading the page,
        or contact our support if the problem persists.
      </p>
      {error && (
        <details>
          <summary>Error details</summary>
          <pre>
            {error instanceof Error ? error.message : 'Unknown error occured'}
          </pre>
        </details>
      )}
    </div>
  </BareBoneStatusPage>
);

export default LoadErrorScreen;

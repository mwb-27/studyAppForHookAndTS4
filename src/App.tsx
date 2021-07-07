import React, { Suspense } from "react";
import "./App.css";
import { useAuth } from "context/auth-context";
import { ErrorBoundary } from "components/error-boundary";
import { FullPageErrorFallback } from "components/lib";
const AuthenticatedApp = React.lazy(() => import("authenticated-app"));
const UnauthenticatedApp = React.lazy(() => import("unauthenticated-app"));

function App() {
  const { user } = useAuth();
  // change user.email test1
  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FullPageErrorFallback}>
        <Suspense fallback={<div>loading...</div>}>
          {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;

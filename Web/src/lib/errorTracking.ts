export interface ErrorContext {
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export function logError(error: unknown, context?: ErrorContext): void {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Used for production error tracking
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const errorInfo = {
    message: errorObj.message,
    stack: errorObj.stack,
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', context?.component ? `[${context.component}]` : '', context?.action ? `(${context.action})` : '', error);
    if (context?.metadata) {
      console.error('[Error Metadata]', context.metadata);
    }
  }

  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(errorObj, { extra: errorInfo });
  }
}

export function logErrorBoundary(error: Error, errorInfo: { componentStack?: string | null }): void {
  logError(error, {
    component: 'ErrorBoundary',
    metadata: { componentStack: errorInfo.componentStack ?? undefined },
  });
}

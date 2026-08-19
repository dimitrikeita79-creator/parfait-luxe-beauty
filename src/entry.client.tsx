import { createRoot } from 'react-dom/client';
import { getRouter } from '@/router';
import { RouterProvider } from '@tanstack/react-router';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.innerHTML = '';
  try {
    const router = getRouter();
    createRoot(rootElement).render(
      <ErrorBoundary
        fallback={
          <div style={{ padding: 20, color: 'red' }}>
            <h1>Erreur application</h1>
            <p>L'application a rencontré une erreur. Fermez et rouvrez l'application.</p>
          </div>
        }
      >
        <RouterProvider router={router as any} />
      </ErrorBoundary>
    );
  } catch (e: any) {
    console.error('[entry.client] router init failed:', e);
    rootElement.innerHTML = '<div style="padding:20px;color:red;"><h1>Erreur routeur</h1><pre>' + (e && e.message ? e.message : String(e)) + '</pre></div>';
  }
} else {
  console.warn('[entry.client] missing rootElement');
}

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('[entry.client] global error:', event.error);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[entry.client] unhandled rejection:', event.reason);
  });
}

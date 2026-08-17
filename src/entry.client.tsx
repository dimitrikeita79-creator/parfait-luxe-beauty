import { createRoot } from 'react-dom/client';
import { createAppRouter } from '@/router';
import { RouterProvider } from '@tanstack/react-router';

console.log('[entry.client] script loaded');

let router;
try {
  console.log('[entry.client] creating router...');
  router = createAppRouter();
  console.log('[entry.client] router created');
} catch (e: any) {
  console.error('[entry.client] createAppRouter failed:', e);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = '<div style="padding:20px;color:red;"><h1>Erreur routeur</h1><pre>' + (e && e.message ? e.message : String(e)) + '</pre></div>';
  }
}

const rootElement = document.getElementById('root');
if (rootElement && router) {
  rootElement.innerHTML = '';
  createRoot(rootElement).render(
    <RouterProvider router={router} />
  );
  console.log('[entry.client] rendered');
} else {
  console.warn('[entry.client] missing rootElement or router');
}

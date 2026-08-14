var r,s=5e3;function n(e){r={error:e,at:Date.now()}}typeof globalThis.addEventListener=="function"&&(globalThis.addEventListener("error",e=>n(e.error??e)),globalThis.addEventListener("unhandledrejection",e=>n(e.reason)));function c(){if(!r)return;if(Date.now()-r.at>s){r=void 0;return}const{error:e}=r;return r=void 0,e}function o(){return`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`}var a;async function l(){return a||(a=import("./assets/server-7FcZ1Eqh.js").then(e=>e.default??e)),a}async function u(e){if(e.status<500||!(e.headers.get("content-type")??"").includes("application/json"))return e;const t=await e.clone().text();return!t.includes('"unhandled":true')||!t.includes('"message":"HTTPError"')?e:(console.error(c()??new Error(`h3 swallowed SSR error: ${t}`)),new Response(o(),{status:500,headers:{"content-type":"text/html; charset=utf-8"}}))}var h={async fetch(e,t,i){try{return await u(await(await l()).fetch(e,t,i))}catch(d){return console.error(d),new Response(o(),{status:500,headers:{"content-type":"text/html; charset=utf-8"}})}}};export{h as default,o as t};

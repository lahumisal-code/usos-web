# USOS Management Login

Responsive React + TypeScript login and password-reset frontend for the USOS Management system.

## Development setup

The frontend binds to port `8090` with strict port enforcement. A frontend and Spring Boot cannot both bind to `localhost:8090`; for local development, run Spring Boot on `8091` and let Vite proxy `/api` requests to it.

Authentication API calls, request bodies, and endpoint paths are centralized in `src/api/api.js`. The current paths are `/api/auth/login` and `/api/auth/forgot-password`; controller mappings were not available in this workspace, so verify these defaults against Spring Boot and edit that file if needed. Login sends `{ "emailId": "...", "password": "..." }`.

Install and start:

```sh
npm install
npm run dev
```

Run `npm run typecheck`, `npm run lint`, or `npm run build` for checks. Production deployments should route the configured API base path to Spring Boot in the web server/reverse proxy; Vite's development proxy is not included in the production bundle.

After a successful login, the page follows a same-origin relative `redirectUrl` returned by the backend when present. Without one, it confirms success in place because this focused frontend does not include a post-login application page. It does not persist a token or password.

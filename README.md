# React + TypeScript + Vite

Looper's Pomerium Zero Trust design, backend guards, RBAC, audit logging, approval workflow, MCP policies, and deployment checklist are documented in [security/README.md](security/README.md).

The Zero.xyz capability client, agent workflow, budgets, approvals, privacy controls, validation rules, demo scenarios, and architecture are documented in [docs/zero-integration.md](docs/zero-integration.md).

## AWS Cognito login through Pomerium

Looper uses the official AWS Amplify library for Cognito browser authentication.
The `/app` route restores the Cognito session, displays the sign-in challenge,
and supports logout. Backend authorization must still use the independently
verified Pomerium JWT; a browser Cognito session is not an API authorization
decision.

1. In Cognito, create a public user pool app client for the Vite SPA. Do not
   generate a client secret for this app client.
2. Copy `.env.example` to `.env` and set the user pool ID and public app client
   ID. Restart the Vite server after changing these values.
3. If Pomerium also delegates login to Cognito, create a separate confidential
   app client for Pomerium. Enable the authorization code grant and the
   `openid`, `email`, and `profile` scopes. Set its callback URL to
   `https://authenticate.looper.example.com/oauth2/callback` and its sign-out
   URL to `https://authenticate.looper.example.com/.pomerium/signed_out`.
4. Configure that Pomerium client with the values shown in
   [pomerium/cognito.example.yaml](pomerium/cognito.example.yaml). For a
   self-hosted Pomerium deployment, merge those identity-provider fields into
   `pomerium/config.yaml` and mount the client secret as a Docker secret.
5. Replace the example Looper domains with the real Pomerium route domains.

Use [pomerium/cognito.env.example](pomerium/cognito.env.example) as the list of
required identifiers. Do not put a Cognito client secret or Pomerium Zero token
in a Vite-prefixed environment variable or commit either value.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

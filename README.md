# Strapi Multilang

Community-packaged **Strapi 5.54.0**, with prebuilt administration and multiple
interface languages. Not an official Strapi image. No administrator or secret is
bundled. Initial support: Linux AMD64, PostgreSQL. This release deliberately keeps
the existing deployment's Strapi version; it is not the latest upstream release.

## 界面语言

English is retained automatically. Enabled languages: 简体中文 (`zh-Hans`), 繁體中文
(`zh`), 日本語, 한국어, français, Deutsch, español, português (Brasil), русский.
After registering, choose **Profile → Interface language → 中文 (简体)**. Community
translation coverage varies; untranslated strings may fall back to English.
Interface language is separate from content internationalization.

## Quick start

1. Clone this repository and install Node.js 22.13+ to run the secret generator.
2. Run `node scripts/generate-env.cjs`. It refuses to overwrite `.env`. Review
   `PUBLIC_URL`, database settings and secrets. Never publish `.env`.
3. Run `docker compose up -d` after the image package has been published publicly.
4. On the same machine, visit `http://localhost:1337/admin` and create your own
   administrator. For a remote machine use an SSH tunnel initially:
   `ssh -L 1337:127.0.0.1:1337 user@server`.

The example binds only loopback to prevent public first-admin registration.
Before public exposure configure HTTPS ingress, finish administrator registration,
and retain runtime secrets across redeployments. No default credentials exist.
Only enable `TRUST_PROXY=true` when the application is reachable exclusively via
your trusted reverse proxy. CORS is disabled by default for cross-origin callers;
configure explicit origins in `config/middlewares.js` for browser frontends.

For an existing PostgreSQL instance use a dedicated empty database and a login
with permissions only on that database. Do not connect to another application's
database. Remove the example postgres service/dependency and join the appropriate
private network. Never publish the database port. Use certificate-verified TLS
for remote databases (`DATABASE_SSL=true`, optional `DATABASE_SSL_CA`).

## Images and publishing

Image: `ghcr.io/stevenzxs/strapi-multilang:1.0.0` (available after successful release).
Main-branch commits and PRs run configuration and Docker/PostgreSQL smoke tests.
Pushing a `v1.0.0` tag builds, tests, then publishes through GitHub's short-lived
`GITHUB_TOKEN`. Set the GHCR package visibility to Public for anonymous pulls.
Production deployments should pin the resulting digest, not `latest`.

```sh
git tag v1.0.0
git push origin v1.0.0
```

Do not reuse version tags. Keep image release numbers separate from the bundled
Strapi version. This repository does not automatically deploy to production.

## Persistent storage and upgrades

Persist uploads, `.tmp` and the migrations directory; persist PostgreSQL data at
`/var/lib/postgresql` for PostgreSQL 18. Runtime user is **1001:1001**. Existing
volumes owned by a different UID need a reviewed ownership migration before use.
Do not run the application as root to work around permissions.

Back up database, uploads, application schemas and runtime secrets before changes;
keep off-host copies and test restoration. Database changes can make an image-only
rollback unsafe. Never use `docker compose down -v` on valued data.

Strapi content models ship as code. Production mode does not expose content-type
editing. Develop schemas locally and rebuild an application-specific image.
Adding admin plugins or changing enabled interface locales also requires rebuild.

## Verification and limitations

`npm test` runs dependency-free configuration checks. CI builds the real image and
checks PostgreSQL startup, health, first-admin state, Chinese assets, non-root UID,
upload-directory permissions and absence of `.env`. These are smoke tests, not a
complete browser, security or load audit. Review upstream advisories before public
production use. No load capacity or vulnerability-free guarantee is made.

## Licenses

See [NOTICE.md](NOTICE.md). Upstream packages retain their licenses. The packaging
code is provided under the MIT license; this does not relicense Strapi dependencies.

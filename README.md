# ts-app

A minimal TypeScript HTTP service with CI/CD pipelines, containerization, and automated tests.

The application exposes a single HTTP endpoint and always responds with:

> `Hi from TypeScript!`

------------------------------------------------------------------------

## What this application does

-   Written in **TypeScript**
-   Runs as a simple **Node.js HTTP server**
-   Listens on **port 8080**
-   Responds to any request with:

``` text
Hi from TypeScript!
```

------------------------------------------------------------------------

## Project structure

    .
    ├── src/
    │   └── index.ts              # Application
    ├── tests/
    │   ├── index.test.ts         # Unit tests (Jest)
    │   └── response.e2e.mjs      # Real E2E test against running container
    ├── .github/workflows/
    │   ├── ci.yml                # Main CI pipeline
    │   ├── labels.yml            # Label-driven workflows (verify / publish)
    │   └── release.yml           # Release automation
    ├── dockerfile                # Container image
    ├── eslint.config.mjs         # ESLint configuration
    ├── jest.config.js            # Jest configuration
    ├── tsconfig.json             # TypeScript configuration

------------------------------------------------------------------------

## Running locally

### Install dependencies

``` bash
npm ci
```

### Run in development mode

``` bash
npm run build
node dist/index.js
```

Then open:

    http://localhost:8080

Expected response:

    Hi from TypeScript!

------------------------------------------------------------------------

## Docker

### Build image locally

``` bash
docker build -t ts-app:local .
```

### Run container

``` bash
docker run -p 8080:8080 ts-app:local
```

Test:

``` bash
curl http://localhost:8080
# Hi from TypeScript!
```

------------------------------------------------------------------------

## CI pipeline overview

The main pipeline is defined in:

    .github/workflows/ci.yml

Jobs are partially parallelized.

------------------------------------------------------------------------

## E2E tests

This repo contains a real end-to-end test:

    tests/response.e2e.mjs

It starts the built Docker image in CI - Waits until the
service becomes available - Calls `http://127.0.0.1:8080` - Verifies the
exact response body - Fails the pipeline if behavior is incorrect

It could be ran locally against a running app:

``` bash
BASE_URL=http://127.0.0.1:8080 node tests/response.e2e.mjs
```

------------------------------------------------------------------------

## Label-driven workflows

### `verify` label

When a PR labeled with `verify`: - A separate workflow is
triggered - The Docker image for that PR commit is pulled from GHCR -
The E2E test runs against the real container

This guarantees that verification always tests the **exact image that
would be deployed**.

### `publish` label

When a PR labeled with `publish`: - Release workflow validates: -
Version bump in `package.json` - SemVer format - A prerelease is
generated automatically - Release notes are created

This allows controlled, explicit releases instead of accidental
deployments.

------------------------------------------------------------------------

## Container registry (GHCR)

Images are published to GitHub Container Registry:

    ghcr.io/<org>/<repo>:<version>-dev-<commit-short-sha>
    ghcr.io/<org>/<repo>:<version>
    ghcr.io/<org>/<repo>:latest

For example:

    ghcr.io/astognev-org/ts-app:1.0.8-dev-0fae59a6
    ghcr.io/astognev-org/ts-app:1.0.8
    ghcr.io/astognev-org/ts-app:latest

------------------------------------------------------------------------

## For developers

Standard workflow:

1.  Create feature branch
2.  Push commits → CI runs automatically
3.  Add label `verify` to PR → real container E2E validation
4.  Fix issues if any
5.  Add label `publish` when ready to release
6.  Merge after green checks

------------------------------------------------------------------------

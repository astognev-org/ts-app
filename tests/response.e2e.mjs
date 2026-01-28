// e2e/response.e2e.mjs
const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:8080";
const EXPECTED = process.env.EXPECTED_BODY || "Hi from TypeScript!";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForReady(url, attempts = 60) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.ok) return;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    await sleep(1000);
  }
  throw new Error(`App not ready at ${url}. Last error: ${lastErr?.message ?? "unknown"}`);
}

async function main() {
  await waitForReady(`${BASE_URL}/`);

  const res = await fetch(`${BASE_URL}/`, { redirect: "follow" });
  const text = (await res.text()).trim();

  if (!res.ok) {
    console.error(`E2E FAILED: HTTP ${res.status}\nBody:\n${text}`);
    process.exit(1);
  }

  if (text !== EXPECTED) {
    console.error(`E2E FAILED: unexpected response body
Expected: "${EXPECTED}"
Got:      "${text}"`);
    process.exit(1);
  }

  console.log(`E2E OK: "${text}"`);
}

main().catch((e) => {
  console.error(`E2E FAILED: ${e.stack || e.message}`);
  process.exit(1);
});

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("Node production deployment", { timeout: 60_000 }, async (t) => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const server = spawn(process.execPath, [".output/server/index.mjs"], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: "production",
      HOST: "127.0.0.1",
      PORT: "0",
      NITRO_HOST: "127.0.0.1",
      NITRO_PORT: "0",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  t.after(async () => {
    if (server.exitCode !== null || server.signalCode !== null) return;
    const exited = once(server, "exit");
    server.kill("SIGTERM");
    const force = setTimeout(() => server.kill("SIGKILL"), 5_000);
    await exited;
    clearTimeout(force);
  });
  let logs = "";
  const base = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Server did not start:\n${logs}`)), 20_000);
    server.once("error", (error) => { clearTimeout(timeout); reject(error); });
    server.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Server exited (${code}):\n${logs}`));
    });
    const onData = (chunk) => {
      logs += chunk.toString();
      const address = logs.match(/http:\/\/127\.0\.0\.1:\d+\//)?.[0];
      if (address) { clearTimeout(timeout); resolve(address); }
    };
    server.stdout.on("data", onData);
    server.stderr.on("data", onData);
  });
  const request = (path, options) => fetch(new URL(path, base), {
    ...options,
    signal: AbortSignal.timeout(10_000),
  });

  let html;
  await t.test("renders the homepage with security headers", async () => {
    const response = await request("/");
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.match(response.headers.get("content-security-policy"), /media-src[^;]*blob:/);
    html = await response.text();
    assert.match(html, /Antalya’da araç kiralama/);
    assert.match(html, /Pilot/);
  });
  await t.test("serves the homepage's built CSS and JavaScript", async () => {
    for (const extension of ["css", "js"]) {
      const asset = html.match(new RegExp(`(?:href|src)="([^" ]+\\.${extension})"`))?.[1];
      assert.ok(asset, `Missing ${extension} reference`);
      const response = await request(asset);
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), extension === "css" ? /text\/css/ : /javascript/);
      assert.ok((await response.text()).length > 0);
    }
  });
  const video = "/assets/world/scene-01.mp4";
  await t.test("serves MP4 byte ranges for video seeking", async () => {
    const response = await request(video, { headers: { Range: "bytes=0-1023" } });
    assert.equal(response.status, 206);
    assert.match(response.headers.get("content-type"), /video\/mp4/);
    assert.match(response.headers.get("content-range"), /^bytes 0-1023\/\d+$/);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.length, 1024);
    assert.equal(bytes.subarray(4, 8).toString(), "ftyp");
  });
  await t.test("supports video HEAD and suffix ranges", async () => {
    const head = await request(video, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.ok(Number(head.headers.get("content-length")) > 1024);
    assert.equal(await head.text(), "");
    const suffix = await request(video, { headers: { Range: "bytes=-256" } });
    assert.equal(suffix.status, 206);
    assert.equal((await suffix.arrayBuffer()).byteLength, 256);
  });
  await t.test("rejects an unsatisfiable video range", async () => {
    const response = await request(video, { headers: { Range: "bytes=999999999-" } });
    assert.equal(response.status, 416);
    await response.body?.cancel();
  });
  await t.test("does not serve private or missing files", async () => {
    for (const path of ["/assets/missing-pilot.mp4", "/package.json", "/.env"]) {
      const response = await request(path);
      assert.ok([403, 404].includes(response.status), `${path}: ${response.status}`);
      await response.body?.cancel();
    }
  });
});

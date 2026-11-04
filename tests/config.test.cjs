const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

test('admin configuration enables simplified Chinese without a rebuild at startup', () => {
  const text = fs.readFileSync('src/admin/app.js', 'utf8');
  assert.match(text, /zh-Hans/);
  assert.match(text, /ja/);
});

test('production entrypoint fails closed when configuration is missing', () => {
  const result = spawnSync(process.execPath, ['scripts/start.cjs'], {
    env: { PATH: process.env.PATH }, encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Missing required environment variables/);
});

test('proxy trust is opt-in and no deployment domain is embedded', () => {
  const text = fs.readFileSync('config/server.js', 'utf8');
  assert.match(text, /env.bool\('TRUST_PROXY', false\)/);
  assert.doesNotMatch(text, /stevenzxs\.cn/);
});

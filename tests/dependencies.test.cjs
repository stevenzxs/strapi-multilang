const test = require('node:test');
const assert = require('node:assert/strict');
const lock = require('../package-lock.json');

test('Strapi release packages use the application release, not mixed Auth contexts', () => {
  const expected = require('../package.json').dependencies['@strapi/strapi'];
  const admins = [];
  for (const [path, pkg] of Object.entries(lock.packages)) {
    if (!/(?:^|\/)node_modules\/@strapi\/[^/]+$/.test(path)) continue;
    // design-system, icons and ui-primitives have their own version scheme.
    if (pkg.version?.startsWith('5.')) {
      assert.equal(pkg.version, expected, `${path} must match Strapi ${expected}`);
    }
    if (path.endsWith('/@strapi/admin')) admins.push(path);
  }
  assert.deepEqual(admins, ['node_modules/@strapi/admin'], 'Auth must resolve to one admin package');
});

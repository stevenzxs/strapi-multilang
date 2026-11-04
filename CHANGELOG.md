# Changelog

## 1.0.1

- Pin the admin peer dependency and shared Strapi release modules to 5.54.0.
- Remove duplicate 5.60.0 admin and shared packages from the lockfile. Mixed
  admin packages could create independent Auth contexts and crash plugin pages
  with `useRBAC must be used within Auth`.
- Add a regression check requiring consistent Strapi release versions and a
  single admin package in the lockfile.

## 1.0.0

- Initial multilingual image. Superseded by 1.0.1 due to mixed admin dependencies.

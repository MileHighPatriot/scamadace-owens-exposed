#!/usr/bin/env bash
# Publish this Origin repo to a free Vercel Hobby project.
# Does not connect GitHub or Origin git. Code stays on Origin.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "Set VERCEL_TOKEN (https://vercel.com/account/tokens) and rerun." >&2
  exit 1
fi

node scripts/generate-pages.js
node scripts/generate-pages.js --check

npx --yes vercel@41 deploy \
  --prod \
  --yes \
  --name scamadace-owens-exposed \
  --token "$VERCEL_TOKEN"

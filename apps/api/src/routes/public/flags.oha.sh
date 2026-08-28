set -euo pipefail
unset NO_COLOR 2>/dev/null || true

CLIENT_ID="${1:?Usage: ./flags.oha.sh <clientId> [baseUrl]}"
BASE="${2:-https://api.datamate.cc}"
FLAGS_URL="$BASE/public/v1/flags"

header() { printf '\n\033[1;36m━━━ %s ━━━\033[0m\n\n' "$1"; }

if ! curl -sf "$FLAGS_URL/health" > /dev/null 2>&1; then
  echo "ERROR: $FLAGS_URL/health not reachable"
  echo "  For local: cd apps/api && bun run dev"
  exit 1
fi

echo "Server: $BASE"
echo "Client: $CLIENT_ID"
echo ""

# warmup — prime caches
curl -sf "$FLAGS_URL/bulk?clientId=$CLIENT_ID&userId=warmup" > /dev/null 2>&1 || true
curl -sf "$FLAGS_URL/bulk?clientId=$CLIENT_ID&userId=warmup" > /dev/null 2>&1 || true

# ─── 1. Single flag evaluate ─────────────────────────────

header "Single /evaluate — 500 req, 10 concurrent"
oha -n 500 -c 10 --no-tui --latency-correction \
  "$FLAGS_URL/evaluate?key=test-flag&clientId=$CLIENT_ID&userId=bench-user-1&email=bench@test.com"

header "Single /evaluate — 2000 req, 50 concurrent"
oha -n 2000 -c 50 --no-tui --latency-correction \
  "$FLAGS_URL/evaluate?key=test-flag&clientId=$CLIENT_ID&userId=bench-user-1&email=bench@test.com"

# ─── 2. Bulk (all flags for client) ──────────────────────

header "Bulk /bulk all flags — 500 req, 10 concurrent"
oha -n 500 -c 10 --no-tui --latency-correction \
  "$FLAGS_URL/bulk?clientId=$CLIENT_ID&userId=bench-user-1&email=bench@test.com"

header "Bulk /bulk all flags — 2000 req, 50 concurrent"
oha -n 2000 -c 50 --no-tui --latency-correction \
  "$FLAGS_URL/bulk?clientId=$CLIENT_ID&userId=bench-user-1&email=bench@test.com"

# ─── 3. Bulk with key filtering ──────────────────────────

header "Bulk /bulk filtered 3 keys — 1000 req, 20 concurrent"
oha -n 1000 -c 20 --no-tui --latency-correction \
  "$FLAGS_URL/bulk?clientId=$CLIENT_ID&keys=flag-1,flag-2,flag-3&userId=bench-user-1"

# ─── 4. Bulk with full user context ──────────────────────

PROPS=$(python3 -c "import urllib.parse; print(urllib.parse.quote('{\"plan\":\"pro\",\"country\":\"US\",\"signupDate\":\"2024-01-15\"}'))")

header "Bulk /bulk full context — 1000 req, 20 concurrent"
oha -n 1000 -c 20 --no-tui --latency-correction \
  "$FLAGS_URL/bulk?clientId=$CLIENT_ID&userId=user-42&email=jane@company.com&organizationId=org-1&teamId=team-fe&properties=$PROPS"

# ─── 5. Definitions ──────────────────────────────────────

header "Definitions — 500 req, 10 concurrent"
oha -n 500 -c 10 --no-tui --latency-correction \
  "$FLAGS_URL/definitions?clientId=$CLIENT_ID"

# ─── 6. Sustained 30s load ───────────────────────────────

header "Sustained /bulk — 30s, 50 concurrent"
oha -z 30s -c 50 --no-tui --latency-correction \
  "$FLAGS_URL/bulk?clientId=$CLIENT_ID&userId=sustained-user&email=load@test.com"

# ─── 7. High concurrency spike ───────────────────────────

header "Spike /bulk — 1000 req, 200 concurrent"
oha -n 1000 -c 200 --no-tui --latency-correction \
  "$FLAGS_URL/bulk?clientId=$CLIENT_ID&userId=spike-user"

# ─── 8. Error paths ──────────────────────────────────────

header "Missing flag (404) — 500 req, 10 concurrent"
oha -n 500 -c 10 --no-tui --latency-correction \
  "$FLAGS_URL/evaluate?key=nonexistent-flag-xyz&clientId=$CLIENT_ID&userId=user-1"

header "Bad request (no clientId) — 500 req, 10 concurrent"
oha -n 500 -c 10 --no-tui --latency-correction \
  "$FLAGS_URL/bulk"

echo ""
echo "Done."

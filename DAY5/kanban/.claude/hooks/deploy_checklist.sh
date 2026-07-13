#!/bin/bash
# PreToolUse(Bash) hook: block vercel deploy commands unless DEPLOY_CHECKLIST.md's
# automatically-verifiable items pass.
set -euo pipefail

PROJECT_DIR="/Users/chachaeeun/project/DAY5/kanban"

input="$(cat)"
cmd="$(echo "$input" | jq -r '.tool_input.command // empty')"

# only act on commands that invoke the vercel CLI
if ! echo "$cmd" | grep -qE '(^|[[:space:]])vercel([[:space:]]|$)'; then
  exit 0
fi

# skip known non-deploy subcommands (logs, whoami, env, etc.)
second_token="$(echo "$cmd" | sed -E 's/.*vercel[[:space:]]*//' | awk '{print $1}')"
case "$second_token" in
  login|logout|logs|whoami|list|ls|env|project|projects|teams|team|domains|domain|dns|certs|cert|secrets|secret|alias|aliases|link|unlink|inspect|rollback|promote|remove|rm|dev|build|help|--help|-h|--version|-v|init|git|telemetry|config|switch)
    exit 0
    ;;
esac

failures=()

# 1. console.log / debugger leftovers
if grep -nE 'console\.log\(|(^|[^A-Za-z_.])debugger([^A-Za-z_]|$)' \
    "$PROJECT_DIR"/app.js "$PROJECT_DIR"/index.html 2>/dev/null | grep -q .; then
  failures+=("console.log/debugger 잔존 코드 발견 (app.js/index.html)")
fi

# 2. service_role key exposure in client-shipped files
if grep -inE 'service_role' \
    "$PROJECT_DIR"/app.js "$PROJECT_DIR"/index.html "$PROJECT_DIR"/config.js 2>/dev/null | grep -q .; then
  failures+=("클라이언트 파일에 service_role 관련 문자열 노출")
fi

# 3. .env 등 시크릿 파일이 git에 커밋되어 있는지
tracked_env="$(cd "$PROJECT_DIR" && git ls-files 2>/dev/null | grep -E '(^|/)\.env($|\.[^.]+$)' | grep -vE '\.env\.example$' || true)"
if [ -n "$tracked_env" ]; then
  failures+=(".env 시크릿 파일이 git에 커밋됨: $tracked_env")
fi

# 4. Supabase REST 엔드포인트로 직접 fetch (클라이언트 우회)
if grep -nE 'fetch\(.*(supabase\.co|/rest/v1/)' "$PROJECT_DIR"/app.js 2>/dev/null | grep -q .; then
  failures+=("Supabase REST 엔드포인트 직접 fetch 호출 발견 (app.js)")
fi

if [ "${#failures[@]}" -gt 0 ]; then
  reason="$(printf '%s; ' "${failures[@]}")"
  jq -n --arg reason "$reason" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: ("DEPLOY_CHECKLIST.md 자동 점검 실패: " + $reason)
    },
    systemMessage: ("배포가 차단되었습니다: " + $reason)
  }'
fi

exit 0

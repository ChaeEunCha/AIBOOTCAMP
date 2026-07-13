#!/usr/bin/env bash
# PreToolUse(Bash) 훅: vercel 배포 명령 직전에 DEPLOY_CHECKLIST.md 항목을 점검한다.
# 배포 명령이 아니면 즉시 통과, 배포 명령이면 점검 후 deny/allow를 JSON으로 출력한다.
set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# vercel 배포 관련 명령이 아니면 통과
if ! echo "$COMMAND" | grep -Eiq 'vercel[^|&;]*(deploy|--prod|-prod)'; then
  exit 0
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

FAILS=()

# 1. 모든 DB 접근은 supabase 클라이언트를 통해서만 (직접 fetch 금지)
if grep -n "fetch(" app.js > /dev/null 2>&1; then
  FAILS+=("app.js에 직접 fetch() 호출이 있습니다 (Supabase 클라이언트만 사용해야 함)")
fi

# 2. console.log 등 디버그 코드 잔여 금지
if grep -n "console\.log" app.js > /dev/null 2>&1; then
  FAILS+=("app.js에 console.log 디버그 코드가 남아있습니다")
fi

# 3. 인라인 style/script 없이 분리된 구조 유지
if grep -n 'style="' index.html > /dev/null 2>&1; then
  FAILS+=("index.html에 인라인 style 속성이 있습니다")
fi

# 4. PRD 제외 기능(권한관리/이미지업로드/댓글) 키워드 없는지 (best-effort)
if grep -Ein "role|permission|comment|image.?upload" app.js config.js index.html > /dev/null 2>&1; then
  FAILS+=("PRD 제외 기능(권한/이미지업로드/댓글) 관련으로 보이는 코드가 있습니다 — 확인 필요")
fi

# 5. 번들러/프레임워크 없이 정적 구조 유지
if [ -f package.json ] || [ -d node_modules ]; then
  FAILS+=("package.json/node_modules가 존재합니다 — 정적 HTML/CSS/JS 구조를 벗어났습니다")
fi

# 6. config.js에 service_role 키가 아닌 publishable/anon 키만 있는지
if grep -iq "service_role" config.js 2>/dev/null; then
  FAILS+=("config.js에 service_role 문자열이 포함되어 있습니다")
fi
JWT=$(grep -oE 'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+' config.js 2>/dev/null || true)
if [ -n "$JWT" ]; then
  PAYLOAD=$(echo "$JWT" | cut -d. -f2 | tr '_-' '/+')
  PAD=$(( (4 - ${#PAYLOAD} % 4) % 4 ))
  PAYLOAD="${PAYLOAD}$(printf '=%.0s' $(seq 1 $PAD) 2>/dev/null || true)"
  DECODED=$(echo "$PAYLOAD" | base64 -d 2>/dev/null || true)
  if echo "$DECODED" | grep -q '"role":"service_role"'; then
    FAILS+=("config.js의 키가 service_role 키입니다 — publishable/anon 키로 교체 필요")
  fi
fi

# 7. .env/credentials 등 실제 비밀 파일이 git에 커밋되지 않았는지
if git ls-files 2>/dev/null | grep -Ei '(^|/)\.env(\.|$)|credentials' > /dev/null 2>&1; then
  FAILS+=("git에 .env 또는 credentials 파일이 커밋되어 있습니다")
fi

# 8. 에러 메시지에 스택트레이스/내부 경로 노출 금지
if grep -n "\.stack" app.js > /dev/null 2>&1; then
  FAILS+=("app.js 에러 처리에서 err.stack을 노출하고 있습니다")
fi

# 10. 콘솔/네트워크 로그에 비밀번호 등 노출 금지
if grep -Ein "console\.(log|debug|info).*password" app.js > /dev/null 2>&1; then
  FAILS+=("app.js에서 비밀번호를 콘솔에 로그하는 코드가 있습니다")
fi

if [ "${#FAILS[@]}" -gt 0 ]; then
  REASON_LINES=$(printf -- '- %s\n' "${FAILS[@]}")
  jq -n --arg lines "$REASON_LINES" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: ("DEPLOY_CHECKLIST.md 점검 실패로 배포를 차단합니다:\n" + $lines)
    },
    systemMessage: "배포 전 점검 실패 — vercel 배포 명령이 차단되었습니다. DEPLOY_CHECKLIST.md를 확인하세요."
  }'
  exit 0
fi

jq -n '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "allow",
    permissionDecisionReason: "DEPLOY_CHECKLIST.md 점검 통과"
  }
}'
exit 0

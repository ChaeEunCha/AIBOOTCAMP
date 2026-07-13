# cowork 배포 전 점검 체크리스트

## 1. 컨벤션 위반 코드 없는지
- [ ] 모든 DB 접근이 `supabase.from()` / `.auth` / `.channel()`만 사용하고, 직접 `fetch`로 REST/Realtime 엔드포인트를 호출하는 코드가 없는지
- [ ] `console.log` 등 디버그용 코드가 남아있지 않은지
- [ ] 인라인 `style`/`<script>` 없이 `styles.css`, `app.js`로 분리된 구조가 유지되는지
- [ ] PRD 제외 기능(권한 관리, 이미지 업로드, 댓글)이 추가되지 않았는지
- [ ] 번들러/프레임워크 없이 정적 HTML/CSS/JS로 바로 실행되는 구조가 유지되는지

## 2. 민감 정보 노출 여부
- [ ] `config.js`에 `service_role` 키나 DB 비밀번호가 아닌 publishable(anon) 키만 있는지
- [ ] `.env`, 인증서, credentials 등 실제 비밀 파일이 git에 커밋되지 않았는지
- [ ] 에러 토스트 메시지에 스택 트레이스, 내부 경로 등 불필요한 세부 정보가 노출되지 않는지
- [ ] Supabase `pages` 테이블에 RLS가 활성화되어 미인증 사용자의 접근이 차단되는지
- [ ] 브라우저 콘솔/네트워크 로그에 로그인 비밀번호 등 사용자 입력값이 그대로 남지 않는지

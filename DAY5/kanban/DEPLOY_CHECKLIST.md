# cokanban 배포 전 점검 체크리스트

## 1. 컨벤션 위반 코드

- [ ] `console.log`/`debugger`/주석 처리된 테스트 코드가 남아있지 않은지 (`app.js`, `index.html`)
- [ ] DB 호출이 전부 Supabase JS 클라이언트를 통해서만 이뤄지고, 직접 REST/SQL fetch가 없는지
- [ ] `cards`/`users` 필드명이 `DB.md` 스키마(status, priority, position 등)와 그대로 일치하는지
- [ ] PRD 제외 기능(권한 관리, 파일 업로드, 댓글) 관련 코드나 UI가 섞여 들어가지 않았는지

## 2. 민감 정보 노출

- [ ] `config.js`에 `service_role` 키가 아닌 anon/publishable 키만 사용되었는지
- [ ] 코드/커밋 이력에 비밀번호, `.env` 같은 시크릿 파일이 포함되지 않았는지
- [ ] `cards`/`projects`/`project_members`/`users` 테이블에 RLS가 모두 활성화되어 있는지 (`list_tables` 등으로 재확인)
- [ ] 에러 토스트/콘솔에 DB 원본 에러 메시지(쿼리, 스택트레이스 등)가 그대로 노출되지 않는지

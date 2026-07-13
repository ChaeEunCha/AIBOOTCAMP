# DB 설계: cowork

PRD 기준(권한 관리 제외 = 모든 로그인 사용자가 모든 페이지에 동등하게 접근/편집)에 맞춘 최소 스키마.

## ERD

```
auth.users (Supabase Auth 관리)
   │ 1
   │
   │ N
pages
```

## 테이블 정의

### auth.users
이메일 로그인/회원가입은 Supabase Auth가 기본 제공하는 `auth.users`를 그대로 사용한다. 별도 profiles 테이블은 두지 않는다 (닉네임 등 추가 속성 요구사항 없음).

### pages
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid, PK, default gen_random_uuid() | 페이지 식별자 |
| title | text, not null, default '' | 페이지 제목 |
| content | text, not null, default '' | 페이지 본문 |
| created_by | uuid, references auth.users(id) | 생성한 사용자 |
| created_at | timestamptz, default now() | 생성 시각 |
| updated_at | timestamptz, default now() | 마지막 수정 시각 (본문/제목 수정 시 갱신) |

```sql
create table pages (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  content text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## RLS 정책
권한 관리(역할/접근 제어)는 범위 밖이므로, "로그인한 사용자는 모두 접근 가능"이라는 단일 규칙만 적용한다.

```sql
alter table pages enable row level security;

create policy "authenticated users can read pages"
  on pages for select
  to authenticated
  using (true);

create policy "authenticated users can insert pages"
  on pages for insert
  to authenticated
  with check (true);

create policy "authenticated users can update pages"
  on pages for update
  to authenticated
  using (true);

create policy "authenticated users can delete pages"
  on pages for delete
  to authenticated
  using (true);
```

## 실시간 동기화
Supabase Realtime의 Postgres Changes 기능을 `pages` 테이블에 대해 활성화하여, 제목/본문 수정 및 삭제 이벤트를 접속 중인 클라이언트에 즉시 브로드캐스트한다.

```sql
alter publication supabase_realtime add table pages;
```

## 범위 제외 사항
- 권한/역할 구분 컬럼 없음 (예: role, team_id)
- 이미지 등 첨부파일 저장 컬럼 없음
- 댓글 테이블 없음

추후 팀 단위 분리나 권한 관리가 필요해지면 `teams`, `team_members` 테이블과 `pages.team_id` 컬럼을 추가하는 방향으로 확장한다.

# DB 설계: cokanban

PRD.md 기준으로 설계한 데이터베이스 스키마.

## 1. 엔티티 개요

- **users**: 이메일 로그인 사용자
- **projects**: 팀의 프로젝트(보드) 단위
- **project_members**: 프로젝트에 속한 팀원(담당자 지정 대상)
- **cards**: 할 일/진행 중/완료 목록에 속하는 카드

별도 권한 관리가 없으므로 role 없이 프로젝트 소속 여부만 관리한다.

## 2. 테이블 정의

### users
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | 사용자 ID |
| email | text (unique) | 로그인 이메일 |
| password_hash | text | 비밀번호 해시 |
| name | text | 표시 이름 |
| created_at | timestamptz | 가입일 |

### projects
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | 프로젝트 ID |
| name | text | 프로젝트명 |
| owner_id | uuid (FK → users.id) | 생성자 |
| created_at | timestamptz | 생성일 |

### project_members
| 컬럼 | 타입 | 설명 |
|---|---|---|
| project_id | uuid (FK → projects.id) | 프로젝트 |
| user_id | uuid (FK → users.id) | 소속 사용자 |
| joined_at | timestamptz | 참여일 |

PK: (project_id, user_id)

### cards
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | 카드 ID |
| project_id | uuid (FK → projects.id) | 소속 프로젝트 |
| title | text | 제목 |
| content | text | 내용 |
| assignee_id | uuid (FK → users.id, nullable) | 담당자 |
| priority | enum('low','medium','high') | 우선순위 |
| status | enum('todo','in_progress','done') | 목록 위치(할 일/진행 중/완료) |
| position | integer | 같은 status 내 정렬 순서 |
| created_by | uuid (FK → users.id) | 작성자 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 최종 수정일 |

## 3. 관계

```
users 1───N projects (owner_id)
users N───N projects (project_members)
projects 1───N cards
users 1───N cards (assignee_id, nullable)
```

## 4. 실시간 동기화

- `cards` 테이블 변경(INSERT/UPDATE/DELETE)을 `project_id` 기준으로 구독
- 카드 이동은 `status`와 `position` 갱신으로 처리, 변경 즉시 같은 프로젝트를 보는 모든 클라이언트에 브로드캐스트

## 5. 제외 범위

- 역할/권한 테이블 없음 (project_members는 소속 여부만 저장)
- 파일 첨부, 댓글 관련 테이블 없음

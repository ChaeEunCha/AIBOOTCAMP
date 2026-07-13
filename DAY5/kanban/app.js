import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STATUSES = ["todo", "in_progress", "done"];

// ---------- 전역 상태 ----------
const state = {
  user: null,          // { id, email }
  project: null,       // { id, name, owner_id }
  members: [],         // project_members 조인 users 목록 [{ user_id, name, email }]
  cards: [],           // 현재 프로젝트의 전체 카드
  selectedCardId: null,
  editing: {
    cardId: null,
    dirty: false,
    focused: false,
    pendingRemote: null,
  },
  channel: null,
};

// ---------- DOM ----------
const $ = (sel) => document.querySelector(sel);

const authScreen = $("#auth-screen");
const boardScreen = $("#board-screen");
const toastEl = $("#toast");

const tabLogin = $("#tab-login");
const tabSignup = $("#tab-signup");
const loginForm = $("#login-form");
const signupForm = $("#signup-form");

const userEmailEl = $("#user-email");
const logoutBtn = $("#logout-btn");
const addCardBtn = $("#add-card-btn");
const boardColumnsEl = $("#board-columns");

const modalOverlayEl = $("#card-modal-overlay");
const modalCloseBtn = $("#modal-close-btn");
const cardDetailEl = $("#card-detail");
const detailTitle = $("#detail-title");
const detailStatus = $("#detail-status");
const detailPriority = $("#detail-priority");
const detailAssignee = $("#detail-assignee");
const detailContent = $("#detail-content");
const saveCardBtn = $("#save-card-btn");
const deleteCardBtn = $("#delete-card-btn");

// ---------- 유틸 ----------
let toastTimer = null;
function showToast(message, isError = true) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  toastEl.classList.toggle("error", isError);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.add("hidden"), 3500);
}

const PRIORITY_LABEL = { low: "낮음", medium: "중간", high: "높음" };

// ==================================================
// 인증
// ==================================================

tabLogin.addEventListener("click", () => switchAuthTab("login"));
tabSignup.addEventListener("click", () => switchAuthTab("signup"));

function switchAuthTab(which) {
  const isLogin = which === "login";
  tabLogin.classList.toggle("active", isLogin);
  tabSignup.classList.toggle("active", !isLogin);
  loginForm.classList.toggle("hidden", !isLogin);
  signupForm.classList.toggle("hidden", isLogin);
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("#login-email").value.trim();
  const password = $("#login-password").value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    showToast("로그인에 실패했습니다. 다시 시도해주세요");
  }
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#signup-name").value.trim();
  const email = $("#signup-email").value.trim();
  const password = $("#signup-password").value;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) {
    showToast("회원가입에 실패했습니다. 다시 시도해주세요");
    return;
  }
  showToast("회원가입이 완료되었습니다. 로그인해주세요", false);
  switchAuthTab("login");
});

logoutBtn.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) showToast("로그아웃에 실패했습니다. 다시 시도해주세요");
});

// ==================================================
// 부트스트랩 / 세션 감시
// ==================================================

supabase.auth.onAuthStateChange(async (_event, session) => {
  if (session?.user) {
    await enterBoard(session.user);
  } else {
    exitBoard();
  }
});

async function init() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    showToast("세션 확인에 실패했습니다. 다시 시도해주세요");
  }
  if (data?.session?.user) {
    await enterBoard(data.session.user);
  } else {
    exitBoard();
  }
}

function exitBoard() {
  teardownRealtime();
  state.user = null;
  state.project = null;
  state.members = [];
  state.cards = [];
  state.selectedCardId = null;
  closeModal();
  boardScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");
}

async function enterBoard(authUser) {
  state.user = { id: authUser.id, email: authUser.email };
  userEmailEl.textContent = authUser.email;

  authScreen.classList.add("hidden");
  boardScreen.classList.remove("hidden");

  const project = await ensureProject(authUser.id);
  if (!project) return;
  state.project = project;

  await loadMembers();
  await loadCards();
  setupRealtime();
  renderBoard();
}

// 사용자가 속한 첫 프로젝트 조회, 없으면 자동 생성
async function ensureProject(userId) {
  const { data: memberships, error: memberErr } = await supabase
    .from("project_members")
    .select("project_id, projects(id, name, owner_id, created_at)")
    .eq("user_id", userId)
    .limit(1);

  if (memberErr) {
    showToast("프로젝트 조회에 실패했습니다. 다시 시도해주세요");
    return null;
  }

  if (memberships && memberships.length > 0 && memberships[0].projects) {
    return memberships[0].projects;
  }

  // 프로젝트가 없으면 자동 생성
  const { data: newProject, error: createErr } = await supabase
    .from("projects")
    .insert({ name: "내 프로젝트", owner_id: userId })
    .select()
    .single();

  if (createErr) {
    showToast("프로젝트 생성에 실패했습니다. 다시 시도해주세요");
    return null;
  }

  const { error: joinErr } = await supabase
    .from("project_members")
    .insert({ project_id: newProject.id, user_id: userId });

  if (joinErr) {
    showToast("프로젝트 멤버 등록에 실패했습니다. 다시 시도해주세요");
    return null;
  }

  return newProject;
}

async function loadMembers() {
  const { data, error } = await supabase
    .from("project_members")
    .select("user_id, users(id, name, email)")
    .eq("project_id", state.project.id);

  if (error) {
    showToast("멤버 목록 조회에 실패했습니다. 다시 시도해주세요");
    return;
  }

  state.members = (data || [])
    .filter((m) => m.users)
    .map((m) => ({ user_id: m.user_id, name: m.users.name, email: m.users.email }));

  detailAssignee.innerHTML = '<option value="">미지정</option>' +
    state.members.map((m) => `<option value="${m.user_id}">${escapeHtml(m.name || m.email)}</option>`).join("");
}

async function loadCards() {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("project_id", state.project.id)
    .order("status", { ascending: true })
    .order("position", { ascending: true });

  if (error) {
    showToast("카드 목록 조회에 실패했습니다. 다시 시도해주세요");
    return;
  }
  state.cards = data || [];
}

// ==================================================
// Realtime
// ==================================================

function setupRealtime() {
  teardownRealtime();
  const channel = supabase
    .channel(`cards-project-${state.project.id}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "cards", filter: `project_id=eq.${state.project.id}` },
      handleRealtimeChange
    )
    .subscribe((status) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        showToast("실시간 동기화 연결에 실패했습니다. 다시 시도해주세요");
      }
    });
  state.channel = channel;
}

function teardownRealtime() {
  if (state.channel) {
    supabase.removeChannel(state.channel);
    state.channel = null;
  }
}

function handleRealtimeChange(payload) {
  const { eventType, new: newRow, old: oldRow } = payload;

  if (eventType === "INSERT") {
    if (!state.cards.some((c) => c.id === newRow.id)) {
      state.cards.push(newRow);
    }
  } else if (eventType === "UPDATE") {
    const idx = state.cards.findIndex((c) => c.id === newRow.id);
    // 지금 이 카드를 편집 중이면(포커스 또는 미저장 변경) 원격 갱신을 보류
    const isEditingThisCard =
      state.editing.cardId === newRow.id && (state.editing.focused || state.editing.dirty);
    if (isEditingThisCard) {
      // 카드 배열 자체는 최신 값으로 업데이트하지 않고, 별도 캐시로 남겨 편집 종료 후 반영
      state.editing.pendingRemote = newRow;
      renderBoard(); // 보드 목록은 정상 반영 가능하지만, 편집 중인 카드 원본은 유지
      return;
    }
    if (idx >= 0) {
      state.cards[idx] = newRow;
    } else {
      state.cards.push(newRow);
    }
  } else if (eventType === "DELETE") {
    state.cards = state.cards.filter((c) => c.id !== oldRow.id);
    if (state.selectedCardId === oldRow.id) {
      state.selectedCardId = null;
      state.editing.cardId = null;
      state.editing.dirty = false;
      state.editing.focused = false;
      closeModal();
    }
  }

  renderBoard();
  // 모달 상세 화면은 편집 중인 카드가 아닐 때만 갱신
  if (state.selectedCardId && state.editing.cardId !== state.selectedCardId) {
    renderDetail();
  }
}

// 편집을 마칠 때(blur로 저장 완료 또는 선택 해제 시) 보류된 원격 갱신을 반영
function flushPendingRemote(cardId) {
  if (state.editing.pendingRemote && state.editing.pendingRemote.id === cardId) {
    const idx = state.cards.findIndex((c) => c.id === cardId);
    if (idx >= 0) state.cards[idx] = state.editing.pendingRemote;
    state.editing.pendingRemote = null;
  }
}

// ==================================================
// 렌더링: 3-컬럼 보드
// ==================================================

function renderBoard() {
  STATUSES.forEach((status) => {
    const listEl = boardColumnsEl.querySelector(`.card-list[data-status="${status}"]`);
    if (!listEl) return;

    const cardsInStatus = state.cards
      .filter((c) => c.status === status)
      .sort((a, b) => a.position - b.position);

    if (cardsInStatus.length === 0) {
      listEl.innerHTML = '<li class="card-list-empty">카드가 없습니다</li>';
      return;
    }

    listEl.innerHTML = cardsInStatus
      .map((c) => {
        const assignee = state.members.find((m) => m.user_id === c.assignee_id);
        const assigneeLabel = assignee ? escapeHtml(assignee.name || assignee.email) : "미지정";
        return `
          <li class="card-item ${c.id === state.selectedCardId ? "selected" : ""}"
              draggable="true"
              data-card-id="${c.id}">
            <p class="card-title">${escapeHtml(c.title || "(제목 없음)")}</p>
            <div class="card-meta">
              <span class="priority-badge priority-${c.priority}">${PRIORITY_LABEL[c.priority] || c.priority}</span>
              <span>${assigneeLabel}</span>
            </div>
          </li>`;
      })
      .join("");
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// 카드 선택(클릭 시 모달 오픈)
boardColumnsEl.addEventListener("click", (e) => {
  const li = e.target.closest(".card-item[data-card-id]");
  if (!li) return;
  selectCard(li.dataset.cardId);
});

function selectCard(cardId) {
  // 이전에 편집 중이던 카드가 있고 미저장 상태면 그냥 넘어감(요청 범위상 별도 confirm 없이 전환)
  if (state.selectedCardId && state.selectedCardId !== cardId) {
    flushPendingRemote(state.selectedCardId);
  }
  state.selectedCardId = cardId;
  state.editing.cardId = cardId;
  state.editing.dirty = false;
  state.editing.focused = false;
  state.editing.pendingRemote = null;
  renderBoard();
  renderDetail();
  openModal();
}

function openModal() {
  modalOverlayEl.classList.remove("hidden");
}

function closeModal() {
  modalOverlayEl.classList.add("hidden");
}

modalCloseBtn.addEventListener("click", () => {
  deselectCard();
});

modalOverlayEl.addEventListener("click", (e) => {
  if (e.target === modalOverlayEl) {
    deselectCard();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalOverlayEl.classList.contains("hidden")) {
    deselectCard();
  }
});

function deselectCard() {
  if (state.selectedCardId) {
    flushPendingRemote(state.selectedCardId);
  }
  state.selectedCardId = null;
  state.editing.cardId = null;
  state.editing.dirty = false;
  state.editing.focused = false;
  state.editing.pendingRemote = null;
  closeModal();
  renderBoard();
}

// ==================================================
// 카드 추가
// ==================================================

addCardBtn.addEventListener("click", async () => {
  const title = prompt("할 일 제목을 입력하세요");
  if (title === null) return;
  const trimmed = title.trim();
  if (!trimmed) {
    showToast("제목을 입력해주세요");
    return;
  }

  const cardsInStatus = state.cards.filter((c) => c.status === "todo");
  const maxPosition = cardsInStatus.reduce((max, c) => Math.max(max, c.position ?? 0), -1);

  const { data, error } = await supabase
    .from("cards")
    .insert({
      project_id: state.project.id,
      title: trimmed,
      content: "",
      assignee_id: null,
      priority: "medium",
      status: "todo",
      position: maxPosition + 1,
      created_by: state.user.id,
    })
    .select()
    .single();

  if (error) {
    showToast("카드 생성에 실패했습니다. 다시 시도해주세요");
    return;
  }

  if (!state.cards.some((c) => c.id === data.id)) {
    state.cards.push(data);
  }
  renderBoard();
  selectCard(data.id);
});

// ==================================================
// 상세 화면(모달)
// ==================================================

function renderDetail() {
  const card = state.cards.find((c) => c.id === state.selectedCardId);
  if (!card) return;

  detailTitle.value = card.title || "";
  detailStatus.value = card.status;
  detailPriority.value = card.priority;
  detailAssignee.value = card.assignee_id || "";
  detailContent.value = card.content || "";
}

// 편집 중 표시(focus) / 미저장 변경(dirty) 추적
[detailTitle, detailContent].forEach((el) => {
  el.addEventListener("focus", () => {
    if (!state.selectedCardId) return;
    state.editing.cardId = state.selectedCardId;
    state.editing.focused = true;
  });
  el.addEventListener("input", () => {
    if (!state.selectedCardId) return;
    state.editing.dirty = true;
  });
  el.addEventListener("blur", async () => {
    state.editing.focused = false;
    await saveCurrentCard();
  });
});

[detailStatus, detailPriority, detailAssignee].forEach((el) => {
  el.addEventListener("change", async () => {
    if (!state.selectedCardId) return;
    state.editing.dirty = true;
    await saveCurrentCard();
  });
});

saveCardBtn.addEventListener("click", async () => {
  const saved = await saveCurrentCard();
  if (saved) {
    deselectCard();
  }
});

async function saveCurrentCard() {
  const cardId = state.selectedCardId;
  if (!cardId) return false;
  const card = state.cards.find((c) => c.id === cardId);
  if (!card) return false;

  const updated = {
    title: detailTitle.value.trim(),
    status: detailStatus.value,
    priority: detailPriority.value,
    assignee_id: detailAssignee.value || null,
    content: detailContent.value,
  };

  // 변경 없으면 스킵
  const noChange =
    updated.title === (card.title || "") &&
    updated.status === card.status &&
    updated.priority === card.priority &&
    (updated.assignee_id || null) === (card.assignee_id || null) &&
    updated.content === (card.content || "");
  if (noChange) {
    state.editing.dirty = false;
    return true;
  }

  const statusChanged = updated.status !== card.status;
  let position = card.position;
  if (statusChanged) {
    const cardsInNewStatus = state.cards.filter((c) => c.status === updated.status && c.id !== card.id);
    position = cardsInNewStatus.reduce((max, c) => Math.max(max, c.position ?? 0), -1) + 1;
  }

  const { data, error } = await supabase
    .from("cards")
    .update({ ...updated, position })
    .eq("id", cardId)
    .select()
    .single();

  if (error) {
    showToast("저장에 실패했습니다. 다시 시도해주세요");
    return false;
  }

  const idx = state.cards.findIndex((c) => c.id === cardId);
  if (idx >= 0) state.cards[idx] = data;

  state.editing.dirty = false;
  state.editing.pendingRemote = null;

  renderBoard();
  return true;
}

deleteCardBtn.addEventListener("click", async () => {
  const cardId = state.selectedCardId;
  if (!cardId) return;
  if (!confirm("이 카드를 삭제하시겠습니까?")) return;

  const { error } = await supabase.from("cards").delete().eq("id", cardId);
  if (error) {
    showToast("삭제에 실패했습니다. 다시 시도해주세요");
    return;
  }

  state.cards = state.cards.filter((c) => c.id !== cardId);
  state.selectedCardId = null;
  state.editing.cardId = null;
  state.editing.dirty = false;
  state.editing.focused = false;
  closeModal();
  renderBoard();
});

// ==================================================
// 드래그 앤 드롭: 목록 내 순서 변경 + 다른 컬럼으로 이동
// ==================================================

let dragCardId = null;

boardColumnsEl.addEventListener("dragstart", (e) => {
  const li = e.target.closest(".card-item[data-card-id]");
  if (!li) return;
  dragCardId = li.dataset.cardId;
  li.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
});

boardColumnsEl.addEventListener("dragend", (e) => {
  const li = e.target.closest(".card-item[data-card-id]");
  if (li) li.classList.remove("dragging");
  clearDragOverMarks();
  dragCardId = null;
});

boardColumnsEl.addEventListener("dragover", (e) => {
  const listEl = e.target.closest(".card-list[data-status]");
  if (!listEl) return;
  e.preventDefault();
  const li = e.target.closest(".card-item[data-card-id]");
  clearDragOverMarks();
  if (!li || li.dataset.cardId === dragCardId) return;
  const rect = li.getBoundingClientRect();
  const isTopHalf = e.clientY < rect.top + rect.height / 2;
  li.classList.add(isTopHalf ? "drag-over-top" : "drag-over-bottom");
});

function clearDragOverMarks() {
  boardColumnsEl.querySelectorAll(".card-item").forEach((li) => {
    li.classList.remove("drag-over-top", "drag-over-bottom");
  });
}

boardColumnsEl.addEventListener("drop", async (e) => {
  const listEl = e.target.closest(".card-list[data-status]");
  if (!listEl) return;
  e.preventDefault();
  const targetStatus = listEl.dataset.status;
  const li = e.target.closest(".card-item[data-card-id]");
  clearDragOverMarks();
  if (!dragCardId) return;

  const draggedCard = state.cards.find((c) => c.id === dragCardId);
  if (!draggedCard) return;

  const cardsInTargetStatus = state.cards
    .filter((c) => c.status === targetStatus && c.id !== dragCardId)
    .sort((a, b) => a.position - b.position);

  let targetIndex = cardsInTargetStatus.length; // 기본: 맨 끝
  if (li && li.dataset.cardId !== dragCardId) {
    const rect = li.getBoundingClientRect();
    const isTopHalf = e.clientY < rect.top + rect.height / 2;
    const idxInList = cardsInTargetStatus.findIndex((c) => c.id === li.dataset.cardId);
    targetIndex = isTopHalf ? idxInList : idxInList + 1;
  }

  cardsInTargetStatus.splice(targetIndex, 0, { ...draggedCard, status: targetStatus });

  // position 재계산 및 반영
  const updates = cardsInTargetStatus.map((c, i) => ({ id: c.id, position: i }));

  await applyReorder(draggedCard, targetStatus, updates);
});

async function applyReorder(draggedCard, newStatus, updates) {
  // 드래그된 카드 먼저 업데이트(status + position)
  const draggedUpdate = updates.find((u) => u.id === draggedCard.id);

  const { data: updatedDragged, error: err1 } = await supabase
    .from("cards")
    .update({ status: newStatus, position: draggedUpdate.position })
    .eq("id", draggedCard.id)
    .select()
    .single();

  if (err1) {
    showToast("카드 이동에 실패했습니다. 다시 시도해주세요");
    return;
  }

  const idx = state.cards.findIndex((c) => c.id === draggedCard.id);
  if (idx >= 0) state.cards[idx] = updatedDragged;

  // 나머지 카드들의 position만 갱신
  const others = updates.filter((u) => u.id !== draggedCard.id);
  for (const u of others) {
    const existing = state.cards.find((c) => c.id === u.id);
    if (!existing || existing.position === u.position) continue;
    const { data, error } = await supabase
      .from("cards")
      .update({ position: u.position })
      .eq("id", u.id)
      .select()
      .single();
    if (error) {
      showToast("카드 순서 변경에 실패했습니다. 다시 시도해주세요");
      continue;
    }
    const i2 = state.cards.findIndex((c) => c.id === u.id);
    if (i2 >= 0) state.cards[i2] = data;
  }

  if (state.selectedCardId === draggedCard.id && state.editing.cardId !== draggedCard.id) {
    renderDetail();
  }
  renderBoard();
}

// ==================================================
// 시작
// ==================================================

init();

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// --- DOM 참조 ---
const authView = document.getElementById("auth-view");
const appView = document.getElementById("app-view");

const authTabs = document.querySelectorAll(".auth-tab");
const signinForm = document.getElementById("signin-form");
const signupForm = document.getElementById("signup-form");

const logoutBtn = document.getElementById("logout-btn");
const newPageBtnTop = document.getElementById("new-page-btn-top");
const newPageBtnBottom = document.getElementById("new-page-btn-bottom");
const pageList = document.getElementById("page-list");

const emptyState = document.getElementById("empty-state");
const pageEditor = document.getElementById("page-editor");
const pageTitleInput = document.getElementById("page-title");
const pageContentInput = document.getElementById("page-content");
const deletePageBtn = document.getElementById("delete-page-btn");

const toastContainer = document.getElementById("toast-container");

// --- 상태 ---
let pages = [];
let currentPageId = null;
let realtimeChannel = null;
let titleSaveTimer = null;
let contentSaveTimer = null;
const SAVE_DEBOUNCE_MS = 700;

// --- 토스트 ---
function showToast(message, type = "info") {
  const el = document.createElement("div");
  el.className = `toast${type === "error" ? " toast-error" : ""}`;
  el.textContent = message;
  toastContainer.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 250);
  }, 2800);
}

function showError(prefix, err) {
  const msg = err && err.message ? err.message : "알 수 없는 오류가 발생했습니다.";
  showToast(`${prefix}: ${msg}`, "error");
}

// --- 인증 탭 전환 ---
authTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    authTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    if (tab.dataset.tab === "signin") {
      signinForm.classList.remove("hidden");
      signupForm.classList.add("hidden");
    } else {
      signupForm.classList.remove("hidden");
      signinForm.classList.add("hidden");
    }
  });
});

// --- 회원가입 / 로그인 ---
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    showError("회원가입 실패", error);
    return;
  }
  showToast("회원가입 완료. 로그인해주세요.");
  signupForm.reset();
});

signinForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    showError("로그인 실패", error);
    return;
  }
  signinForm.reset();
});

logoutBtn.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    showError("로그아웃 실패", error);
  }
});

// --- Auth 상태 변화 감지 ---
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    enterApp();
  } else {
    exitApp();
  }
});

async function enterApp() {
  authView.classList.add("hidden");
  appView.classList.remove("hidden");
  await loadPages();
  subscribeRealtime();
}

function exitApp() {
  appView.classList.add("hidden");
  authView.classList.remove("hidden");
  pages = [];
  currentPageId = null;
  renderPageList();
  showEmptyState();
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
}

// --- 페이지 목록 로드 ---
async function loadPages() {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    showError("페이지 목록 불러오기 실패", error);
    return;
  }
  pages = data || [];
  renderPageList();
}

function renderPageList() {
  pageList.innerHTML = "";

  if (pages.length === 0) {
    const empty = document.createElement("li");
    empty.className = "page-list-empty";
    empty.textContent = "페이지가 없습니다";
    pageList.appendChild(empty);
    return;
  }

  pages.forEach((page) => {
    const li = document.createElement("li");
    li.className = "page-list-item" + (page.id === currentPageId ? " active" : "");
    li.textContent = page.title && page.title.trim() ? page.title : "제목 없음";
    li.dataset.id = page.id;
    li.addEventListener("click", () => selectPage(page.id));
    pageList.appendChild(li);
  });
}

function showEmptyState() {
  emptyState.classList.remove("hidden");
  pageEditor.classList.add("hidden");
}

function showEditor() {
  emptyState.classList.add("hidden");
  pageEditor.classList.remove("hidden");
}

function selectPage(id) {
  const page = pages.find((p) => p.id === id);
  if (!page) return;
  currentPageId = id;
  renderPageList();
  showEditor();
  pageTitleInput.value = page.title || "";
  pageContentInput.value = page.content || "";
}

// --- 새 페이지 생성 ---
async function createNewPage() {
  const { data, error } = await supabase
    .from("pages")
    .insert({ title: "", content: "" })
    .select()
    .single();

  if (error) {
    showError("페이지 생성 실패", error);
    return;
  }

  pages.push(data);
  renderPageList();
  selectPage(data.id);
}

newPageBtnTop.addEventListener("click", createNewPage);
newPageBtnBottom.addEventListener("click", createNewPage);

// --- 자동 저장 (디바운스) ---
function scheduleSave(field) {
  const timerRef = field === "title" ? "titleSaveTimer" : "contentSaveTimer";
  if (field === "title") {
    clearTimeout(titleSaveTimer);
    titleSaveTimer = setTimeout(() => savePageField(field), SAVE_DEBOUNCE_MS);
  } else {
    clearTimeout(contentSaveTimer);
    contentSaveTimer = setTimeout(() => savePageField(field), SAVE_DEBOUNCE_MS);
  }
}

async function savePageField(field) {
  if (!currentPageId) return;
  const value = field === "title" ? pageTitleInput.value : pageContentInput.value;
  const payload = { updated_at: new Date().toISOString() };
  payload[field] = value;

  const { data, error } = await supabase
    .from("pages")
    .update(payload)
    .eq("id", currentPageId)
    .select()
    .single();

  if (error) {
    showError("저장 실패", error);
    return;
  }

  const idx = pages.findIndex((p) => p.id === currentPageId);
  if (idx !== -1) {
    pages[idx] = data;
    if (field === "title") renderPageList();
  }
}

pageTitleInput.addEventListener("input", () => scheduleSave("title"));
pageContentInput.addEventListener("input", () => scheduleSave("content"));

// --- 삭제 ---
deletePageBtn.addEventListener("click", async () => {
  if (!currentPageId) return;
  const page = pages.find((p) => p.id === currentPageId);
  const label = page && page.title && page.title.trim() ? page.title : "제목 없는 페이지";
  const confirmed = window.confirm(`"${label}" 페이지를 삭제할까요?`);
  if (!confirmed) return;

  const idToDelete = currentPageId;
  const { error } = await supabase.from("pages").delete().eq("id", idToDelete);
  if (error) {
    showError("삭제 실패", error);
    return;
  }

  pages = pages.filter((p) => p.id !== idToDelete);
  if (currentPageId === idToDelete) {
    currentPageId = null;
    showEmptyState();
  }
  renderPageList();
});

// --- 실시간 동기화 ---
function subscribeRealtime() {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
  }

  realtimeChannel = supabase
    .channel("pages-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "pages" },
      handleRealtimeChange
    )
    .subscribe((status) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        showError("실시간 동기화 연결 실패", { message: "잠시 후 다시 시도해주세요." });
      }
    });
}

function handleRealtimeChange(payload) {
  const { eventType, new: newRow, old: oldRow } = payload;

  if (eventType === "INSERT") {
    if (!pages.some((p) => p.id === newRow.id)) {
      pages.push(newRow);
      renderPageList();
    }
    return;
  }

  if (eventType === "UPDATE") {
    const idx = pages.findIndex((p) => p.id === newRow.id);
    const isCurrentPage = newRow.id === currentPageId;
    const titleFocused = isCurrentPage && document.activeElement === pageTitleInput;
    const contentFocused = isCurrentPage && document.activeElement === pageContentInput;

    if (idx !== -1) {
      // 목록 데이터는 항상 최신으로 유지하되, 편집 중인 필드 값은 로컬 값을 보존한다.
      const merged = { ...newRow };
      if (titleFocused) merged.title = pages[idx].title;
      if (contentFocused) merged.content = pages[idx].content;
      pages[idx] = merged;
    } else {
      pages.push(newRow);
    }

    renderPageList();

    if (isCurrentPage) {
      if (!titleFocused) pageTitleInput.value = newRow.title || "";
      if (!contentFocused) pageContentInput.value = newRow.content || "";
    }
    return;
  }

  if (eventType === "DELETE") {
    const deletedId = oldRow.id;
    pages = pages.filter((p) => p.id !== deletedId);
    renderPageList();

    if (currentPageId === deletedId) {
      currentPageId = null;
      showEmptyState();
      showToast("보고 있던 페이지가 삭제되었습니다.");
    }
  }
}

// --- 초기 세션 확인 ---
(async function init() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    showError("세션 확인 실패", error);
    return;
  }
  if (data.session) {
    await enterApp();
  } else {
    exitApp();
  }
})();

// ==========================================
// Lucero Staff Portal 共通認証・権限管理 (auth.js)
// ==========================================

// 既存の勤怠管理GASのURL（ログイン処理もこのGASに統合するか、専用GASのURLを設定）
const GAS_URL = "https://script.google.com/macros/s/AKfycbzpqVPtSIUMjSarKvEQCWgh4h4eXP-5suFn59Vw3E6rMHbMymo4ee6OFUME9jx-JtUh/exec";
const AUTH_STORAGE_KEY = "lucero_staff_portal_user_v1";

/**
 * ログインユーザー情報を保存
 * user = { id: string, name: string, role: 'admin' | 'staff', rawRole: '管理者' | 'スタッフ' }
 */
function saveLoginUser(user) {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

/**
 * 現在のログインユーザーを取得
 */
function getLoginUser() {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * 管理者（前日試合準備の閲覧・操作権限あり）かどうか判定
 */
function isAdminUser(user = getLoginUser()) {
  if (!user) return false;
  return user.role === "admin" || user.rawRole === "管理者";
}

/**
 * ログイン必須ページのガード処理
 * @param {Object} options { requireAdmin: boolean }
 */
function requireAuth(options = { requireAdmin: false }) {
  const user = getLoginUser();
  if (!user) {
    window.location.replace("./index.html");
    return null;
  }
  if (options.requireAdmin && !isAdminUser(user)) {
    alert("このページ（前日試合準備）は管理者のみアクセス可能です。");
    window.location.replace("./top.html");
    return null;
  }
  return user;
}

/**
 * ログアウト処理
 */
function logoutPortal() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = "./index.html";
}

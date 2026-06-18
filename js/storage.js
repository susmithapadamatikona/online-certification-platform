const STORAGE_KEYS = {
  users: "certifyhubUsers",
  session: "certifyhubSession",
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readSessionStorage(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSessionData(session, rememberMe) {
  sessionStorage.removeItem(STORAGE_KEYS.session);
  localStorage.removeItem(STORAGE_KEYS.session);

  if (rememberMe) {
    writeJson(STORAGE_KEYS.session, session);
    return;
  }

  sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

function getUsers() {
  return readJson(STORAGE_KEYS.users, []);
}

function saveUsers(users) {
  writeJson(STORAGE_KEYS.users, users);
}

function findUserByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return getUsers().find((user) => user.email.toLowerCase() === normalized) || null;
}

function registerUser(user) {
  const users = getUsers();
  const normalizedEmail = user.email.trim().toLowerCase();
  if (users.some((existing) => existing.email.toLowerCase() === normalizedEmail)) {
    return { ok: false, message: "An account with that email already exists." };
  }

  const nextUser = {
    id: `user_${Date.now()}`,
    fullName: user.fullName.trim(),
    email: normalizedEmail,
    phone: user.phone.trim(),
    password: user.password,
    role: user.role,
  };

  users.push(nextUser);
  saveUsers(users);
  return { ok: true, user: nextUser };
}

function loginUser({ email, password, role, rememberMe = false }) {
  const user = findUserByEmail(email);
  if (!user) {
    const normalizedEmail = email.trim().toLowerCase();
    const fallbackName = normalizedEmail
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Stackly Learner";
    const session = {
      id: `guest_${Date.now()}`,
      fullName: fallbackName,
      email: normalizedEmail,
      phone: "",
      role,
      loggedInAt: new Date().toISOString(),
    };

    writeSessionData(session, rememberMe);
    return { ok: true, user: session };
  }

  if (user.password !== password) {
    return { ok: false, message: "The password you entered is incorrect." };
  }

  if (user.role !== role) {
    return { ok: false, message: "Please choose the same role you used during registration." };
  }

  const session = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    loggedInAt: new Date().toISOString(),
  };

  writeSessionData(session, rememberMe);
  return { ok: true, user: session };
}

function getSessionUser() {
  return readSessionStorage(STORAGE_KEYS.session) || readJson(STORAGE_KEYS.session, null);
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
  sessionStorage.removeItem(STORAGE_KEYS.session);
}

function ensureSeedData() {
  const users = getUsers();
  if (users.length) {
    return;
  }

  saveUsers([
    {
      id: "seed_student",
      fullName: "Susmitha R",
      email: "susmitha@gmail.com",
      phone: "9876543210",
      password: "Password123",
      role: "Student",
    },
  ]);
}

ensureSeedData();

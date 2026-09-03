document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initDashboard();
});

function initLoginForm() {
  const form = document.getElementById("loginForm");

  if (!form) return;

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberInput = document.getElementById("rememberMe");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const formError = document.getElementById("formError");
  const loginBtn = document.getElementById("loginBtn");
  const loginBtnText = document.getElementById("loginBtnText");
  const loginBtnIcon = document.getElementById("loginBtnIcon");
  const loginBtnSpinner = document.getElementById("loginBtnSpinner");
  const togglePassword = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (togglePassword && eyeIcon && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";

      passwordInput.type = isPassword ? "text" : "password";

      if (isPassword) {
        eyeIcon.innerHTML = `
          <path
            d="M3 3L21 21"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M10.6 6.7C11.05 6.57 11.52 6.5 12 6.5C16 6.5 19.5 8.5 21.5 12C20.72 13.36 19.7 14.55 18.5 15.48"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.1 17.3C13.43 17.43 12.72 17.5 12 17.5C8 17.5 4.5 15.5 2.5 12C3.24 10.7 4.2 9.56 5.32 8.65"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        `;

        togglePassword.setAttribute("aria-label", "Hide password");
      } else {
        eyeIcon.innerHTML = `
          <path
            d="M2.5 12C4.5 8.5 8 6.5 12 6.5C16 6.5 19.5 8.5 21.5 12C19.5 15.5 16 17.5 12 17.5C8 17.5 4.5 15.5 2.5 12Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            stroke-width="1.8"
          />
        `;

        togglePassword.setAttribute("aria-label", "Show password");
      }
    });
  }

  function clearErrors() {
    emailError.textContent = "";
    passwordError.textContent = "";
    formError.textContent = "";
    formError.classList.add("d-none");
    emailInput.classList.remove("is-invalid");
    passwordInput.classList.remove("is-invalid");
  }

  function setLoading(isLoading) {
    loginBtn.disabled = isLoading;
    loginBtnText.textContent = isLoading ? "Signing in…" : "Login";
    loginBtnIcon.classList.toggle("d-none", isLoading);
    loginBtnSpinner.classList.toggle("d-none", !isLoading);
  }

  function validate() {
    let isValid = true;

    if (!emailInput.value.trim()) {
      emailError.textContent = "Enter your email address.";
      emailInput.classList.add("is-invalid");
      isValid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Enter a valid email address.";
      emailInput.classList.add("is-invalid");
      isValid = false;
    }

    if (!passwordInput.value) {
      passwordError.textContent = "Enter your password.";
      passwordInput.classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearErrors();

    if (!validate()) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    localStorage.setItem("isLoggedIn", "true");

    if (rememberInput && rememberInput.checked) {
      localStorage.setItem("rememberLogin", "true");
    } else {
      localStorage.removeItem("rememberLogin");
    }

    window.location.href = "dashboard.html";
  });
}

function initDashboard() {
  const shell = document.querySelector(".page-dashboard");

  if (!shell) return;

const notifBtn = document.getElementById("notifBtn");
const notifPanel = document.getElementById("notifPanel");
const notifOverlay = document.getElementById("notifOverlay");
const notifCloseBtn = document.getElementById("notifCloseBtn");

function openNotifPanel() {
  if (notifPanel) notifPanel.classList.add("show");
  if (notifOverlay) notifOverlay.classList.add("show");
}

function closeNotifPanel() {
  if (notifPanel) notifPanel.classList.remove("show");
  if (notifOverlay) notifOverlay.classList.remove("show");
}

if (notifBtn && notifPanel) {
  notifBtn.addEventListener("click", () => {
    notifPanel.classList.contains("show")
      ? closeNotifPanel()
      : openNotifPanel();
  });
} else if (notifBtn) {
  notifBtn.addEventListener("click", () => {
    window.location.href = "notifications.html";
  });
}

if (notifCloseBtn) {
  notifCloseBtn.addEventListener("click", closeNotifPanel);
}

if (notifOverlay) {
  notifOverlay.addEventListener("click", closeNotifPanel);
}
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutModal = document.getElementById("logoutModal");
  const cancelLogout = document.getElementById("cancelLogout");
  const confirmLogout = document.getElementById("confirmLogout");
  const logoutModalOverlay = document.getElementById("logoutModalOverlay");

  if (logoutBtn && logoutModal) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      logoutModal.classList.add("show");
    });
  }

  if (cancelLogout && logoutModal) {
    cancelLogout.addEventListener("click", () => {
      logoutModal.classList.remove("show");
    });
  }

  if (logoutModalOverlay && logoutModal) {
    logoutModalOverlay.addEventListener("click", () => {
      logoutModal.classList.remove("show");
    });
  }

  if (confirmLogout) {
    confirmLogout.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("rememberLogin");
      window.location.href = "login.html";
    });
  }
}
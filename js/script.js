document.addEventListener("DOMContentLoaded", () => {
    initLoginForm();
    initDashboard();
    initPreferences();
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

    const demoAccounts = [
        {
            email: "admin@valoblox.com",
            password: "admin123",
            role: "admin",
            name: "Admin"
        },
        {
            email: "customer@valoblox.com",
            password: "customer123",
            role: "customer",
            name: "Customer"
        }
    ];

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";

            if (eyeIcon) {
                eyeIcon.innerHTML = isPassword
                    ? `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M10.58 10.58A2 2 0 0 0 13.42 13.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.9C17 4.9 20.5 9 21.5 12C21.08 13.26 20.17 14.72 18.75 15.9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6.61 6.61C4.38 7.96 3.05 10.35 2.5 12C3.5 15 7 19.1 12 19.1C13.5 19.1 14.88 18.73 16.1 18.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `
                    : `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M2.5 12C4.5 8.5 8 6 12 6C16 6 19.5 8.5 21.5 12C19.5 15.5 16 18 12 18C8 18 4.5 15.5 2.5 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    `;

                togglePassword.setAttribute(
                    "aria-label",
                    isPassword ? "Hide password" : "Show password"
                );
            }
        });
    }

    function clearErrors() {
        if (emailError) {
            emailError.textContent = "";
        }

        if (passwordError) {
            passwordError.textContent = "";
        }

        if (formError) {
            formError.textContent = "";
            formError.classList.add("d-none");
        }

        if (emailInput) {
            emailInput.classList.remove("is-invalid");
        }

        if (passwordInput) {
            passwordInput.classList.remove("is-invalid");
        }
    }

    function setLoading(isLoading) {
        if (loginBtn) {
            loginBtn.disabled = isLoading;
        }

        if (loginBtnText) {
            loginBtnText.textContent = isLoading
                ? "Signing in..."
                : "Login";
        }

        if (loginBtnIcon) {
            loginBtnIcon.classList.toggle("d-none", isLoading);
        }

        if (loginBtnSpinner) {
            loginBtnSpinner.classList.toggle("d-none", !isLoading);
        }
    }

    function validate() {
        let isValid = true;

        if (emailInput && !emailInput.value.trim()) {
            if (emailError) {
                emailError.textContent = "Enter your email address.";
            }

            emailInput.classList.add("is-invalid");
            isValid = false;
        } else if (
            emailInput &&
            !emailPattern.test(emailInput.value.trim())
        ) {
            if (emailError) {
                emailError.textContent = "Enter a valid email address.";
            }

            emailInput.classList.add("is-invalid");
            isValid = false;
        }

        if (passwordInput && !passwordInput.value) {
            if (passwordError) {
                passwordError.textContent = "Enter your password.";
            }

            passwordInput.classList.add("is-invalid");
            isValid = false;
        }

        return isValid;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearErrors();

        if (!validate()) {
            return;
        }

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        const account = demoAccounts.find((user) => {
            return (
                user.email === email &&
                user.password === password
            );
        });

        if (!account) {
            if (formError) {
                formError.textContent =
                    "Invalid email or password. Please try again.";

                formError.classList.remove("d-none");
            }

            if (passwordInput) {
                passwordInput.classList.add("is-invalid");
            }

            return;
        }

        setLoading(true);

        await new Promise((resolve) => {
            setTimeout(resolve, 800);
        });

        localStorage.setItem("isLoggedIn", "true");

        localStorage.setItem(
            "valobloxUser",
            JSON.stringify({
                email: account.email,
                role: account.role,
                name: account.name
            })
        );

        if (rememberInput && rememberInput.checked) {
            localStorage.setItem("rememberLogin", "true");
        } else {
            localStorage.removeItem("rememberLogin");
        }

        if (account.role === "customer") {
            window.location.href = "customer_welcome.html";
        } else {
            window.location.href = "dashboard.html";
        }
    });
}

function initDashboard() {
    const notifBtn = document.getElementById("notifBtn");
    const notifPanel = document.getElementById("notifPanel");
    const notifOverlay = document.getElementById("notifOverlay");
    const notifCloseBtn = document.getElementById("notifCloseBtn");

    function openNotifPanel() {
        if (notifPanel) {
            notifPanel.classList.add("show");
            notifPanel.classList.add("open");
        }

        if (notifOverlay) {
            notifOverlay.classList.add("show");
            notifOverlay.classList.add("open");
        }
    }

    function closeNotifPanel() {
        if (notifPanel) {
            notifPanel.classList.remove("show");
            notifPanel.classList.remove("open");
        }

        if (notifOverlay) {
            notifOverlay.classList.remove("show");
            notifOverlay.classList.remove("open");
        }
    }

    if (notifBtn) {
        notifBtn.addEventListener("click", () => {
            const isOpen =
                notifPanel &&
                (
                    notifPanel.classList.contains("show") ||
                    notifPanel.classList.contains("open")
                );

            if (isOpen) {
                closeNotifPanel();
            } else {
                openNotifPanel();
            }
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
    const logoutModalOverlay =
        document.getElementById("logoutModalOverlay");

    function openLogout() {
        if (logoutModal) {
            logoutModal.classList.add("show");
            logoutModal.classList.add("open");
        }
    }

    function closeLogout() {
        if (logoutModal) {
            logoutModal.classList.remove("show");
            logoutModal.classList.remove("open");
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            openLogout();
        });
    }

    if (cancelLogout) {
        cancelLogout.addEventListener("click", closeLogout);
    }

    if (logoutModalOverlay) {
        logoutModalOverlay.addEventListener("click", closeLogout);
    }

    if (confirmLogout) {
        confirmLogout.addEventListener("click", () => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("rememberLogin");
            localStorage.removeItem("valobloxUser");

            window.location.href = "login.html";
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNotifPanel();
            closeLogout();
        }
    });
}

const translations = {
    en: {
        dashboard: "Dashboard",
        applications: "Applications",
        installments: "Installments",
        settings: "Settings",
        logout: "Logout",
        adminPortal: "Admin Portal",
        managementSystem: "Management System",
        profileInformation: "Profile Information",
        profileDescription: "Manage your account information and profile settings.",
        changePhoto: "Change Photo",
        fullName: "Full Name",
        username: "Username",
        emailAddress: "Email Address",
        administrativeRole: "Administrative Role",
        roleHint: "Your administrative role cannot be changed.",
        edit: "Edit",
        saveChanges: "Save Changes",
        changesSaved: "Changes Saved Successfully",
        profileUpdated: "Your profile information has been updated.",
        security: "Security",
        securityDescription: "Manage your password and account security.",
        password: "Password",
        passwordDescription: "Keep your account secure with a strong password.",
        changePassword: "Change Password",
        systemPreferences: "System Preferences",
        systemDescription: "Customize your system experience.",
        emailNotifications: "Email Notifications",
        emailNotificationsDescription: "Receive notifications about account activity.",
        darkMode: "Dark Mode",
        darkModeDescription: "Use a darker appearance throughout the system.",
        language: "Language",
        languageDescription: "Select the language used by the system.",
        notifications: "Notifications",
        today: "Today",
        logoutTitle: "Log out?",
        logoutDescription: "Are you sure you want to log out of your account?",
        cancel: "Cancel",
        logOut: "Log Out",
        passwordUpdated: "Password Updated Successfully",
        passwordUpdatedDescription: "Your account security has been updated.",
        passwordUpdatedDescription2: "You can now use your new password to log in.",
        done: "Done",
        currentPassword: "Current Password",
        newPassword: "New Password",
        confirmNewPassword: "Confirm New Password",
        currentPasswordPlaceholder: "Enter current password",
        newPasswordPlaceholder: "Create new password",
        confirmPasswordPlaceholder: "Confirm new password",
        passwordRequirements: "Password Requirements",
        minimumCharacters: "Minimum 8 characters",
        uppercaseLetter: "At least one uppercase letter",
        numberOrSymbol: "At least one number or symbol",
        updatePassword: "Update Password",
        pendingApplications: "Pending Applications",
        reviewManageApplications: "Review and manage customer installment applications.",
        customerName: "Customer Name",
        dateSubmitted: "Date Submitted",
        status: "Status",
        action: "Action",
        approve: "Approve",
        reject: "Reject",
        reviewApplication: "Review Application",
        paymentHistory: "Payment History",
        customerProfile: "Customer Profile",
        identityDocuments: "Identity Documents",
        viewInformation: "View Information",
        pending: "Pending",
        paid: "Paid",
        overdue: "Overdue",
        upcoming: "Upcoming",
        filter: "Filter",
        search: "Search",
        total: "Total",
        amountPaid: "Amount Paid",
        balance: "Balance",
        productName: "Product Name",
        installmentDetails: "Installment Details",
        startDate: "Start Date",
        frequency: "Frequency",
        monthly: "Monthly",
        active: "Active",
        confirmRejection: "Confirm Rejection",
        rejectDescription: "Are you sure you want to reject this application?",
        confirmReject: "Confirm Reject",
        allInstallments: "All Installments",
        searchCustomerProduct: "Search by Customer Name, Product..."
    },

    fil: {
        dashboard: "Dashboard",
        applications: "Mga Aplikasyon",
        installments: "Mga Hulugan",
        settings: "Mga Setting",
        logout: "Mag-logout",
        adminPortal: "Admin Portal",
        managementSystem: "Sistema ng Pamamahala",
        profileInformation: "Impormasyon ng Profile",
        profileDescription: "Pamahalaan ang impormasyon at mga setting ng iyong account.",
        changePhoto: "Baguhin ang Larawan",
        fullName: "Buong Pangalan",
        username: "Username",
        emailAddress: "Email Address",
        administrativeRole: "Administratibong Tungkulin",
        roleHint: "Hindi maaaring baguhin ang iyong administratibong tungkulin.",
        edit: "I-edit",
        saveChanges: "I-save ang Mga Pagbabago",
        changesSaved: "Matagumpay na Na-save ang Mga Pagbabago",
        profileUpdated: "Na-update na ang impormasyon ng iyong profile.",
        security: "Seguridad",
        securityDescription: "Pamahalaan ang iyong password at seguridad ng account.",
        password: "Password",
        passwordDescription: "Panatilihing ligtas ang iyong account gamit ang matibay na password.",
        changePassword: "Baguhin ang Password",
        systemPreferences: "Mga Kagustuhan sa Sistema",
        systemDescription: "I-customize ang iyong karanasan sa system.",
        emailNotifications: "Mga Notification sa Email",
        emailNotificationsDescription: "Tumanggap ng mga notification tungkol sa aktibidad ng account.",
        darkMode: "Dark Mode",
        darkModeDescription: "Gumamit ng mas madilim na hitsura sa buong system.",
        language: "Wika",
        languageDescription: "Piliin ang wikang gagamitin ng system.",
        notifications: "Mga Notification",
        today: "Ngayon",
        logoutTitle: "Mag-logout?",
        logoutDescription: "Sigurado ka bang gusto mong mag-logout sa iyong account?",
        cancel: "Kanselahin",
        logOut: "Mag-logout",
        passwordUpdated: "Matagumpay na Nabago ang Password",
        passwordUpdatedDescription: "Na-update na ang seguridad ng iyong account.",
        passwordUpdatedDescription2: "Maaari mo nang gamitin ang bagong password sa pag-login.",
        done: "Tapos",
        currentPassword: "Kasalukuyang Password",
        newPassword: "Bagong Password",
        confirmNewPassword: "Kumpirmahin ang Bagong Password",
        currentPasswordPlaceholder: "Ilagay ang kasalukuyang password",
        newPasswordPlaceholder: "Gumawa ng bagong password",
        confirmPasswordPlaceholder: "Kumpirmahin ang bagong password",
        passwordRequirements: "Mga Kinakailangan sa Password",
        minimumCharacters: "Hindi bababa sa 8 character",
        uppercaseLetter: "Hindi bababa sa isang malaking titik",
        numberOrSymbol: "Hindi bababa sa isang numero o simbolo",
        updatePassword: "I-update ang Password",
        pendingApplications: "Mga Nakabinbing Aplikasyon",
        reviewManageApplications: "Suriin at pamahalaan ang mga installment application ng customer.",
        customerName: "Pangalan ng Customer",
        dateSubmitted: "Petsa ng Pagsumite",
        status: "Katayuan",
        action: "Aksyon",
        approve: "Aprubahan",
        reject: "Tanggihan",
        reviewApplication: "Suriin ang Aplikasyon",
        paymentHistory: "Kasaysayan ng Bayad",
        customerProfile: "Profile ng Customer",
        identityDocuments: "Mga Dokumento ng Pagkakakilanlan",
        viewInformation: "Tingnan ang Impormasyon",
        pending: "Nakabinbin",
        paid: "Bayad",
        overdue: "Overdue",
        upcoming: "Paparating",
        filter: "Salain",
        search: "Maghanap",
        total: "Kabuuan",
        amountPaid: "Halagang Nabayan",
        balance: "Balanse",
        productName: "Pangalan ng Produkto",
        installmentDetails: "Detalye ng Hulugan",
        startDate: "Petsa ng Pagsisimula",
        frequency: "Dalas ng Bayad",
        monthly: "Buwan-buwan",
        active: "Aktibo",
        confirmRejection: "Kumpirmahin ang Pagtanggi",
        rejectDescription: "Sigurado ka bang gusto mong tanggihan ang aplikasyong ito?",
        confirmReject: "Kumpirmahin ang Pagtanggi",
        allInstallments: "Lahat ng Hulugan",
        searchCustomerProduct: "Maghanap ayon sa Pangalan ng Customer, Produkto..."
    }
};

const automaticTranslations = {
    "Dashboard": "Dashboard",
    "Applications": "Mga Aplikasyon",
    "Installments": "Mga Hulugan",
    "Settings": "Mga Setting",
    "Logout": "Mag-logout",
    "Admin Portal": "Admin Portal",
    "Management System": "Sistema ng Pamamahala",
    "Notifications": "Mga Notification",
    "Today": "Ngayon",
    "Pending Applications": "Mga Nakabinbing Aplikasyon",
    "Review and manage customer installment applications.": "Suriin at pamahalaan ang mga installment application ng customer.",
    "Customer Name": "Pangalan ng Customer",
    "Date Submitted": "Petsa ng Pagsumite",
    "Status": "Katayuan",
    "Action": "Aksyon",
    "Approve": "Aprubahan",
    "Reject": "Tanggihan",
    "Review Application": "Suriin ang Aplikasyon",
    "Payment History": "Kasaysayan ng Bayad",
    "Customer Profile": "Profile ng Customer",
    "Identity Documents": "Mga Dokumento ng Pagkakakilanlan",
    "View Information": "Tingnan ang Impormasyon",
    "Pending": "Nakabinbin",
    "Paid": "Bayad",
    "Overdue": "Overdue",
    "Upcoming": "Paparating",
    "Filter": "Salain",
    "Search": "Maghanap",
    "Total": "Kabuuan",
    "Amount Paid": "Halagang Nabayan",
    "Balance": "Balanse",
    "Product Name": "Pangalan ng Produkto",
    "Installment Details": "Detalye ng Hulugan",
    "Start Date": "Petsa ng Pagsisimula",
    "Frequency": "Dalas ng Bayad",
    "Monthly": "Buwan-buwan",
    "Active": "Aktibo",
    "Confirm Rejection": "Kumpirmahin ang Pagtanggi",
    "Cancel": "Kanselahin",
    "Confirm Reject": "Kumpirmahin ang Pagtanggi",
    "Save Changes": "I-save ang Mga Pagbabago",
    "Change Password": "Baguhin ang Password"
};

const originalTextMap = new WeakMap();
const originalPlaceholderMap = new WeakMap();

function applyLanguage(language) {
    const selectedLanguage = translations[language]
        ? language
        : "en";

    const dictionary = translations[selectedLanguage];

    document.documentElement.lang =
        selectedLanguage === "fil"
            ? "fil"
            : "en";

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");

        if (dictionary[key]) {
            element.textContent = dictionary[key];
        }
    });

    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach((element) => {
            const key =
                element.getAttribute("data-i18n-placeholder");

            if (dictionary[key]) {
                element.placeholder = dictionary[key];
            }
        });

    document.querySelectorAll("body *").forEach((element) => {
        if (element.children.length === 0) {
            if (!originalTextMap.has(element)) {
                originalTextMap.set(
                    element,
                    element.textContent
                );
            }

            const originalText =
                originalTextMap.get(element).trim();

            if (selectedLanguage === "fil") {
                if (automaticTranslations[originalText]) {
                    element.textContent =
                        automaticTranslations[originalText];
                }
            } else {
                element.textContent = originalText;
            }
        }
    });

    document.querySelectorAll("input, textarea").forEach((element) => {
        if (!originalPlaceholderMap.has(element)) {
            originalPlaceholderMap.set(
                element,
                element.placeholder
            );
        }

        const originalPlaceholder =
            originalPlaceholderMap.get(element).trim();

        if (selectedLanguage === "fil") {
            if (
                originalPlaceholder ===
                "Search by Customer Name, Product..."
            ) {
                element.placeholder =
                    "Maghanap ayon sa Pangalan ng Customer, Produkto...";
            } else if (
                originalPlaceholder ===
                "Search applications..."
            ) {
                element.placeholder =
                    "Maghanap ng mga aplikasyon...";
            } else if (
                originalPlaceholder === "Search..."
            ) {
                element.placeholder = "Maghanap...";
            }
        } else {
            element.placeholder = originalPlaceholder;
        }
    });

    localStorage.setItem(
        "valobloxLanguage",
        selectedLanguage
    );
}

function applyDarkMode(enabled) {
    document.body.classList.toggle(
        "dark-mode",
        enabled
    );

    localStorage.setItem(
        "valobloxDarkMode",
        enabled ? "true" : "false"
    );
}

function initPreferences() {
    const savedDarkMode =
        localStorage.getItem("valobloxDarkMode") === "true";

    const savedLanguage =
        localStorage.getItem("valobloxLanguage") || "en";

    applyDarkMode(savedDarkMode);
    applyLanguage(savedLanguage);

    const darkModeToggle =
        document.getElementById("darkModeToggle");

    const languageSelect =
        document.getElementById("languageSelect");

    if (darkModeToggle) {
        darkModeToggle.checked = savedDarkMode;

        darkModeToggle.addEventListener("change", () => {
            applyDarkMode(
                darkModeToggle.checked
            );
        });
    }

    if (languageSelect) {
        languageSelect.value = savedLanguage;

        languageSelect.addEventListener("change", () => {
            applyLanguage(
                languageSelect.value
            );
        });
    }
}
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
        accountRole: "Account Role",
        roleHint: "Your administrative role cannot be changed.",
        customerRoleHint: "Your account role cannot be changed.",

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
        searchCustomerProduct: "Search by Customer Name, Product...",

        welcomeBack: "Welcome back",
        paymentReminder: "Payment Reminder",
        paymentReminderDescription: "Your next installment payment is due soon.",
        makePayment: "Make Payment",
        viewInstallment: "View Installment",
        currentBalance: "Current Balance",
        nextPayment: "Next Payment",
        dueDate: "Due Date",
        paymentProgress: "Payment Progress",
        quickActions: "Quick Actions",
        myInstallment: "My Installment",
        application: "Application",

        goodStanding: "Good Standing",
        accountStatus: "Account Status",
        activePlan: "Active Plan",
        paymentSchedule: "Payment Schedule",
        remaining: "Remaining",
        complete: "Complete",
        completed: "Completed",
        payNow: "Pay Now",
        installment: "Installment",

        totalBalancePaid: "Total Balance Paid",
        of: "of",
        nextPaymentDue: "Next Payment Due",

        applicationStatus: "Application Status",
        totalPending: "Total Pending",
        approved: "Approved",
        rejected: "Rejected",
        currentInstallment: "Current Installment",
        totalInstallment: "Total Installment",
        monthlyPayment: "Monthly Payment",
        remainingBalance: "Remaining Balance",
        paidPercentage: "Paid",
        installmentDetailsTitle: "Installment Details",
        applyNewInstallment: "Apply For A New Installment?",
        applyNow: "Apply Now",

        paymentInformation: "Payment Information",
        selectInstallments: "Select Installments",
        selectAll: "Select All",
        payAll: "Pay All",
        selectedInstallments: "Selected Installments",
        paymentTotal: "Payment Total",
        proceedPayment: "Proceed to Payment",

        welcomeToMOS: "Welcome to M.O.S",
        applicationApproved: "Application Approved",
        noNotifications: "No notifications"
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
        accountRole: "Tungkulin ng Account",
        roleHint: "Hindi maaaring baguhin ang iyong administratibong tungkulin.",
        customerRoleHint: "Hindi maaaring baguhin ang iyong tungkulin bilang customer.",

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
        amountPaid: "Halagang Nabayaran",
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
        searchCustomerProduct: "Maghanap ayon sa Pangalan ng Customer, Produkto...",

        welcomeBack: "Maligayang pagbabalik",
        paymentReminder: "Paalala sa Bayad",
        paymentReminderDescription: "Malapit na ang iyong susunod na hulog.",
        makePayment: "Magbayad",
        viewInstallment: "Tingnan ang Hulugan",
        currentBalance: "Kasalukuyang Balanse",
        nextPayment: "Susunod na Bayad",
        dueDate: "Takdang Petsa",
        paymentProgress: "Pag-usad ng Bayad",
        quickActions: "Mabilis na Aksyon",
        myInstallment: "Aking Hulugan",
        application: "Aplikasyon",

        goodStanding: "Maayos ang Katayuan",
        accountStatus: "Katayuan ng Account",
        activePlan: "Aktibong Plano",
        paymentSchedule: "Iskedyul ng Bayad",
        remaining: "Natitira",
        complete: "Kumpleto",
        completed: "Nakumpleto",
        payNow: "Magbayad Ngayon",
        installment: "Hulugan",

        totalBalancePaid: "Kabuuang Nabayaran",
        of: "mula sa",
        nextPaymentDue: "Susunod na Bayad",

        applicationStatus: "Katayuan ng Aplikasyon",
        totalPending: "Kabuuang Nakabinbin",
        approved: "Naaprubahan",
        rejected: "Tinanggihan",
        currentInstallment: "Kasalukuyang Hulugan",
        totalInstallment: "Kabuuang Hulugan",
        monthlyPayment: "Buwanang Bayad",
        remainingBalance: "Natitirang Balanse",
        paidPercentage: "Nabayaran",
        installmentDetailsTitle: "Detalye ng Hulugan",
        applyNewInstallment: "Mag-apply Para sa Bagong Hulugan?",
        applyNow: "Mag-apply Ngayon",

        paymentInformation: "Impormasyon ng Bayad",
        selectInstallments: "Pumili ng mga Hulugan",
        selectAll: "Piliin Lahat",
        payAll: "Bayaran Lahat",
        selectedInstallments: "Napiling mga Hulugan",
        paymentTotal: "Kabuuang Bayad",
        proceedPayment: "Magpatuloy sa Pagbabayad",

        welcomeToMOS: "Maligayang Pagdating sa M.O.S",
        applicationApproved: "Naaprubahan ang Aplikasyon",
        noNotifications: "Walang mga notification"
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

    "My Installment": "Aking Hulugan",
    "Application": "Aplikasyon",
    "Welcome": "Maligayang Pagdating",
    "Welcome back": "Maligayang pagbabalik",
    "Welcome back, Jea!": "Maligayang pagbabalik, Jea!",
    "Welcome to M.O.S": "Maligayang Pagdating sa M.O.S",

    "Payment Reminder": "Paalala sa Bayad",
    "Your next installment payment is due soon.": "Malapit na ang iyong susunod na hulog.",
    "Make Payment": "Magbayad",
    "View Installment": "Tingnan ang Hulugan",

    "Current Balance": "Kasalukuyang Balanse",
    "Next Payment": "Susunod na Bayad",
    "Due Date": "Takdang Petsa",
    "Payment Progress": "Pag-usad ng Bayad",
    "Quick Actions": "Mabilis na Aksyon",

    "Good Standing": "Maayos ang Katayuan",
    "Account Status": "Katayuan ng Account",
    "Active Plan": "Aktibong Plano",
    "Payment Schedule": "Iskedyul ng Bayad",
    "Remaining": "Natitira",
    "Complete": "Kumpleto",
    "Completed": "Nakumpleto",
    "Pay Now": "Magbayad Ngayon",
    "Installment": "Hulugan",

    "Total Balance Paid": "Kabuuang Nabayaran",
    "of": "mula sa",
    "Next Payment Due": "Susunod na Bayad",

    "Application Status": "Katayuan ng Aplikasyon",
    "Total Pending": "Kabuuang Nakabinbin",
    "Approved": "Naaprubahan",
    "Rejected": "Tinanggihan",
    "Current Installment": "Kasalukuyang Hulugan",
    "Total Installment": "Kabuuang Hulugan",
    "Monthly Payment": "Buwanang Bayad",
    "Remaining Balance": "Natitirang Balanse",
    "Paid": "Bayad",

    "Installment Details": "Detalye ng Hulugan",
    "Apply For A New Installment?": "Mag-apply Para sa Bagong Hulugan?",
    "Apply Now": "Mag-apply Ngayon",

    "Payment Information": "Impormasyon ng Bayad",
    "Select Installments": "Pumili ng mga Hulugan",
    "Select All": "Piliin Lahat",
    "Pay All": "Bayaran Lahat",
    "Selected Installments": "Napiling mga Hulugan",
    "Payment Total": "Kabuuang Bayad",
    "Proceed to Payment": "Magpatuloy sa Pagbabayad",

    "Pending": "Nakabinbin",
    "Overdue": "Overdue",
    "Upcoming": "Paparating",

    "Filter": "Salain",
    "Search": "Maghanap",
    "Total": "Kabuuan",
    "Amount Paid": "Halagang Nabayaran",
    "Balance": "Balanse",
    "Product Name": "Pangalan ng Produkto",
    "Start Date": "Petsa ng Pagsisimula",
    "Frequency": "Dalas ng Bayad",
    "Monthly": "Buwan-buwan",
    "Active": "Aktibo",

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

    "Confirm Rejection": "Kumpirmahin ang Pagtanggi",
    "Cancel": "Kanselahin",
    "Confirm Reject": "Kumpirmahin ang Pagtanggi",

    "Save Changes": "I-save ang Mga Pagbabago",
    "Change Password": "Baguhin ang Password",

    "Profile Information": "Impormasyon ng Profile",
    "Manage your account information and profile settings.": "Pamahalaan ang impormasyon at mga setting ng iyong account.",
    "Change Photo": "Baguhin ang Larawan",
    "Full Name": "Buong Pangalan",
    "Username": "Username",
    "Email Address": "Email Address",
    "Administrative Role": "Administratibong Tungkulin",
    "Account Role": "Tungkulin ng Account",

    "Edit": "I-edit",
    "Changes Saved Successfully": "Matagumpay na Na-save ang Mga Pagbabago",
    "Your profile information has been updated.": "Na-update na ang impormasyon ng iyong profile.",

    "Security": "Seguridad",
    "Manage your password and account security.": "Pamahalaan ang iyong password at seguridad ng account.",
    "Password": "Password",
    "Keep your account secure with a strong password.": "Panatilihing ligtas ang iyong account gamit ang matibay na password.",

    "System Preferences": "Mga Kagustuhan sa Sistema",
    "Customize your system experience.": "I-customize ang iyong karanasan sa system.",
    "Email Notifications": "Mga Notification sa Email",
    "Receive notifications about account activity.": "Tumanggap ng mga notification tungkol sa aktibidad ng account.",
    "Dark Mode": "Dark Mode",
    "Use a darker appearance throughout the system.": "Gumamit ng mas madilim na hitsura sa buong system.",
    "Language": "Wika",
    "Select the language used by the system.": "Piliin ang wikang gagamitin ng system.",

    "Log out?": "Mag-logout?",
    "Are you sure you want to log out of your account?": "Sigurado ka bang gusto mong mag-logout sa iyong account?",
    "Log Out": "Mag-logout",

    "Current Password": "Kasalukuyang Password",
    "New Password": "Bagong Password",
    "Confirm New Password": "Kumpirmahin ang Bagong Password",
    "Password Requirements": "Mga Kinakailangan sa Password",
    "Minimum 8 characters": "Hindi bababa sa 8 character",
    "At least one uppercase letter": "Hindi bababa sa isang malaking titik",
    "At least one number or symbol": "Hindi bababa sa isang numero o simbolo",
    "Update Password": "I-update ang Password",

    "Password Updated Successfully": "Matagumpay na Nabago ang Password",
    "Your account security has been updated.": "Na-update na ang seguridad ng iyong account.",
    "You can now use your new password to log in.": "Maaari mo nang gamitin ang bagong password sa pag-login.",
    "Done": "Tapos",

    "Application Approved": "Naaprubahan ang Aplikasyon",
    "No notifications": "Walang mga notification",
    "Installment System": "Sistema ng Hulugan",
    "Application": "Aplikasyon",
    "Here is a summary of your recent activity and applications.": "Narito ang buod ng iyong kamakailang aktibidad at mga aplikasyon.",
    "Your next installment payment is approaching.": "Malapit na ang iyong susunod na hulog.",
    "Amount Due": "Halagang Dapat Bayaran",
    "5 days remaining": "5 araw na natitira",
    "Pay Installments": "Magbayad ng mga Hulugan",
    "Total Amount": "Kabuuang Halaga",
    "Original installment amount": "Orihinal na halaga ng hulugan",
    "Total payments made": "Kabuuang mga bayad",
    "Remaining to be paid": "Natitirang babayaran",
    "0% Paid": "0% Nabayaran",
    "0 payments completed": "0 bayad ang nakumpleto",
    "12 payments remaining": "12 bayad ang natitira",
    "Pay your next installment": "Bayaran ang iyong susunod na hulog",
    "Check your payment schedule": "Tingnan ang iyong iskedyul ng bayad",
    "View Application": "Tingnan ang Aplikasyon",
    "Check your application status": "Tingnan ang katayuan ng iyong aplikasyon",
    "Recent": "Kamakailan",
    "Your installment application has been approved.": "Naaprubahan ang iyong aplikasyon para sa hulugan.",
    "Welcome to Maryanne's Online Shop installment system.": "Maligayang pagdating sa sistema ng hulugan ng Maryanne's Online Shop.",
    "Close notifications": "Isara ang mga notification",
    "Installment System": "Sistema ng Hulugan",
"Installments": "Mga Hulugan",
"Applications": "Mga Aplikasyon",
"Settings": "Mga Setting",
"Logout": "Mag-logout",

"Search by Customer Name, Product...": "Maghanap ayon sa Pangalan ng Customer, Produkto...",
"Pending": "Nakabinbin",
"Paid": "Bayad",
"Overdue": "Lampas sa Takdang Petsa",
"Filter": "Salain",
"All Installments": "Lahat ng Hulugan",
"Showing 5 of 5 installments": "Ipinapakita ang 5 sa 5 hulugan",
"No installments found.": "Walang nahanap na hulugan.",

"Customer Name": "Pangalan ng Customer",
"Product Name": "Pangalan ng Produkto",
"Total": "Kabuuan",
"Amount Paid": "Halagang Nabayaran",
"Balance": "Balanse",
"Status": "Katayuan",
"Action": "Aksyon",

"Notifications": "Mga Notification",
"Today": "Ngayon",
"Recent": "Kamakailan",

"New Payment Submitted": "Bagong Isinumiteng Bayad",
"Overdue Payment Alert": "Alerto sa Lampas na Bayad",

"Please review and confirm the payment.": "Pakisuri at kumpirmahin ang bayad.",
"Please check the account and follow up.": "Pakisuri ang account at magsagawa ng follow-up.",

"Log out?": "Mag-logout?",
"Are you sure you want to log out of your account?": "Sigurado ka bang gusto mong mag-logout sa iyong account?",
"Cancel": "Kanselahin",
"Log Out": "Mag-logout",
"Review Payment": "Suriin ang Bayad",
        "Confirm the details of your selected installments before proceeding.": "Kumpirmahin ang mga detalye ng iyong napiling mga hulugan bago magpatuloy.",
        "Selected Installments": "Mga Napiling Hulugan",
        "Installment #3": "Hulugan #3",
        "Due: October 1, 2023": "Takdang Petsa: Oktubre 1, 2023",
        "Payment Method": "Paraan ng Pagbabayad",
        "Pay using your GCash e-wallet": "Magbayad gamit ang iyong GCash e-wallet",
        "Pay using your Maya account": "Magbayad gamit ang iyong Maya account",
        "Direct transfer via InstaPay / PESONet": "Direktang transfer gamit ang InstaPay / PESONet",
        "Bank Transfer": "Bank Transfer",
        "Back to My Installments": "Bumalik sa Aking mga Hulugan",
        "Payment Summary": "Buod ng Bayad",
        "Convenience Fee": "Convenience Fee",
        "Total to Pay": "Kabuuang Babayaran",
        "Confirm Payment": "Kumpirmahin ang Bayad",
        "By confirming, you agree to the Terms of Service.": "Sa pagkumpirma, sumasang-ayon ka sa Terms of Service.",
        "Notifications": "Mga Notification",
        "Recent": "Kamakailan",
        "Payment Reminder": "Paalala sa Bayad",
        "Your next installment payment of": "Ang iyong susunod na hulog na",
        "is due on": "ay dapat bayaran sa",
        "Application Approved": "Naaprubahan ang Aplikasyon",
        "Your installment application has been approved.": "Naaprubahan na ang iyong installment application.",
        "Welcome to M.O.S": "Maligayang Pagdating sa M.O.S",
        "Welcome to Maryanne's Online Shop installment system.": "Maligayang pagdating sa installment system ng Maryanne's Online Shop.",
        "Installment System": "Sistema ng Hulugan",
"Make Payment": "Magbayad",
"Scan / Pay": "I-scan / Magbayad",
"Complete your installment payment securely.": "Kumpletuhin nang ligtas ang iyong hulog.",
"Total Amount Due": "Kabuuang Halagang Dapat Bayaran",
"Scan the QR code to complete your payment.": "I-scan ang QR code upang makumpleto ang iyong bayad.",
"Open your preferred banking or e-wallet app, scan the code above, and input the exact amount.": "Buksan ang iyong napiling banking o e-wallet app, i-scan ang code sa itaas, at ilagay ang eksaktong halaga.",
"Upload Proof of Payment": "Mag-upload ng Katibayan ng Bayad",
"Upload a screenshot or receipt after paying.": "Mag-upload ng screenshot o resibo pagkatapos magbayad.",
"Drag and drop your receipt here": "I-drag at i-drop ang iyong resibo dito",
"Choose File": "Pumili ng File",
"Make sure the uploaded receipt clearly shows the payment amount and transaction details.": "Siguraduhing malinaw na ipinapakita ng na-upload na resibo ang halaga ng bayad at mga detalye ng transaksyon.",
"Back": "Bumalik",
"Submit Payment": "Isumite ang Bayad",
"Payment Submitted": "Naipasa ang Bayad",
"Your payment proof has been submitted and is waiting for verification.": "Naipasa na ang iyong katibayan ng bayad at naghihintay ng beripikasyon.",
"Amount": "Halaga",
"Installments": "Mga Hulugan",
"Status": "Katayuan",
"For Verification": "Para sa Beripikasyon",
"Back to My Installments": "Bumalik sa Aking mga Hulugan",
"Application": "Aplikasyon",
"Application Status": "Katayuan ng Aplikasyon",
"Current Installment": "Kasalukuyang Hulugan",
"Pay Installment": "Magbayad ng Hulugan",
"Total Installment": "Kabuuang Hulugan",
"Monthly Payment": "Buwanang Bayad",
"Remaining Balance": "Natitirang Balanse",
"Next Due Date": "Susunod na Takdang Petsa",
"Paid": "Nabayaran",
"Installment Details": "Detalye ng Hulugan",
"Product": "Produkto",
"Installment Term": "Termino ng Hulugan",
"Application Date": "Petsa ng Aplikasyon",
"Apply For A New Installment?": "Mag-apply Para sa Bagong Hulugan?",
"Apply for a new installment plan today. Fast approval for existing institutional clients.": "Mag-apply para sa bagong installment plan ngayon. Mabilis na approval para sa mga kasalukuyang institutional client.",
"APPLY INSTALLMENT": "MAG-APPLY NG HULUGAN"
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

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const key = element.getAttribute("data-i18n-placeholder");

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
            } else if (
                originalPlaceholder === "Enter current password"
            ) {
                element.placeholder =
                    "Ilagay ang kasalukuyang password";
            } else if (
                originalPlaceholder === "Create new password"
            ) {
                element.placeholder =
                    "Gumawa ng bagong password";
            } else if (
                originalPlaceholder === "Confirm new password"
            ) {
                element.placeholder =
                    "Kumpirmahin ang bagong password";
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
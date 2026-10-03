// =========================================
// ELEMENTS
// =========================================

const themeButton =
    document.getElementById("theme-toggle");

const loginOpenButton =
    document.getElementById("login-open-button");

const loginOverlay =
    document.getElementById("login-overlay");

const closeLoginButton =
    document.getElementById("close-login");

const loginSubmit =
    document.getElementById("login-submit");

const registerSubmit =
    document.getElementById("register-submit");

const usernameInput =
    document.getElementById("username-input");

const passwordInput =
    document.getElementById("password-input");

const loginMessage =
    document.getElementById("login-message");

const userArea =
    document.getElementById("user-area");

const accountStatus =
    document.getElementById("account-status");

const searchInput =
    document.getElementById("subject-search");

const noResults =
    document.getElementById("no-results");

const cards =
    document.querySelectorAll(".subject-card");

const checkboxes =
    document.querySelectorAll(".subject-checkbox");

const progressText =
    document.getElementById("progress-text");

const progressPercentage =
    document.getElementById("progress-percentage");

const progressFill =
    document.getElementById("progress-fill");



// =========================================
// ACCOUNT STORAGE
// =========================================

// Accounts are stored like:
//
// {
//     omar: {
//         password: "..."
//     },
//     ali: {
//         password: "..."
//     }
// }

let accounts =
    JSON.parse(
        localStorage.getItem("examHubAccounts")
    ) || {};



// Current logged-in username
let currentUser =
    localStorage.getItem("examHubCurrentUser");



// =========================================
// PASSWORD HASH
// =========================================

// This hides the plain password from localStorage.
//
// IMPORTANT:
// It is still NOT secure like a real server login.

async function hashPassword(password) {

    const encoder =
        new TextEncoder();

    const data =
        encoder.encode(password);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );

    const hashHex =
        hashArray
            .map(function (byte) {

                return byte
                    .toString(16)
                    .padStart(2, "0");

            })
            .join("");

    return hashHex;

}



// =========================================
// CURRENT STORAGE NAME
// =========================================

function getProgressStorageName() {

    if (currentUser) {

        return (
            "examHubProgress_" +
            currentUser
        );

    }

    return "examHubProgress_guest";

}



// =========================================
// GET SAVED PROGRESS
// =========================================

function getSavedProgress() {

    const saved =
        localStorage.getItem(
            getProgressStorageName()
        );

    if (!saved) {

        return [];

    }

    return JSON.parse(saved);

}



// =========================================
// SAVE PROGRESS
// =========================================

function saveProgress() {

    const completedSubjects = [];


    checkboxes.forEach(function (checkbox) {

        if (checkbox.checked) {

            completedSubjects.push(
                checkbox.dataset.subject
            );

        }

    });


    localStorage.setItem(
        getProgressStorageName(),
        JSON.stringify(completedSubjects)
    );

}



// =========================================
// LOAD PROGRESS
// =========================================

function loadProgress() {

    const completed =
        getSavedProgress();


    checkboxes.forEach(function (checkbox) {

        const subject =
            checkbox.dataset.subject;

        const card =
            checkbox.closest(
                ".subject-card"
            );


        if (completed.includes(subject)) {

            checkbox.checked = true;

            card.classList.add(
                "completed"
            );

        }

        else {

            checkbox.checked = false;

            card.classList.remove(
                "completed"
            );

        }

    });


    updateProgress();

}



// =========================================
// UPDATE PROGRESS BAR
// =========================================

function updateProgress() {

    const total =
        checkboxes.length;


    const finished =
        document.querySelectorAll(
            ".subject-checkbox:checked"
        ).length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (finished / total) * 100
            );

    }


    if (progressText) {

        progressText.textContent =
            finished +
            " of " +
            total +
            " subjects finished";

    }


    if (progressPercentage) {

        progressPercentage.textContent =
            percentage + "%";

    }


    if (progressFill) {

        progressFill.style.width =
            percentage + "%";

    }

}



// =========================================
// CHECKBOX EVENTS
// =========================================

checkboxes.forEach(function (checkbox) {

    checkbox.addEventListener(
        "change",
        function () {

            const card =
                checkbox.closest(
                    ".subject-card"
                );


            if (checkbox.checked) {

                card.classList.add(
                    "completed"
                );

            }

            else {

                card.classList.remove(
                    "completed"
                );

            }


            saveProgress();

            updateProgress();

        }
    );

});



// =========================================
// OPEN LOGIN
// =========================================

if (loginOpenButton) {

    loginOpenButton.addEventListener(
        "click",
        function () {

            loginOverlay.classList.remove(
                "hidden"
            );

            usernameInput.focus();

        }
    );

}



// =========================================
// CLOSE LOGIN
// =========================================

function closeLoginWindow() {

    loginOverlay.classList.add(
        "hidden"
    );

    loginMessage.textContent = "";

    loginMessage.className =
        "login-message";

    passwordInput.value = "";

}


if (closeLoginButton) {

    closeLoginButton.addEventListener(
        "click",
        closeLoginWindow
    );

}



// Click outside the login box
if (loginOverlay) {

    loginOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                loginOverlay
            ) {

                closeLoginWindow();

            }

        }
    );

}



// =========================================
// CREATE ACCOUNT
// =========================================

if (registerSubmit) {

    registerSubmit.addEventListener(
        "click",
        async function () {

            const username =
                usernameInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;


            // Username checks

            if (username.length < 3) {

                showLoginError(
                    "Username must have at least 3 characters."
                );

                return;

            }


            if (username.includes(" ")) {

                showLoginError(
                    "Username cannot contain spaces."
                );

                return;

            }


            // Password check

            if (password.length < 4) {

                showLoginError(
                    "Password must have at least 4 characters."
                );

                return;

            }


            // Existing account

            if (accounts[username]) {

                showLoginError(
                    "That username already exists."
                );

                return;

            }


            const passwordHash =
                await hashPassword(
                    password
                );


            accounts[username] = {
                password: passwordHash
            };


            localStorage.setItem(
                "examHubAccounts",
                JSON.stringify(accounts)
            );


            showLoginSuccess(
                "Account created! You can now login."
            );


            passwordInput.value = "";

        }
    );

}



// =========================================
// LOGIN
// =========================================

if (loginSubmit) {

    loginSubmit.addEventListener(
        "click",
        async function () {

            const username =
                usernameInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;


            if (!accounts[username]) {

                showLoginError(
                    "Account does not exist."
                );

                return;

            }


            const passwordHash =
                await hashPassword(
                    password
                );


            if (
                accounts[username].password
                !== passwordHash
            ) {

                showLoginError(
                    "Wrong password."
                );

                return;

            }


            // Successful login

            currentUser = username;


            localStorage.setItem(
                "examHubCurrentUser",
                username
            );


            updateAccountUI();

            loadProgress();

            closeLoginWindow();

        }
    );

}



// =========================================
// LOGIN WITH ENTER KEY
// =========================================

if (passwordInput) {

    passwordInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                loginSubmit.click();

            }

        }
    );

}



// =========================================
// LOGIN MESSAGES
// =========================================

function showLoginError(message) {

    loginMessage.textContent =
        message;

    loginMessage.className =
        "login-message error";

}


function showLoginSuccess(message) {

    loginMessage.textContent =
        message;

    loginMessage.className =
        "login-message success";

}



// =========================================
// ACCOUNT UI
// =========================================

function updateAccountUI() {

    if (!userArea) {

        return;

    }


    if (currentUser) {

        userArea.innerHTML = `

            <div class="logged-user">

                <span class="username-label">
                    👤 ${currentUser}
                </span>

                <button
                    id="logout-button"
                    class="logout-button"
                >
                    Logout
                </button>

            </div>

        `;


        accountStatus.textContent =
            "✓ Progress is saved for @" +
            currentUser;

        accountStatus.classList.add(
            "logged-in"
        );


        const logoutButton =
            document.getElementById(
                "logout-button"
            );


        logoutButton.addEventListener(
            "click",
            logout
        );

    }

    else {

        userArea.innerHTML = `

            <button
                id="login-open-button-new"
                class="account-button"
            >
                👤 Login
            </button>

        `;


        accountStatus.textContent =
            "You are using Guest Mode. Login to use separate account progress.";

        accountStatus.classList.remove(
            "logged-in"
        );


        const newLoginButton =
            document.getElementById(
                "login-open-button-new"
            );


        newLoginButton.addEventListener(
            "click",
            function () {

                loginOverlay.classList.remove(
                    "hidden"
                );

                usernameInput.focus();

            }
        );

    }

}



// =========================================
// LOGOUT
// =========================================

function logout() {

    currentUser = null;


    localStorage.removeItem(
        "examHubCurrentUser"
    );


    updateAccountUI();

    loadProgress();

}



// =========================================
// SEARCH
// =========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const searchText =
                searchInput.value
                    .trim()
                    .toLowerCase();


            let visibleCards = 0;


            cards.forEach(
                function (card) {

                    const subjectName =
                        card.dataset.name
                            .toLowerCase();


                    if (
                        subjectName.includes(
                            searchText
                        )
                    ) {

                        card.classList.remove(
                            "hidden"
                        );

                        visibleCards++;

                    }

                    else {

                        card.classList.add(
                            "hidden"
                        );

                    }

                }
            );


            if (noResults) {

                if (visibleCards === 0) {

                    noResults.classList.remove(
                        "hidden"
                    );

                }

                else {

                    noResults.classList.add(
                        "hidden"
                    );

                }

            }

        }
    );

}



// =========================================
// DARK MODE
// =========================================

if (themeButton) {

    const savedTheme =
        localStorage.getItem(
            "examHubTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );

        themeButton.textContent =
            "☀️";

    }


    themeButton.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark"
            );


            if (
                document.body.classList.contains(
                    "dark"
                )
            ) {

                themeButton.textContent =
                    "☀️";

                localStorage.setItem(
                    "examHubTheme",
                    "dark"
                );

            }

            else {

                themeButton.textContent =
                    "🌙";

                localStorage.setItem(
                    "examHubTheme",
                    "light"
                );

            }

        }
    );

}



// =========================================
// PAGE START
// =========================================

updateAccountUI();

loadProgress();

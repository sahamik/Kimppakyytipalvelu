// Demo käyttäjän tunnukset
const käyttäjätunnus = "käyttäjä";
const salasana = "password";

const users = {};

// Tapahtumakäsittelija, kun registrationLink linkkiä painetaan
document.getElementById("registrationLink").addEventListener("click", showRegistrationForm);
// Tapahtumakäsittelija, kun loginLink linkkiä painetaan
document.getElementById("loginLink").addEventListener("click", showLoginForm);
// Tapahtumakäsittelijä sisäänkirjautumis lomakkeen lähettämiseen
document.getElementById("loginForm").addEventListener("submit", login);
// Tapahtumakäsittelijä rekisteröitymis lomakkeen lähettämiseen
document.getElementById("registrationForm").addEventListener("submit", register);


// Rekisteröintilomakkeen alustaminen tyhjäksi sekä lomakkeen näyttäminen ja kirjautumislomakkeen piilottaminen
function showRegistrationForm() {
    document.getElementById("newUser").value = "";
    document.getElementById("newEmail").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("newPassword2").value = "";
    document.getElementById("loginPage").style.height = "650px";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registrationForm").style.display = "block";
    document.getElementById("loginLink").style.display = "block";
    document.getElementById("option2").style.display = "block";
    document.getElementById("registrationLink").style.display = "none";
    document.getElementById("option1").style.display = "none";
    document.getElementById("loginText").style.display = "none";
}

// Kirjautumislomakkeen alustaminen tyhjäksi sekä lomakkeen näyttäminen ja rekisteröintilomakkeen piilottaminen
function showLoginForm() {
    document.getElementById("userName").value = "";
    document.getElementById("password").value = "";
    document.getElementById("loginPage").style.height = "550px";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registrationForm").style.display = "none";
    document.getElementById("loginLink").style.display = "none";
    document.getElementById("option2").style.display = "none";
    document.getElementById("registrationLink").style.display = "block";
    document.getElementById("option1").style.display = "block";
    document.getElementById("loginText").style.display = "block";
    document.getElementById("userNameError").style.display = "none";
    document.getElementById("userEmailError").style.display = "none";
    document.getElementById("userPasswordError").style.display = "none";
    document.getElementById("userPasswordError2").style.display = "none";
}

// Tunnusten tutkiminen ja sisäänkirjautuminen
function login(event) {
    event.preventDefault();
    const userName = document.getElementById("userName").value;
    const password = document.getElementById("password").value;
    const storedUsers = JSON.parse(localStorage.getItem("users"));

    if(userName === käyttäjätunnus && password === salasana || storedUsers && storedUsers[userName] && storedUsers[userName].password === password) {
        window.location.href = "mainPage.html";
    } else {
        document.getElementById("userError").style.display = "block";
    }
} 

// Käyttäjän rekisteröiminen ja tallentaminen localStorageen
function register(event) {
    event.preventDefault();
    const newUser = document.getElementById("newUser").value;
    const newEmail = document.getElementById("newEmail").value;
    const newPassword = document.getElementById("newPassword").value;
    const newPassword2 = document.getElementById("newPassword2").value;

    if (users[newUser]) {
        document.getElementById("userNameError").style.display = "block";
        return;
    }

    const user = {
        username: newUser,
        email: newEmail,
        password: newPassword,
        password2: newPassword2
    };

    if (!validateUser(newUser, newEmail, newPassword, newPassword2)) {
        return;
    }

    users[newUser] = user;

    localStorage.setItem("users", JSON.stringify(users));

    // Tyhjennetään rekisteröintilomakkeen kentät
    document.getElementById("newUser").value = "";
    document.getElementById("newEmail").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("newPassword2").value = "";

    // Näytetään kirjautumislomake
    showLoginForm();
}

// Käyttäjän tietojen validointi rekisteröintilomakkeeseen
function validateUser(username, email, password, password2) {
    let userNameError = document.getElementById("userNameError");
    let newErrorText = userNameError.querySelector(".errorText");

    if (username.length < 6) {
        document.getElementById("userNameError").style.display = "block";
        newErrorText.innerHTML = "Käyttäjänimen tulee olla vähintään 6<br> merkkiä pitkä";
        return false;
    }
    if (!validateEmail(email))  {
        document.getElementById("userEmailError").style.display = "block";
        return false;
    }
    if (password.length < 8 || !/[a-z]/g.test(password) || !/[A-Z]/g.test(password) || !/[0-9]/g.test(password)) {
        document.getElementById("userPasswordError").style.display = "block";
        return false;
    }
    if (password !== password2) {
        document.getElementById("userPasswordError2").style.display = "block";
        return false;
    }
    newErrorText.innerHTML = "Antamasi käyttäjätunnus on jo olemassa";
    return true;
}

// Sähköpostiosoitteen validointi
function validateEmail(email) {
    let mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if(email.match(mailformat)) {
        return true;
    } else {
        alert("Sähköpostiosoitteen tulee olla sähköpostiosoitteen muotoinen.");
        return false;
    }
}
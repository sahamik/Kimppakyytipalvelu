
const käyttäjätunnus = "käyttäjä";
const salasana = "password";


// Tapahtumakäsittelija, kun registrationLinki linkkiä painetaan
document.getElementById("registrationLink").addEventListener("click", showRegistrationForm);
// Tapahtumakäsittelija, kun loginLink linkkiä painetaan
document.getElementById("loginLink").addEventListener("click", showLoginForm);
// Sisäänkirjautuminen
document.getElementById("loginForm").addEventListener("submit", login);


// Rekisteröintilomakkeen näyttäminen ja kirjautumislomakkeen piilottaminen
function showRegistrationForm(event) {
    event.preventDefault();
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registrationForm").style.display = "block";
    document.getElementById("loginLink").style.display = "block";
    document.getElementById("registrationLink").style.display = "none";
}

// Kirjautumislomakkeen näyttäminen ja rekisteröintilomakkeen piilottaminen
function showLoginForm(event) {
    event.preventDefault();
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registrationForm").style.display = "none";
    document.getElementById("loginLink").style.display = "none";
    document.getElementById("registrationLink").style.display = "block";
}

// Tunnusten tutkiminen ja sisäänkirjautuminen
function login(event) {
    event.preventDefault();
    const userName = document.getElementById("userName").value;
    const password = document.getElementById("password").value;

    if(userName === käyttäjätunnus && password === salasana) {
        window.location.href = "mainPage.html";
    } else {
        alert("Käyttäjätunnus tai salasana on väärä!")
    }
} 
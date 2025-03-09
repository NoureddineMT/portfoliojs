let moon = document.getElementById("moon")
let sun = document.getElementById("sun")
let bgDark = document.querySelectorAll(".bg-darkgrey");
let bgLight = document.querySelectorAll(".bg-white");
let progressBar = document.querySelectorAll(".progress")
let darkgreyText = document.querySelectorAll(".text-darkgrey")
let colorChange2 = document.querySelectorAll(".color-change2")
let colorChange3 = document.querySelectorAll(".color-change3")

$(window).scroll(function () {
    var height = $(window).scrollTop();
    if (height > 5) {
        $("nav").addClass("bg-darkgrey shadow-sm").removeClass("bg-invisible");
    } else {
        $("nav").addClass("bg-invisible").removeClass("bg-darkgrey shadow-sm");
    }
});

function themeChange(list, firstClass, secondClass) {
    for (let i = 0; i < list.length; i++) {
        list[i].classList.add(firstClass);
        list[i].classList.remove(secondClass);
    }
}
moon.addEventListener("click", function () {
    this.classList.add("d-none");
    sun.classList.remove("d-none");
    themeChange(bgLight, "bg-darkgrey", "bg-white")
    themeChange(progressBar, "bg-white", "bg-darkgrey")
    themeChange(darkgreyText, "text-white", "text-darkgrey")
    themeChange(colorChange3, "color-change5", "color-change3")
    themeChange(colorChange2, "color-change4", "color-change2")

})

sun.addEventListener("click", function () {
    this.classList.add("d-none")
    moon.classList.remove("d-none")
    themeChange(bgLight, "bg-white", "bg-darkgrey")
    themeChange(progressBar, "bg-darkgrey", "bg-white")
    themeChange(darkgreyText, "text-darkgrey", "text-white")
    themeChange(colorChange3, "color-change3", "color-change5")
    themeChange(colorChange2, "color-change2", "color-change4")

})
// Inizializza Email.js con le tue credenziali API
emailjs.init("user_L4nfiowxPEOb4DM8LyTtv");

// Funzione per impostare un cookie
function setCookie(name, value, hours) {
    let date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// Funzione per ottenere un cookie
function getCookie(name) {
    let cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [key, value] = cookie.split("=");
        if (key === name) {
            return value;
        }
    }
    return null;
}

// Funzione per controllare se l'utente ha già inviato un'email
function checkEmailSent() {
    let lastSent = getCookie("emailSent");
    let sendButton = document.getElementById("sendButton");

    if (lastSent) {
        sendButton.disabled = true;
        sendButton.innerText = "You have to wait 24 hours";
    }
}

// Funzione per inviare l'email
function sendEmail() {
    let sendButton = document.querySelector("#sendButton");
    let recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
        alert("Please complete the CAPTCHA before sending the message.");
        return;
    }

    // Disabilita il pulsante per evitare spam
    sendButton.disabled = true;
    sendButton.innerText = "Sending...";

    let data = {
        from_name: document.getElementById("from_name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
        "g-recaptcha-response": recaptchaResponse
    };

    emailjs.send("service_lqfv46f", "template_dnxwwsr", data)
        .then(response => {
            console.log("Email inviata con successo:", response);

            // Imposta il cookie per bloccare il pulsante per 24 ore
            setCookie("emailSent", "true", 24);

            // Mostra il messaggio di conferma
            let successMessage = document.createElement("div");
            successMessage.className = "alert alert-success mt-3";
            successMessage.innerText = "Your message has been sent successfully!";
            document.getElementById("contactForm").appendChild(successMessage);

            // Reset del form e CAPTCHA
            document.getElementById("contactForm").reset();
            grecaptcha.reset();

            // Disabilita il pulsante fino a quando non scade il cookie
            sendButton.innerText = "You have to wait 24 hours";
        })
        .catch(error => {
            console.error("Errore durante l'invio dell'email:", error);

            let errorMessage = document.createElement("div");
            errorMessage.className = "alert alert-danger mt-3";
            errorMessage.innerText = "Failed to send message. Please try again.";
            document.getElementById("contactForm").appendChild(errorMessage);

            // Riattiva il pulsante dopo 3 secondi
            setTimeout(() => {
                sendButton.disabled = false;
                sendButton.innerText = "Send Message";
                errorMessage.remove();
            }, 3000);
        });
}

// Controlla se l'utente ha già inviato una mail all'avvio della pagina
document.addEventListener("DOMContentLoaded", checkEmailSent);

const languageSelector = document.getElementById("language-selector");

// Funzione per caricare il file JSON in base alla lingua selezionata
async function loadTranslation(language) {
    try {
        const response = await fetch(`config/${language}.json`);
        const translations = await response.json();

        document.querySelectorAll("[data-translate]").forEach(el => {
            const translationKey = el.getAttribute("data-translate");

            // Suddivide la key in array (es. "home.title" -> ["home", "title"])
            const keyParts = translationKey.split(".");

            // Naviga nell'oggetto JSON per trovare la traduzione
            let translatedText = translations;
            for (const part of keyParts) {
                translatedText = translatedText?.[part];
            }

            if (translatedText) {
                if (el.tagName === "A" && translationKey === "about.link") {
                    el.setAttribute("href", translatedText); // Cambia il link
                } else {
                    el.textContent = translatedText;
                }
            }
        });
    } catch (error) {
        console.error("Errore nel caricamento delle traduzioni:", error);
    }
}

// Event listener per il cambio lingua
languageSelector.addEventListener("change", () => {
    const selectedLanguage = languageSelector.value;
    loadTranslation(selectedLanguage);
});

// Carica la lingua di default (inglese)
loadTranslation("en");
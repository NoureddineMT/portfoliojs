document.addEventListener("DOMContentLoaded", () => {
    const moon = document.getElementById("moon");
    const sun = document.getElementById("sun");

    const elementsToToggle = [
        { selector: ".bg-darkgrey", dark: "bg-darkgrey", light: "bg-white" },
        { selector: ".bg-white", dark: "bg-darkgrey", light: "bg-white" },
        { selector: ".progress", dark: "bg-white", light: "bg-darkgrey" },
        { selector: ".text-darkgrey", dark: "text-white", light: "text-darkgrey" },
        { selector: ".text-white", dark: "text-white", light: "text-darkgrey" },
        { selector: ".color-change2", dark: "color-change4", light: "color-change2" },
        { selector: ".color-change3", dark: "color-change5", light: "color-change3" }
    ];

    function toggleTheme(isDark) {
        moon.classList.toggle("d-none", isDark);
        sun.classList.toggle("d-none", !isDark);

        elementsToToggle.forEach(({ selector, dark, light }) => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.toggle(dark, isDark);
                el.classList.toggle(light, !isDark);
            });
        });

        // Salva la scelta nei cookie/localStorage
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }

    // Event listener per il cambio tema
    moon.addEventListener("click", () => toggleTheme(true));
    sun.addEventListener("click", () => toggleTheme(false));

    // Controlla il tema salvato e lo applica
    if (localStorage.getItem("theme") === "dark") {
        toggleTheme(true);
    }
});

// Cambia colore navbar allo scroll
$(window).scroll(function () {
    $("nav").toggleClass("bg-dark shadow-sm", $(window).scrollTop() > 5);
    $("nav").toggleClass("bg-invisible", $(window).scrollTop() <= 5);
});

document.addEventListener("DOMContentLoaded", () => {
    const cookieModal = new bootstrap.Modal(document.getElementById("cookie-modal"));
    const acceptCookiesBtn = document.getElementById("accept-cookies");

    // Controlla se i cookie sono già stati accettati
    if (!localStorage.getItem("cookiesAccepted")) {
        cookieModal.show(); // Mostra il modal se i cookie non sono accettati
    }

    // Nasconde il modal e salva la scelta nei cookie/localStorage
    acceptCookiesBtn.addEventListener("click", () => {
        localStorage.setItem("cookiesAccepted", "true");
        cookieModal.hide();
    });
});


// Funzione per impostare un cookie
function setCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
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
    const fromName = document.getElementById('from_name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const feedbackAlert = document.getElementById('form-feedback');
    const feedbackMessage = document.getElementById('feedback-message');

    // Verifica campi obbligatori
    if (!fromName || !email || !subject || !message) {
        feedbackAlert.classList.remove('d-none', 'alert-success');
        feedbackAlert.classList.add('alert-danger');
        feedbackMessage.innerText = 'Per favore, compila tutti i campi richiesti.';
        return;
    }

    // Verifica validità email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        feedbackAlert.classList.remove('d-none', 'alert-success');
        feedbackAlert.classList.add('alert-danger');
        feedbackMessage.innerText = 'Per favore, inserisci un indirizzo email valido.';
        return;
    }

    // Verifica reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse.length) {
        feedbackAlert.classList.remove('d-none', 'alert-success');
        feedbackAlert.classList.add('alert-danger');
        feedbackMessage.innerText = 'Per favore, completa la verifica reCAPTCHA.';
        return;
    }

    // Disabilita il pulsante durante l'invio
    const sendButton = document.getElementById('sendButton');
    const originalButtonText = sendButton.innerHTML;
    sendButton.disabled = true;
    sendButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Invio in corso...';

    // Imposta i parametri dell'email
    const templateParams = {
        from_name: fromName,
        email: email,
        subject: subject,
        message: message
    };

    // Invia l'email
    emailjs.send('service_lqfv46f', 'template_crbpshk', templateParams)
        .then(function () {
            // Mostra feedback positivo
            feedbackAlert.classList.remove('d-none', 'alert-danger');
            feedbackAlert.classList.add('alert-success');
            feedbackMessage.innerText = 'Grazie! Il tuo messaggio è stato inviato con successo.';

            // Resetta il form
            document.getElementById('contactForm').reset();
            grecaptcha.reset();

            // Ripristina il pulsante
            sendButton.disabled = false;
            sendButton.innerHTML = originalButtonText;
        }, function (error) {
            // Mostra feedback negativo
            feedbackAlert.classList.remove('d-none', 'alert-success');
            feedbackAlert.classList.add('alert-danger');
            feedbackMessage.innerText = 'Si è verificato un errore durante l\'invio del messaggio. Riprova più tardi.';

            // Ripristina il pulsante
            sendButton.disabled = false;
            sendButton.innerHTML = originalButtonText;

            console.log('Error:', error);
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

        // Cambia l'attributo lang dell'elemento html
        document.documentElement.lang = language;

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

        // Salva la lingua nei cookie per 30 giorni
        setCookie("selectedLanguage", language, 30);
    } catch (error) {
        console.error("Errore nel caricamento delle traduzioni:", error);
    }
}

// Controlla se c'è una lingua salvata nei cookie e la imposta
document.addEventListener("DOMContentLoaded", () => {
    const savedLanguage = getCookie("selectedLanguage") || "en"; // Default "en"
    languageSelector.value = savedLanguage;
    loadTranslation(savedLanguage);
});

// Event listener per il cambio lingua
languageSelector.addEventListener("change", () => {
    const selectedLanguage = languageSelector.value;
    loadTranslation(selectedLanguage);
});

const circle = document.querySelector(".circle");
let mouseX = 0, mouseY = 0;
let circleX = 0, circleY = 0;
let speed = 0.1; // Velocità di inseguimento

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animate() {
    // Movimento fluido con interpolazione
    circleX += (mouseX - circleX) * speed;
    circleY += (mouseY - circleY) * speed;

    // Offset per centrare il mouse
    circle.style.transform = `translate(${circleX - 25}px, ${circleY - 25}px)`;

    requestAnimationFrame(animate);
}

animate();
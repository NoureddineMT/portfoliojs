// Tema chiaro/scuro: la classe "dark" su <html> è la convenzione Tailwind,
// tutte le varianti dark: nel markup reagiscono da sole.
document.addEventListener("DOMContentLoaded", () => {
    const moon = document.getElementById("moon");
    const sun = document.getElementById("sun");

    function toggleTheme(isDark) {
        moon.classList.toggle("hidden", isDark);
        sun.classList.toggle("hidden", !isDark);
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }

    moon.addEventListener("click", () => toggleTheme(true));
    sun.addEventListener("click", () => toggleTheme(false));

    // Controlla il tema salvato (o la preferenza di sistema) e lo applica
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    toggleTheme(savedTheme ? savedTheme === "dark" : prefersDark);
});

// Sfondo "vetro" della navbar allo scroll
document.addEventListener("DOMContentLoaded", () => {
    const siteNav = document.getElementById("site-nav");
    window.addEventListener("scroll", () => {
        siteNav.classList.toggle("nav-scrolled", window.scrollY > 5);
    });
});

// Menu di navigazione mobile
document.addEventListener("DOMContentLoaded", () => {
    const navToggler = document.getElementById("nav-toggler");
    const navMenu = document.getElementById("nav-menu");

    function setMenuOpen(isOpen) {
        navMenu.classList.toggle("hidden", !isOpen);
        navMenu.classList.toggle("flex", isOpen);
        navToggler.setAttribute("aria-expanded", String(isOpen));
    }

    navToggler.addEventListener("click", () => {
        setMenuOpen(navMenu.classList.contains("hidden"));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuOpen(false));
    });
});

// Modale cookie (sostituisce il modal di Bootstrap: solo show/hide di classi)
document.addEventListener("DOMContentLoaded", () => {
    const cookieModal = document.getElementById("cookie-modal");
    const acceptCookiesBtn = document.getElementById("accept-cookies");

    function openCookieModal() {
        cookieModal.classList.remove("hidden");
        cookieModal.classList.add("flex");
        cookieModal.setAttribute("aria-hidden", "false");
    }

    function closeCookieModal() {
        cookieModal.classList.add("hidden");
        cookieModal.classList.remove("flex");
        cookieModal.setAttribute("aria-hidden", "true");
    }

    if (!localStorage.getItem("cookiesAccepted")) {
        openCookieModal();
    }

    acceptCookiesBtn.addEventListener("click", () => {
        localStorage.setItem("cookiesAccepted", "true");
        closeCookieModal();
    });
});

// Funzione per impostare un cookie (durata in giorni)
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

// Funzione per controllare se l'utente ha già inviato un'email
function checkEmailSent() {
    let lastSent = getCookie("emailSent");
    let sendButton = document.getElementById("sendButton");

    if (lastSent) {
        sendButton.disabled = true;
        sendButton.innerText = "You have to wait 24 hours";
    }
}

// Mostra un messaggio di esito nel banner del form di contatto
function showFormFeedback(message, type) {
    const feedback = document.getElementById("form-feedback");
    const text = document.getElementById("feedback-message");

    text.textContent = message;
    feedback.classList.remove(
        "hidden",
        "bg-emerald-100", "text-emerald-700", "dark:bg-emerald-500/10", "dark:text-emerald-300",
        "bg-red-100", "text-red-700", "dark:bg-red-500/10", "dark:text-red-300"
    );

    if (type === "success") {
        feedback.classList.add("bg-emerald-100", "text-emerald-700", "dark:bg-emerald-500/10", "dark:text-emerald-300");
    } else {
        feedback.classList.add("bg-red-100", "text-red-700", "dark:bg-red-500/10", "dark:text-red-300");
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
        .then(() => {
            // Imposta il cookie per bloccare il pulsante per 24 ore (1 giorno)
            setCookie("emailSent", "true", 1);

            showFormFeedback("Your message has been sent successfully!", "success");

            // Reset del form e CAPTCHA
            document.getElementById("contactForm").reset();
            grecaptcha.reset();

            // Disabilita il pulsante fino a quando non scade il cookie
            sendButton.innerText = "You have to wait 24 hours";
        })
        .catch((error) => {
            console.error("Errore durante l'invio dell'email:", error);

            showFormFeedback("Failed to send message. Please try again.", "error");

            // Riattiva il pulsante dopo 3 secondi
            setTimeout(() => {
                sendButton.disabled = false;
                sendButton.innerText = "Send Message";
                document.getElementById("form-feedback").classList.add("hidden");
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

// Animazioni di comparsa degli elementi allo scroll.
// Il contenuto resta sempre visibile di default: l'animazione si attiva
// solo se IntersectionObserver è supportato e l'utente non ha richiesto
// "prefers-reduced-motion", così nessun contenuto dipende dal JS per essere letto.
document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".reveal");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!revealElements.length || !("IntersectionObserver" in window) || prefersReducedMotion) {
        return;
    }

    document.documentElement.classList.add("reveal-ready");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
});

// Cerchio che segue il cursore
document.addEventListener("DOMContentLoaded", () => {
    const circle = document.getElementById("cursor-circle");
    if (!circle) return;

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;
    const speed = 0.1; // Velocità di inseguimento

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Movimento fluido con interpolazione
        circleX += (mouseX - circleX) * speed;
        circleY += (mouseY - circleY) * speed;

        // Offset per centrare il mouse
        circle.style.transform = `translate(${circleX - 20}px, ${circleY - 20}px)`;

        requestAnimationFrame(animate);
    }

    animate();
});

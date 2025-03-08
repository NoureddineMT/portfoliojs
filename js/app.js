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

function sendEmail() {
    var sendButton = document.querySelector("#sendButton");
    var recaptchaResponse = grecaptcha.getResponse(); // Ottieni il valore del CAPTCHA

    if (!recaptchaResponse) {
        alert("Please complete the CAPTCHA before sending the message.");
        return;
    }

    // Disabilita il pulsante per evitare spam
    sendButton.disabled = true;
    sendButton.innerText = "Sending...";

    // Raccogli i dati dal modulo
    var data = {
        from_name: document.getElementById("from_name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
        "g-recaptcha-response": recaptchaResponse // Aggiungi il CAPTCHA ai dati inviati
    };

    // Invia l'email utilizzando Email.js
    emailjs.send("service_lqfv46f", "template_dnxwwsr", data)
        .then(function (response) {
            console.log("Email inviata con successo:", response);

            // Mostra un messaggio di conferma all'utente
            var successMessage = document.createElement("div");
            successMessage.className = "alert alert-success mt-3";
            successMessage.innerText = "Your message has been sent successfully!";
            document.getElementById("contactForm").appendChild(successMessage);

            // Resetta il modulo e il CAPTCHA
            document.getElementById("contactForm").reset();
            grecaptcha.reset();

            // Riattiva il pulsante dopo 3 secondi
            setTimeout(() => {
                sendButton.disabled = false;
                sendButton.innerText = "Send Message";
                successMessage.remove();
            }, 3000);
        })
        .catch(function (error) {
            console.error("Errore durante l'invio dell'email:", error);

            // Mostra un messaggio di errore all'utente
            var errorMessage = document.createElement("div");
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

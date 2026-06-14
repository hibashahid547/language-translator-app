// ==========================
// LOAD VOICES
// ==========================

let voices = [];

function loadVoices() {
    voices = speechSynthesis.getVoices();
}

loadVoices();

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}

// ==========================
// TRANSLATE
// ==========================

async function translateText() {

    const text = document.getElementById("inputText").value.trim();
    const source = document.getElementById("sourceLang").value;
    const target = document.getElementById("targetLang").value;

    if (!text) {
        alert("Please enter some text.");
        return;
    }

    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");

    const url =
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        document.getElementById("result").innerText =
            data.responseData.translatedText;

    } catch (error) {

        document.getElementById("result").innerText =
            "Error translating text!";

        console.error(error);
    }

    loader.classList.add("hidden");
}

// ==========================
// SWAP LANGUAGES
// ==========================

function swapLang() {

    const source =
        document.getElementById("sourceLang");

    const target =
        document.getElementById("targetLang");

    let temp = source.value;

    source.value = target.value;
    target.value = temp;
}

// ==========================
// COPY
// ==========================

function copyText() {

    const text =
        document.getElementById("result").innerText;

    navigator.clipboard.writeText(text);

    alert("Copied successfully!");
}

// ==========================
// SPEAK
// ==========================

function speakText() {

    const text =
        document.getElementById("result").innerText;

    if (
        !text ||
        text === "Your translation will appear here..." ||
        text === "Error translating text!"
    ) {
        alert("No translated text available!");
        return;
    }

    speechSynthesis.cancel();

    const targetLang =
        document.getElementById("targetLang").value;

    const speech =
        new SpeechSynthesisUtterance(text);

    const languageMap = {
        en: "en-US",
        ur: "ur-PK",
        fr: "fr-FR",
        es: "es-ES",
        de: "de-DE",
        hi: "hi-IN"
    };

    speech.lang =
        languageMap[targetLang] || "en-US";

    let voice =
        voices.find(v =>
            v.lang.toLowerCase().startsWith(
                targetLang.toLowerCase()
            )
        );

    if (voice) {
        speech.voice = voice;
    }

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    speechSynthesis.speak(speech);
}

// ==========================
// PAUSE
// ==========================

function pauseSpeech() {
    speechSynthesis.pause();
}

// ==========================
// RESUME
// ==========================

function resumeSpeech() {
    speechSynthesis.resume();
}

// ==========================
// STOP
// ==========================

function stopSpeech() {
    speechSynthesis.cancel();
}

// ==========================
// CHARACTER COUNT
// ==========================

function countChars() {

    const text =
        document.getElementById("inputText").value;

    document.getElementById("charCount").innerText =
        text.length + " characters";
}
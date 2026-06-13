// INIT VOICES
let voices = [];

function loadVoices() {
    voices = window.speechSynthesis.getVoices();

    const voiceSelect = document.getElementById("voiceSelect");
    if (!voiceSelect) return;

    voiceSelect.innerHTML = "";

    voices.forEach((voice, i) => {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

window.speechSynthesis.onvoiceschanged = loadVoices;
window.speechSynthesis.getVoices();

// TRANSLATE
async function translateText() {
    const text = document.getElementById("inputText").value;
    const source = document.getElementById("sourceLang").value;
    const target = document.getElementById("targetLang").value;

    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");

    const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${source}|${target}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById("result").innerText =
            data.responseData.translatedText;

    } catch (error) {
        document.getElementById("result").innerText = "Error translating text!";
    }

    loader.classList.add("hidden");
}

// SWAP
function swapLang() {
    let s = document.getElementById("sourceLang");
    let t = document.getElementById("targetLang");

    let temp = s.value;
    s.value = t.value;
    t.value = temp;
}

// COPY
function copyText() {
    const text = document.getElementById("result").innerText;
    navigator.clipboard.writeText(text);
}

// SPEAK PRO
function speakText() {
    const text = document.getElementById("result").innerText;
    const targetLang = document.getElementById("targetLang").value;

    if (!text || text.includes("Your translation will appear here")) {
        alert("No text to speak!");
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    const langMap = {
        en: "en",
        ur: "ur",
        fr: "fr",
        es: "es",
        de: "de",
        hi: "hi"
    };

    const code = langMap[targetLang] || "en";

    let selectedVoice = voices.find(v =>
        v.lang.toLowerCase().includes(code)
    );

    const voiceSelect = document.getElementById("voiceSelect");
    if (voiceSelect && voiceSelect.value !== "") {
        selectedVoice = voices[voiceSelect.value];
    }

    if (selectedVoice) {
        speech.voice = selectedVoice;
        speech.lang = selectedVoice.lang;
    }

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}

// PAUSE
function pauseSpeech() {
    window.speechSynthesis.pause();
}

// RESUME
function resumeSpeech() {
    window.speechSynthesis.resume();
}

// STOP
function stopSpeech() {
    window.speechSynthesis.cancel();
}

// CHAR COUNT
function countChars() {
    const text = document.getElementById("inputText").value;
    document.getElementById("charCount").innerText =
        text.length + " characters";
}
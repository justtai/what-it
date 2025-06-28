let audioContext;
const audioBuffers = {};
let backgroundMusicSource = null;
let currentHoverSoundSource = null;

export function initAudio() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

export async function loadSound(name, url) {
    if (!audioContext) return;
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffers[name] = audioBuffer;
    } catch (e) {
        console.error(`Failed to load sound: ${name}`, e);
    }
}

export function playSound(name, loop = false) {
    if (!audioContext || !audioBuffers[name]) return null;
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers[name];
    source.connect(audioContext.destination);
    source.loop = loop;
    source.start(0);
    return source;
}

export function playHoverSound() {
    if (currentHoverSoundSource) {
        currentHoverSoundSource.stop();
        currentHoverSoundSource = null;
    }
    currentHoverSoundSource = playSound('orb_hover');
}

export function stopHoverSound() {
    if (currentHoverSoundSource) {
        currentHoverSoundSource.stop();
        currentHoverSoundSource = null;
    }
}

export function getBackgroundMusicSource() {
    return backgroundMusicSource;
}

export function setBackgroundMusicSource(source) {
    backgroundMusicSource = source;
}


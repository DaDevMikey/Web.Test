// Elements
const htmlCode = document.getElementById('html-code');
const cssCode = document.getElementById('css-code');
const jsCode = document.getElementById('js-code');
const output = document.getElementById('output');
const consoleOutput = document.getElementById('console-output');
const fontUrlInput = document.getElementById('font-url');
const frameworkUrlInput = document.getElementById('framework-url');
const bgColorInput = document.getElementById('bg-color');
const textColorInput = document.getElementById('text-color');
const editorBgColorInput = document.getElementById('editor-bg-color');
const mobilePopup = document.getElementById('mobile-popup');
const continueBtn = document.getElementById('continue-btn');

// Show mobile popup for small screens
if (window.innerWidth < 768) {
  mobilePopup.classList.remove('hidden');
}
continueBtn.addEventListener('click', () => {
  mobilePopup.classList.add('hidden');
});

// Custom Fonts and Frameworks
fontUrlInput.addEventListener('input', () => {
  const linkTag = `<link href="${fontUrlInput.value}" rel="stylesheet">`;
  document.head.insertAdjacentHTML('beforeend', linkTag);
});

frameworkUrlInput.addEventListener('input', () => {
  const linkTag = `<link href="${frameworkUrlInput.value}" rel="stylesheet">`;
  document.head.insertAdjacentHTML('beforeend', linkTag);
});

// Code Linting
function lintCode() {
  const htmlErrors = htmlCode.value.match(/<[^>]*$/);
  const cssErrors = cssCode.value.match(/[^{}]*{[^}]*$/);
  const jsErrors = jsCode.value.match(/function\s+[^\(]*\($/);
  if (htmlErrors) alert("HTML linting error: Incomplete tag found.");
  if (cssErrors) alert("CSS linting error: Unclosed bracket found.");
  if (jsErrors) alert("JavaScript linting error: Function syntax may be incomplete.");
}
document.getElementById('lint-code').addEventListener('click', lintCode);

// JavaScript Console
function updateConsole(message) {
  consoleOutput.innerHTML += `<div>${message}</div>`;
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function runJavaScript(jsCode) {
  const oldLog = console.log;
  console.log = (msg) => {
    updateConsole(msg);
    oldLog(msg);
  };
  try {
    new Function(jsCode)();
  } catch (error) {
    updateConsole(`Error: ${error.message}`);
  }
}

// Custom Theme
function applyCustomTheme() {
  document.body.style.backgroundColor = bgColorInput.value;
  document.body.style.color = textColorInput.value;
  document.querySelectorAll('textarea').forEach(area => {
    area.style.backgroundColor = editorBgColorInput.value;
  });
}
bgColorInput.addEventListener('input', applyCustomTheme);
textColorInput.addEventListener('input', applyCustomTheme);
editorBgColorInput.addEventListener('input', applyCustomTheme);

// Code Formatting
function formatCode(code) {
  return code.replace(/\s+/g, ' ').trim();
}
document.getElementById('run-code').addEventListener('click', () => {
  htmlCode.value = formatCode(htmlCode.value);
  cssCode.value = formatCode(cssCode.value);
  jsCode.value = formatCode(jsCode.value);
  updatePreview();
  runJavaScript(jsCode.value);
});

// P2P Collaboration with WebRTC
const peerConnection = new RTCPeerConnection();
peerConnection.ondatachannel = (event) => {
  const receiveChannel = event.channel;
  receiveChannel.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    htmlCode.value = data.html;
    cssCode.value = data.css;
    jsCode.value = data.js;
    updatePreview();
  };
};

document.getElementById('start-p2p').addEventListener('click', async () => {
  const dataChannel = peerConnection.createDataChannel("codeShare");
  dataChannel.onopen = () => console.log("Data Channel Opened");
  dataChannel.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    htmlCode.value = data.html;
    cssCode.value = data.css;
    jsCode.value = data.js;
    updatePreview();
  };
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log(`Offer created: ${JSON.stringify(offer)}`);
});

// Update Preview
function updatePreview() {
  const html = htmlCode.value;
  const css = `<style>${cssCode.value}</style>`;
  const js = `<script>${jsCode.value}</script>`;
  output.srcdoc = html + css + js;
}

// Offline Mode (Service Worker)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => {
    console.log('Service Worker Registered for Offline Mode');
  });
}

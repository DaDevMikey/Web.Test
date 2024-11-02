// Elements
const htmlCode = document.getElementById('html-code');
const cssCode = document.getElementById('css-code');
const jsCode = document.getElementById('js-code');
const output = document.getElementById('output');
const themeToggle = document.getElementById('theme-toggle');
const fullscreenToggle = document.getElementById('fullscreen-toggle');
const liveUpdateCheckbox = document.getElementById('live-update');
const showCssCheckbox = document.getElementById('show-css');
const showJsCheckbox = document.getElementById('show-js');
const beautifyButton = document.getElementById('beautify-code');
const minifyButton = document.getElementById('minify-code');

// Update Preview Function
function updatePreview() {
  const html = htmlCode.value;
  const css = `<style>${cssCode.value}</style>`;
  const js = `<script>${jsCode.value}<\/script>`;
  output.srcdoc = html + css + js;
}

// Beautify and Minify Functions
function beautifyCode() {
  htmlCode.value = html_beautify(htmlCode.value);
  cssCode.value = css_beautify(cssCode.value);
  jsCode.value = js_beautify(jsCode.value);
}

function minifyCode() {
  htmlCode.value = htmlCode.value.replace(/\s+/g, ' ').trim();
  cssCode.value = cssCode.value.replace(/\s+/g, ' ').trim();
  jsCode.value = jsCode.value.replace(/\s+/g, ' ').trim();
}

// Error Checking
function checkErrors() {
  try {
    new Function(jsCode.value);
    jsCode.classList.remove('error');
  } catch (e) {
    jsCode.classList.add('error');
  }
}

// Event Listeners
htmlCode.addEventListener('input', () => {
  if (liveUpdateCheckbox.checked) updatePreview();
});
cssCode.addEventListener('input', () => {
  if (liveUpdateCheckbox.checked) updatePreview();
});
jsCode.addEventListener('input', () => {
  if (liveUpdateCheckbox.checked) {
    updatePreview();
    checkErrors();
  }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.querySelector('.material-icons').textContent = 
    document.body.classList.contains('dark-mode') ? 'brightness_7' : 'brightness_4';
});

// Fullscreen Mode
fullscreenToggle.addEventListener('click', () => {
  if (output.requestFullscreen) output.requestFullscreen();
});

// Settings Panel
showCssCheckbox.addEventListener('change', () => {
  document.getElementById('css-editor').classList.toggle('hidden', !showCssCheckbox.checked);
});
showJsCheckbox.addEventListener('change', () => {
  document.getElementById('js-editor').classList.toggle('hidden', !showJsCheckbox.checked);
});

// Beautify and Minify Buttons
beautifyButton.addEventListener('click', beautifyCode);
minifyButton.addEventListener('click', minifyCode);

// Initial Load
updatePreview();

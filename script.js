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
const codeSnippets = document.getElementById('code-snippets');
const saveProgressButton = document.getElementById('save-progress');
const bgColorInput = document.getElementById('bg-color');
const textColorInput = document.getElementById('text-color');
const editorBgColorInput = document.getElementById('editor-bg-color');
const mobilePopup = document.getElementById('mobile-popup');
const closePopupButton = document.getElementById('close-popup');

// Show mobile popup if screen width is less than 768px
if (window.innerWidth < 768) {
  mobilePopup.classList.remove('hidden');
}
closePopupButton.addEventListener('click', () => {
  mobilePopup.classList.add('hidden');
});

// Save Progress Function
saveProgressButton.addEventListener('click', () => {
  localStorage.setItem('htmlCode', htmlCode.value);
  localStorage.setItem('cssCode', cssCode.value);
  localStorage.setItem('jsCode', jsCode.value);
  alert('Progress saved locally!');
});

// Load saved progress on page load
window.addEventListener('load', () => {
  htmlCode.value = localStorage.getItem('htmlCode') || '';
  cssCode.value = localStorage.getItem('cssCode') || '';
  jsCode.value = localStorage.getItem('jsCode') || '';
  updatePreview();
});

// Update Preview
function updatePreview() {
  const html = htmlCode.value;
  const css = `<style>${cssCode.value}</style>`;
  const js = `<script>${jsCode.value}<\/script>`;
  output.srcdoc = html + css + js;
}

// Code Snippets
const snippets = {
  hello: {
    html: "<h1>Hello World</h1>",
    css: "h1 { color: green; }",
    js: "console.log('Hello World');"
  },
  form: {
    html: "<form><input type='text' placeholder='Your Name'></form>",
    css: "input { border: 1px solid #ccc; padding: 5px; }",
    js: ""
  },
  table: {
    html: "<table><tr><td>Item</td><td>Price</td></tr></table>",
    css: "table { width: 100%; } td { padding: 8px; }",
    js: ""
  }
};
codeSnippets.addEventListener('change', () => {
  const selectedSnippet = snippets[codeSnippets.value];
  if (selectedSnippet) {
    htmlCode.value = selectedSnippet.html;
    cssCode.value = selectedSnippet.css;
    jsCode.value = selectedSnippet.js;
    updatePreview();
  }
});

// Theme Customization
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

// Theme Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.querySelector('.material-icons').textContent = 
    document.body.classList.contains('dark-mode') ? 'dark_mode' : 'light_mode';
});

// Show/Hide CSS and JS Editors
showCssCheckbox.addEventListener('change', () => {
  document.getElementById('css-editor').classList.toggle('hidden', !showCssCheckbox.checked);
});
showJsCheckbox.addEventListener('change', () => {
  document.getElementById('js-editor').classList.toggle('hidden', !showJsCheckbox.checked);
});

// Fullscreen Mode
fullscreenToggle.addEventListener('click', () => {
  if (output.requestFullscreen) output.requestFullscreen();
});

// Code Sharing
document.getElementById('share-code').addEventListener('click', () => {
  const shareData = {
    html: htmlCode.value,
    css: cssCode.value,
    js: jsCode.value
  };
  const shareURL = `${location.href.split('?')[0]}?data=${encodeURIComponent(btoa(JSON.stringify(shareData)))}`;
  navigator.clipboard.writeText(shareURL).then(() => {
    alert('Shareable link copied to clipboard!');
  });
});

// Load shared code if available
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('data')) {
  const sharedData = JSON.parse(atob(decodeURIComponent(urlParams.get('data'))));
  htmlCode.value = sharedData.html || '';
  cssCode.value = sharedData.css || '';
  jsCode.value = sharedData.js || '';
  updatePreview();
}

// Live update preview
htmlCode.addEventListener('input', () => { if (liveUpdateCheckbox.checked) updatePreview(); });
cssCode.addEventListener('input', () => { if (liveUpdateCheckbox.checked) updatePreview(); });
jsCode.addEventListener('input', () => { if (liveUpdateCheckbox.checked) updatePreview(); });

// Initial load
updatePreview();

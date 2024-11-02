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

// Theme Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.querySelector('.material-icons').textContent = 
    document.body.classList.contains('dark-mode') ? 'dark_mode' : 'light_mode';
});

// Fullscreen Mode
fullscreenToggle.addEventListener('click', () => {
  if (output.requestFullscreen) output.requestFullscreen();
});

// Event Listeners
htmlCode.addEventListener('input', () => {
  if (liveUpdateCheckbox.checked) updatePreview();
});
cssCode.addEventListener('input', () => {
  if (liveUpdateCheckbox.checked) updatePreview();
});
jsCode.addEventListener('input', () => {
  if (liveUpdateCheckbox.checked) updatePreview();
});

// Initial Load
updatePreview();

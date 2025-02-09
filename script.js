let htmlEditor, cssEditor, jsEditor;
const consoleDiv = document.getElementById('console-output');
let originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn
};

// Initialize CodeMirror editors
document.addEventListener('DOMContentLoaded', () => {
  // Setup HTML editor
  htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-editor'), {
    mode: 'xml',
    theme: 'monokai',
    lineNumbers: true,
    autoCloseTags: true,
    lineWrapping: true
  });

  // Setup CSS editor
  cssEditor = CodeMirror.fromTextArea(document.getElementById('css-editor'), {
    mode: 'css',
    theme: 'monokai',
    lineNumbers: true,
    lineWrapping: true
  });

  // Setup JavaScript editor
  jsEditor = CodeMirror.fromTextArea(document.getElementById('js-editor'), {
    mode: 'javascript',
    theme: 'monokai',
    lineNumbers: true,
    lineWrapping: true
  });

  // Initial preview update
  updatePreview();
});

// Update preview when "Run" is clicked
function updatePreview() {
  const iframe = document.getElementById('preview-frame');
  const html = htmlEditor.getValue();
  const css = cssEditor.getValue();
  const js = jsEditor.getValue();

  // Reset console
  clearConsole();

  // Create new document content
  const content = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>
          // Override console methods
          console.log = function() {
            window.parent.postMessage({
              type: 'console',
              method: 'log',
              args: Array.from(arguments)
            }, '*');
            return originalConsole.log.apply(console, arguments);
          };
          
          console.error = function() {
            window.parent.postMessage({
              type: 'console',
              method: 'error',
              args: Array.from(arguments)
            }, '*');
            return originalConsole.error.apply(console, arguments);
          };
          
          console.warn = function() {
            window.parent.postMessage({
              type: 'console',
              method: 'warn',
              args: Array.from(arguments)
            }, '*');
            return originalConsole.warn.apply(console, arguments);
          };

          // Wrap user code in try-catch
          try {
            ${js}
          } catch(err) {
            console.error(err);
          }
        </script>
      </body>
    </html>
  `;

  // Update iframe content
  iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(content);
}

// Clear specific editor
function clearEditor(type) {
  switch(type) {
    case 'html':
      htmlEditor.setValue('');
      break;
    case 'css':
      cssEditor.setValue('');
      break;
    case 'js':
      jsEditor.setValue('');
      break;
  }
}

// Clear console output
function clearConsole() {
  consoleDiv.innerHTML = '';
}

// Handle console messages from iframe
window.addEventListener('message', function(event) {
  if (event.data.type === 'console') {
    const message = document.createElement('div');
    message.className = `console-message console-${event.data.method}`;
    
    const args = event.data.args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2);
      }
      return arg;
    }).join(' ');
    
    message.textContent = args;
    consoleDiv.appendChild(message);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
  }
});

// Handle errors in the main window
window.onerror = function(message, source, lineno, colno, error) {
  const errorMessage = document.createElement('div');
  errorMessage.className = 'console-message console-error';
  errorMessage.textContent = `${message} (${source}:${lineno}:${colno})`;
  consoleDiv.appendChild(errorMessage);
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
};

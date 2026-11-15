/* =============================================================
   build.js — embute o CSS nas páginas (melhora o carregamento no celular)

   Fluxo de edição:
     1. Edite normalmente o arquivo css/style.css
     2. Rode:  node build.js
     3. O CSS (minificado) é copiado para dentro de cada página,
        entre os marcadores <!-- CSS:INICIO --> e <!-- CSS:FIM -->.

   Não edite o bloco <style> dentro dos HTML: ele é sobrescrito.
   ============================================================= */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PAGES = ['index.html', 'index-modelo.html', 'politica-de-privacidade.html'];
const START = '<!-- CSS:INICIO (gerado por build.js a partir de css/style.css — não edite aqui) -->';
const END = '<!-- CSS:FIM -->';

const minify = (css) => css
  .replace(/\/\*[\s\S]*?\*\//g, '')          // comentários
  .replace(/\s+/g, ' ')                       // espaços em sequência
  .replace(/\s*([{};,>])\s*/g, '$1')          // espaços ao redor de símbolos (":" fica: ".a :focus" ≠ ".a:focus")
  .replace(/;}/g, '}')
  .replace(/url\(\.\.\/fonts\//g, 'url(fonts/') // caminhos relativos à raiz do site
  .trim();

const css = minify(fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8'));
const block = `${START}\n  <style>${css}</style>\n  ${END}`;

for (const page of PAGES) {
  const file = path.join(ROOT, page);
  let html = fs.readFileSync(file, 'utf8');
  const link = '<link rel="stylesheet" href="css/style.css">';
  const re = /<!-- CSS:INICIO[\s\S]*?<!-- CSS:FIM -->/;

  if (re.test(html)) html = html.replace(re, () => block);
  else if (html.includes(link)) html = html.replace(link, () => block);
  else { console.error(`✗ ${page}: não encontrei o link do CSS nem o bloco CSS:INICIO`); process.exitCode = 1; continue; }

  fs.writeFileSync(file, html);
  console.log(`✓ ${page}`);
}
console.log(`CSS embutido: ${(Buffer.byteLength(css) / 1024).toFixed(1)} KB`);

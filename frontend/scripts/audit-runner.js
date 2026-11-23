const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
  { name: '320px (Mobile S)', width: 320, height: 568 },
  { name: '360px (Android Small)', width: 360, height: 640 },
  { name: '375px (iPhone SE)', width: 375, height: 667 },
  { name: '390px (iPhone 12/13/14)', width: 390, height: 844 },
  { name: '414px (iPhone XR/Plus)', width: 414, height: 896 },
  { name: '768px (Tablet Portrait)', width: 768, height: 1024 },
  { name: '1024px (Tablet Landscape)', width: 1024, height: 768 },
  { name: '1280px (Desktop Small)', width: 1280, height: 800 },
  { name: '1440px (Desktop HD)', width: 1440, height: 900 },
  { name: '1920px (Full HD)', width: 1920, height: 1080 },
];

const PAGES_TO_TEST = [
  { name: 'Home', path: '/' },
  { name: 'Céu Hoje', path: '/ceu-hoje' },
  { name: 'Lua', path: '/ceu-hoje#lua' },
  { name: 'Planetas', path: '/ceu-hoje#planetas' },
  { name: 'Eventos', path: '/eventos' },
  { name: 'Conteúdo', path: '/conteudo' },
  { name: 'Conteúdo/[slug]', path: '/conteudo/otto-de-alencar-relatividade-sobral-1919' },
  { name: 'Galeria', path: '/galeria' },
  { name: 'Sobre', path: '/sobre' },
  { name: 'Otto de Alencar', path: '/sobre#otto-de-alencar' },
  { name: 'Pesquisas', path: '/pesquisas' },
  { name: 'Contato', path: '/contato' },
  { name: 'Registros', path: '/registros' },
  { name: 'Novo Registro', path: '/registros/novo' },
  { name: 'Perfil', path: '/perfil' },
  { name: 'Login', path: '/login' },
  { name: 'Cadastro', path: '/cadastro' },
];

async function runAudit() {
  console.log('--- INICIANDO AUDITORIA RIGOROSA DE RESPONSIVIDADE E UX ---');
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  for (const pageItem of PAGES_TO_TEST) {
    const pageResult = {
      name: pageItem.name,
      path: pageItem.path,
      statusCode: null,
      viewports: [],
      consoleErrors: [],
    };

    page.on('console', msg => {
      if (msg.type() === 'error') {
        pageResult.consoleErrors.push(msg.text());
      }
    });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const fullUrl = `http://localhost:3001${pageItem.path}`;

      let response;
      try {
        response = await page.goto(fullUrl, { waitUntil: 'load', timeout: 8000 });
        pageResult.statusCode = response ? response.status() : 0;
      } catch (err) {
        pageResult.statusCode = 'ERROR: ' + err.message;
      }

      // Esperar hidratação mínima
      await page.waitForTimeout(300);

      // Avaliação no DOM
      const metrics = await page.evaluate((vpWidth) => {
        const docElem = document.documentElement;
        const body = document.body;

        const scrollWidth = Math.max(docElem.scrollWidth, body.scrollWidth);
        const clientWidth = docElem.clientWidth;
        const hasHorizontalOverflow = scrollWidth > clientWidth + 1;
        const overflowPixels = Math.max(0, scrollWidth - clientWidth);

        // Identificar elementos que vazam horizontalmente
        const overflowingElements = [];
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          const rect = el.getBoundingClientRect();
          if (rect.right > vpWidth + 1) {
            overflowElementsCheck(el, rect, vpWidth, overflowingElements);
          }
        }

        function overflowElementsCheck(el, rect, limit, list) {
          if (list.length >= 5) return; // limita amostra
          // ignorar tags de script/style
          if (['SCRIPT', 'STYLE', 'SVG', 'PATH'].includes(el.tagName)) return;
          const tag = el.tagName.toLowerCase();
          const className = typeof el.className === 'string' ? el.className.split(' ').slice(0, 3).join('.') : '';
          list.push({
            tag,
            class: className,
            right: Math.round(rect.right),
            excess: Math.round(rect.right - limit),
            text: (el.innerText || '').substring(0, 30).trim(),
          });
        }

        // Avaliar botões / targets interativos em telas pequenas (< 44px)
        let smallTapTargets = 0;
        if (vpWidth <= 414) {
          const interactives = document.querySelectorAll('button, a, input, select');
          for (const btn of interactives) {
            const r = btn.getBoundingClientRect();
            if (r.width > 0 && r.height > 0 && (r.width < 40 || r.height < 40)) {
              smallTapTargets++;
            }
          }
        }

        return {
          scrollWidth,
          clientWidth,
          hasHorizontalOverflow,
          overflowPixels,
          overflowingElements,
          smallTapTargets,
        };
      }, vp.width);

      pageResult.viewports.push({
        viewport: vp.name,
        width: vp.width,
        ...metrics,
      });
    }

    results.push(pageResult);
    console.log(`[PÁGINA AUDITADA]: ${pageItem.name} (${pageItem.path}) - Status: ${pageResult.statusCode}`);
  }

  await browser.close();

  const reportPath = path.join(__dirname, 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`Relatório salvo com sucesso em: ${reportPath}`);
}

runAudit().catch(err => {
  console.error('Falha na execução do auditor:', err);
  process.exit(1);
});

/**
 * Fetches the Financy Figma file and styleguide node via Figma REST API,
 * then writes extracted tokens to src/styles/figma-tokens.json.
 * Run from frontend: npm run figma:tokens
 * Requires .env in repo root with token or FIGMA_ACCESS_TOKEN.
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: rootEnv });

const FIGMA_FILE_KEY = 'neN9iRrmqDs4JIktNdezAe';
const STYLEGUIDE_NODE_ID = '3:377';
const token = process.env.FIGMA_ACCESS_TOKEN || process.env.token;

if (!token) {
  console.error('Missing Figma token. Set token or FIGMA_ACCESS_TOKEN in repo root .env');
  process.exit(1);
}

function rgbaToHex(r, g, b, a = 1) {
  const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? toHex(a) : ''}`;
}

function traverseFills(node, acc) {
  if (!node) return;
  if (node.fills && Array.isArray(node.fills)) {
    for (const fill of node.fills) {
      if (fill.visible !== false && fill.color) {
        const { r, g, b, a = 1 } = fill.color;
        const hex = rgbaToHex(r, g, b, a);
        const name = node.name?.replace(/\s+/g, '-').toLowerCase() || `color-${acc.colors.length}`;
        if (!acc.colors.find((c) => c.hex === hex)) acc.colors.push({ name, hex });
      }
    }
  }
  if (node.style && node.style.fontFamily) {
    acc.typography.push({
      name: node.name || 'text',
      fontFamily: node.style.fontFamily,
      fontSize: node.style.fontSize,
      fontWeight: node.style.fontWeight,
    });
  }
  if (node.children) {
    for (const child of node.children) traverseFills(child, acc);
  }
}

async function main() {
  const headers = { 'X-Figma-Token': token };
  const fileUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`;
  const nodesUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${encodeURIComponent(STYLEGUIDE_NODE_ID)}`;

  let fileRes = await fetch(fileUrl, { headers });
  if (!fileRes.ok) {
    console.error('Figma file fetch failed:', fileRes.status, await fileRes.text());
    process.exit(1);
  }
  const fileJson = await fileRes.json();

  let styleguideNode = null;
  let nodesRes = await fetch(nodesUrl, { headers });
  if (nodesRes.ok) {
    const nodesJson = await nodesRes.json();
    const nodeData = nodesJson.nodes?.[STYLEGUIDE_NODE_ID];
    styleguideNode = nodeData?.document;
  }

  const acc = { colors: [], typography: [] };
  if (styleguideNode) {
    traverseFills(styleguideNode, acc);
  }
  if (acc.colors.length === 0 && fileJson.document) {
    traverseFills(fileJson.document, acc);
  }

  const tokens = {
    colors: acc.colors,
    typography: acc.typography,
    _meta: { fileKey: FIGMA_FILE_KEY, styleguideNodeId: STYLEGUIDE_NODE_ID, generated: new Date().toISOString() },
  };

  const outDir = path.resolve(__dirname, '..', 'src', 'styles');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'figma-tokens.json');
  fs.writeFileSync(outPath, JSON.stringify(tokens, null, 2), 'utf8');
  console.log('Wrote', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

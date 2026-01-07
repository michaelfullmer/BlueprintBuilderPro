import express from 'express';
import cors from 'cors';
import { fetch } from 'undici';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));


const toBase64FromUrl = async (url) => {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Failed to fetch image');
  const ct = resp.headers.get('content-type') || 'image/png';
  const ab = await resp.arrayBuffer();
  const base64 = Buffer.from(ab).toString('base64');
  return { data: base64, mimeType: ct };
};

const postWithTimeout = async (url, options, ms = 45000) => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal });
    return resp;
  } finally {
    clearTimeout(t);
  }
};

app.post('/api/analyze', async (req, res) => {
  try {
    const { blueprintUrl, provider, googleKey: googleKeyBody, openRouterKey: openRouterKeyBody, openRouterModel } = req.body || {};
    if (!blueprintUrl) return res.status(400).json({ error: 'Missing blueprintUrl' });
    const googleKey = process.env.GOOGLE_API_KEY || googleKeyBody;
    const openRouterKey = process.env.OPENROUTER_API_KEY || openRouterKeyBody;
    const order = [];
    if (provider === 'google') order.push('google', 'openrouter');
    else if (provider === 'openrouter') order.push('openrouter', 'google');
    else order.push('google', 'openrouter');

    let result = null;
    let providerUsed = null;
    const errors = [];

    for (const p of order) {
      if (p === 'google' && googleKey) {
        try {
          const { data, mimeType } = await toBase64FromUrl(blueprintUrl);
          const prompt =
            'Analyze this architectural blueprint image and extract the following information in detail. ' +
            'Return a JSON object with keys: total_sqft (number), floors (number), foundation_type (string), roof_type (string), roof_pitch (string), ' +
            'rooms (array of { name, length, width, sqft, flooring_type }), structural_elements (array of { type, description, quantity }), ' +
            'windows (number), doors (number), garage_bays (number), special_features (array of string), exterior_walls_linear_ft (number), interior_walls_linear_ft (number). ' +
            'If unsure, estimate conservatively. Output ONLY raw JSON without markdown formatting.';
          const resp = await postWithTimeout(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data } }],
                  },
                ],
                generationConfig: { response_mime_type: 'application/json' },
              }),
            },
            45000
          );
          if (!resp.ok) {
            const errData = await resp.json().catch(() => ({}));
            throw new Error(errData.error?.message || 'Gemini API Error');
          }
          const geminiData = await resp.json();
          const jsonText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!jsonText) throw new Error('No data returned from Gemini');
          result = JSON.parse(jsonText);
          providerUsed = 'google';
          break;
        } catch (e) {
          errors.push({ provider: 'google', message: e.message || String(e) });
        }
      }
      if (p === 'openrouter' && openRouterKey) {
        try {
          const model =
            (openRouterModel?.trim?.() || process.env.OPENROUTER_MODEL?.trim()) ||
            'qwen/qwen2.5-vl-32b-instruct:free';
          const prompt =
            'Analyze this architectural blueprint image and extract the following information in detail. ' +
            'Return a JSON object with keys: total_sqft (number), floors (number), foundation_type (string), roof_type (string), roof_pitch (string), ' +
            'rooms (array of { name, length, width, sqft, flooring_type }), structural_elements (array of { type, description, quantity }), ' +
            'windows (number), doors (number), garage_bays (number), special_features (array of string), exterior_walls_linear_ft (number), interior_walls_linear_ft (number). ' +
            'If unsure, estimate conservatively.';
          const sysMsg = {
            role: 'system',
            content:
              'You are a precise blueprint analysis assistant. Output ONLY valid JSON matching the requested fields. Do not include markdown formatting.',
          };
          const userMsg = {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: blueprintUrl } },
            ],
          };
          const resp = await postWithTimeout(
            'https://openrouter.ai/api/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${openRouterKey}`,
                'HTTP-Referer': 'http://localhost',
                'X-Title': 'BlueprintBuilderPro',
              },
              body: JSON.stringify({
                model,
                messages: [sysMsg, userMsg],
                temperature: 0.2,
              }),
            },
            45000
          );
          if (!resp.ok) throw new Error('OpenRouter API Error');
          const data = await resp.json();
          const text = data?.choices?.[0]?.message?.content || '';
          const jsonText = text.replace(/```json\n?|\n?```/g, '').trim();
          result = JSON.parse(jsonText);
          providerUsed = 'openrouter';
          break;
        } catch (e) {
          errors.push({ provider: 'openrouter', message: e.message || String(e) });
        }
      }
    }

    if (!result) {
      return res.status(502).json({ error: 'No provider succeeded', details: errors, provider_order: order });
    }
    res.json({ provider: providerUsed, result });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT ? Number(process.env.PORT) : 8787;
app.listen(port, () => {});

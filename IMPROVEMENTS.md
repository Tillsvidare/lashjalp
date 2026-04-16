# Kommande förbättringsförslag

## Gemini Flash OCR via Cloudflare Worker

Tesseract.js fungerar offline men ger begränsad OCR-kvalitet. Gemini Flash har betydligt bättre textextrahering, särskilt för svårlästa bilder och handskriven text.

### Upplägg

- **Cloudflare Worker** (gratis, 100k anrop/dag) som proxy till Gemini API
- Gemini API-nyckeln lagras som hemlig variabel i workern — exponeras aldrig för klienten
- Appen skickar bilden som base64 till workern, får tillbaka extraherad text
- Tesseract behålls som offline-fallback

### Vad som behövs

1. Gemini API-nyckel (gratis från https://aistudio.google.com/apikey)
2. Cloudflare-konto (gratis från https://dash.cloudflare.com/sign-up)
3. Deploya en Cloudflare Worker med `wrangler`
4. Uppdatera appen med en ny OCR-motor-väljare

### Plan

- Implementera i en egen branch (`feature/gemini-ocr`)
- Behåll Tesseract som valbart alternativ för offline-användning

# OCR Läshjälp

En progressiv webbapp (PWA) som tolkar text från bilder via OCR och läser upp den högt. Tänkt som hjälpmedel för elever med lässvårigheter.

## Funktioner

- OCR direkt i webbläsaren via Tesseract.js (https://tesseract.projectnaptha.com/). Inga bilder skickas till någon server.
- Textuppläsning via Web Speech API med svenska röster från operativsystemet.
- Synkroniserad ordmarkering under uppläsning.
- Justerbar hastighet, tonhöjd, textstorlek, radavstånd.
- Teman: varmt papper, mörkt, hög kontrast.
- OpenDyslexic-teckensnitt som val.
- Installerbar som app på Android, iOS och desktop.
- Fungerar offline efter första laddningen.

## Publicera på GitHub Pages

1. Skapa ett nytt GitHub-repo, t.ex. `ocr-lashjalp`.
2. Klona och kopiera alla filer från denna mapp:
   ```
   index.html
   manifest.webmanifest
   sw.js
   icons/
   README.md
   ```
3. `git add . && git commit -m "Initial" && git push`
4. Gå till repo-inställningarna, sektionen Pages.
5. Välj source: `main`-branchen, mapp: `/ (root)`.
6. Efter någon minut är appen tillgänglig på `https://DITT-ANVNAMN.github.io/ocr-lashjalp/`.

## Publicera på Netlify (drag-and-drop)

1. Gå till https://app.netlify.com/drop
2. Dra hela mappen (inte en zip) till sidan.
3. Klart. Du får en URL direkt.

## Publicera på Cloudflare Pages

1. Skapa ett projekt, koppla GitHub-repot.
2. Build-kommando: lämna tomt (ingen build behövs).
3. Output directory: `/` (root).
4. Deploy.

## Lokal testning

PWA-funktionalitet (service worker, install-prompt) kräver HTTPS eller localhost. Enklast:

```bash
cd ocr-lashjalp
python3 -m http.server 8000
# Öppna http://localhost:8000 i Chrome/Edge
```

## Integritet

- Alla bilder bearbetas lokalt i webbläsaren med WebAssembly-OCR.
- Tesseract-språkdata (ca 12 MB per språk) laddas från https://tessdata.projectnaptha.com via jsdelivr vid första körningen och cachas därefter lokalt i webbläsaren.
- Ingen analytics, inga cookies, ingen server.

## Licens

Koden är fri att använda och modifiera. Tesseract.js licens: Apache 2.0. OpenDyslexic-fonten distribueras med egen licens från https://opendyslexic.org/.

## Kända begränsningar

- Textuppläsningens kvalitet beror på vilka svenska röster som är installerade i operativsystemet. På Android krävs Google TTS eller Samsung TTS med svenska språkpaket. På Windows finns "Bengt" och "Hedvig", på macOS "Alva" och "Klara".
- Ordmarkering under uppläsning kräver att rösten rapporterar ordgränser (`onboundary`). Stöds i Chrome/Edge/Safari, sämre i Firefox med vissa röster.
- OCR-kvaliteten beror på bildkvalitet. Rak bild, bra belysning och minst 300 DPI ger bäst resultat.

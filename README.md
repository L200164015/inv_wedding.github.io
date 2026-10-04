# Wedding Invitation — Assyati & Arrotama

Static site (HTML/CSS/JS) + Google Sheets via Apps Script. Hosted on GitHub Pages.

## Files
| File | Purpose |
|---|---|
| `config.js` | **All editable content**: names, parents, date/time, venue, bank, address, script URL, music, photos |
| `index.html`, `style.css`, `app.js` | Page, design, logic |
| `assets/` | `cover.jpg`, `groom.jpg`, `bride.jpg`, `closing.jpg`, `music.mp3` |
| `apps-script/Code.gs` | Backend code to paste into Google Apps Script |

## 1. Connect Google Sheets (one time, ~3 minutes)
1. Open the spreadsheet → **Extensions → Apps Script**.
2. Replace the editor contents with `apps-script/Code.gs` and save.
3. Select function `doGet` → **Run** once, then approve permissions (Advanced → Go to project → Allow).
4. **Deploy → New deployment → Web app**: Execute as **Me**, Who has access **Anyone** → Deploy.
5. Copy the **Web app URL** (ends in `/exec`) into `scriptUrl` in `config.js`.
6. After editing `Code.gs` later: **Deploy → Manage deployments → Edit → New version**.

The script creates a tab named `RSVP` with the columns Timestamp, Name, Attendance, Guests, Message, Visible. Set `Visible` to `FALSE` to hide a wish from the site. Export with **File → Download → CSV/XLSX**.

## 2. Deploy to GitHub Pages
```bash
git add . && git commit -m "Wedding invitation" && git push origin main
```
Then on GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
Site URL: `https://l200164015.github.io/wedding/`

## 3. Personalised guest links
Append `?to=Name`, e.g. `https://l200164015.github.io/wedding/?to=Ade%20Fitriyani`.

## 4. Photos & music
- Photos: resize to ~1200px on the long edge, JPG quality ~75 or WebP (aim under 250 KB each). Name them as in `config.js`.
- Music: export a short MP3 (~128 kbps, under 4 MB) to `assets/music.mp3`. YouTube pages can't be played directly in a lightweight invitation, and the saxophone cover is likely copyrighted: use a track you have rights to.
- Videos: not embedded by default to keep the page fast. Compress to a short MP4 (under 5 MB) if you want one in the closing section.

## 5. Change the time
Edit `dateISO` (e.g. `2026-11-14T08:00:00+07:00`) and `timeLabel` in `config.js`. The countdown and Google Calendar link update automatically.

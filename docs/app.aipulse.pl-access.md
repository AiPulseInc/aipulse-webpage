# Archiwizacja starej strony aipulse.pl (Nicepage) — dostęp przez app.aipulse.pl

**Status:** ODROCZONE. Dostęp nie skonfigurowany — pliki starej strony pozostają na wer.pl dysku jako orphan.

**Cel:** Zarchiwizować starą Nicepage (homepage + `/hp1-3.html` + `/yt` YouTube Transcript Generator + podstrony) zanim wer.pl usunie je lub zmieni infrastrukturę.

## Kontekst

Po migracji DNS 2026-04-18:
- `aipulse.pl` → Cloudflare → Railway (nowa Vite app, v0.5648+)
- Stare pliki Nicepage zostały na dysku wer.pl pod konto klienta — nieosiągalne z internetu (nie ma DNS pointer'a)
- Subdomena `app.aipulse.pl` istniała na wer.pl (testowa, pokazywała placeholder `7890.v.tld.pl`)
- Cloudflare DNS NIE ma rekordu `app` (usunięty przy czyszczeniu importowanych śmieci)

wer.pl kieruje ruch na podstawie Host header. Obecny vhost dla `app.aipulse.pl` serwuje placeholder, **nie starą stronę `aipulse.pl`**. Żeby `app.aipulse.pl` pokazał Nicepage, wer.pl musi przekonfigurować vhost (document_root → stara strona aipulse.pl).

## Kluczowe dane

- Stary serwer wer.pl IP: **`94.152.131.203`**
- Wer.pl mail/tech domain: **`poczta58703.wer.pl`** (mail), ogólnie infra pod `*.wer.pl` / `*.v.tld.pl`
- Panel wer.pl klienta: login przez https://wer.pl (znajdź w ustawieniach konta)
- Prawdopodobna ścieżka dokumentów: `/domains/aipulse.pl/public_html/` lub `/public_html/aipulse.pl/` lub `/home/<login>/domains/aipulse.pl/public_html/`

## 3 drogi archiwizacji — wybór

### A. Pobierz pliki z panelu wer.pl (REKOMENDOWANE)

Najczystsze, 1:1, bez DNS hacków.

1. Zaloguj się do wer.pl panelu klienta
2. File Manager / FTP / SFTP
3. Znajdź katalog `public_html` dla aipulse.pl
4. Download cały folder (zip/tar)

**Zalety:** surowe źródło, pełna struktura, wszystkie pliki (nawet te nielinkowane z HTML). Żadnych strat bo nie przechodzi przez wget/render.

**Wady:** wymaga logowania do panelu wer.pl — user musi mieć credentials.

### B. Tymczasowy dostęp przez /etc/hosts (LOKALNY)

Wymuś na swoim Macu że `aipulse.pl` wskazuje na stary wer.pl IP — widzisz starą stronę tylko Ty, reszta świata widzi nową.

```bash
# Przekieruj lokalnie
sudo sh -c 'echo "94.152.131.203 aipulse.pl www.aipulse.pl" >> /etc/hosts'
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder

# Otwórz https://aipulse.pl w Safari/Chrome → zobaczysz starą Nicepage
# (SSL może dać warning bo cert wer.pl nie obejmuje aipulse.pl)

# Archiwizacja przez wget mirror
cd ~/archives/aipulse-old/
wget --mirror \
     --convert-links \
     --adjust-extension \
     --page-requisites \
     --no-parent \
     http://aipulse.pl/

# Po archiwizacji USUŃ wpis — inaczej Twój Mac dalej będzie widział starą wersję
sudo sed -i '' '/aipulse\.pl/d' /etc/hosts
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder
```

**Zalety:** nie wymaga panel wer.pl, szybkie, wget daje clean static mirror.

**Wady:** łapie tylko to co jest linkowane z HTML (nie assets które tylko JS używa), SSL warning, musisz pamiętać żeby usunąć /etc/hosts wpis.

### C. wer.pl vhost alias + Cloudflare A record

Poproś wer.pl support o alias: `app.aipulse.pl` → document_root starej strony aipulse.pl.

Po ich zrobieniu, w Cloudflare DNS:
- Type: `A`
- Name: `app`
- IPv4: `94.152.131.203`
- Proxy: **DNS only**

Wtedy `app.aipulse.pl` publicznie serwuje starą stronę — można archiwizować wgetem bez /etc/hosts tricku.

**Zalety:** publiczny dostęp, brak hacków lokalnych, można delegować archiwizację.

**Wady:** wymaga supportu wer.pl, SSL wciąż warning chyba że Cloudflare Proxy z Flexible SSL (ale backend wer.pl nie ma HTTPS na subdomenie → problem).

## Rekomendacja finalna

**Zacznij od A** (panel wer.pl → download ZIP/tar). Jeśli user nie ma dostępu do File Manager albo panel nie daje bulk download — fallback na **B** (`/etc/hosts` + wget mirror).

**C zostawić jako last resort** — wymaga czekania na wer.pl support, dodaje obciążenia DNS, a po archiwizacji i tak usuniesz alias.

## Co zarchiwizować

Stara Nicepage na aipulse.pl miała:
- Homepage Nicepage
- `/hp1-3.html` — trzy wewnętrzne strony Nicepage
- `/yt` — YouTube Transcript Generator (osobna mini-app)
- Prawdopodobnie assets (CSS/JS/fonts/images) w podkatalogach

Po archiwizacji zapisz jako:
- `~/archives/aipulse-old/` (lokalnie)
- Lub commit do osobnego repo `aipulse-legacy-archive` w AiPulseInc

## Kiedy do tego wrócić

- Przed każdą większą zmianą w wer.pl (ryzyko że pliki znikną)
- Przed rezygnacją z hostingu wer.pl (jeśli kiedyś)
- Gdy user będzie chciał migrować `/yt` do Railway (wtedy pliki /yt będą potrzebne)

## Nie pilne

Pliki są na wer.pl dysku, wer.pl nadal aktywny (mail + send.aipulse.pl). Póki user płaci za hosting, pliki żyją. Priorytet: LOW.

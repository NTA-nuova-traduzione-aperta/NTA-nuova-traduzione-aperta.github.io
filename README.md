# nta-nuova-traduzione-aperta.github.io

Sito della **NTA — Nuova Traduzione Aperta**: https://nta-nuova-traduzione-aperta.github.io

Sito statico, nessuna build. GitHub Pages pubblica il branch `main`.

- `index.html` — home; `revisione/` — stato della revisione in corso (oggi la **26.11**: anno e mese di uscita)
- `assets/nta.css`, `assets/nta.js` — stile e script comuni (tema chiaro/scuro, lettura dello stato)
- `stato.json` — stato della revisione libro per libro. **Non si modifica a mano**: lo genera il CMS
  (`npm run export:nta-stato` in `packages/server`, `--revisione AA.MM` per la prossima), poi commit e push.

- `assets/` — logo (SVG con le lettere in tracciati, PNG per icone e anteprime social)
- Il testo della Bibbia vive nel repo [`bibbia`](https://github.com/NTA-nuova-traduzione-aperta/bibbia).

Logo: lettere in Cormorant Garamond (SIL Open Font License 1.1), convertite in tracciati.

# PDFCraft Desktop

PDFCraft now has two delivery targets from the same repository:

- **Web:** the existing GitHub Pages site.
- **Desktop:** a Tauri 2 application for Windows.

## Windows build

Run:

```bash
npm install
npm run tauri build -- --bundles nsis
```

The installer is produced under:

```
src-tauri/target/release/bundle/nsis/
```

GitHub Actions also builds and uploads a **PDFCraft-Windows-Installer** artifact.

## PDF file association

The Tauri bundle declares `.pdf` as a supported file type. After installation, Windows can list PDFCraft under **Open with** and in **Default apps** for PDF files.

Windows decides the user's default PDF application. The installer registers PDFCraft as a capable handler, but it does not silently override the user's existing default application.

## Opening a PDF from Explorer/Desktop

When PDFCraft starts with a PDF path, the Rust shell reads the file locally and sends its bytes into the existing PDFCraft editor. If PDFCraft is already running, the single-instance plugin forwards the new PDF path to the existing window and focuses it.

## Offline desktop runtime

The web version keeps using the CDN libraries. During the desktop build, `scripts/prepare-desktop.mjs` downloads the pinned PDF.js and pdf-lib versions into the packaged app so the installed reader does not need those CDN files at runtime.

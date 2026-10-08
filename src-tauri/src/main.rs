#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::Path};
use tauri::{Emitter, Manager};

fn find_pdf_arg(args: &[String]) -> Option<String> {
    args.iter()
        .skip(1)
        .find(|arg| Path::new(arg).extension().and_then(|x| x.to_str()).map(|x| x.eq_ignore_ascii_case("pdf")).unwrap_or(false))
        .cloned()
}

#[tauri::command]
fn startup_pdf_path() -> Option<String> {
    let args: Vec<String> = std::env::args().collect();
    find_pdf_arg(&args)
}

#[tauri::command]
fn read_pdf_file(path: String) -> Result<Vec<u8>, String> {
    let p = Path::new(&path);
    let is_pdf = p.extension()
        .and_then(|x| x.to_str())
        .map(|x| x.eq_ignore_ascii_case("pdf"))
        .unwrap_or(false);

    if !is_pdf {
        return Err("Only PDF files are allowed.".into());
    }

    fs::read(p).map_err(|e| format!("Could not read PDF: {e}"))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            if let Some(path) = find_pdf_arg(&args) {
                let _ = app.emit("open-pdf-path", path);
            }
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }))
        .invoke_handler(tauri::generate_handler![startup_pdf_path, read_pdf_file])
        .run(tauri::generate_context!())
        .expect("error while running PDFCraft");
}

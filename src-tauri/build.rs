fn main() {
    tauri_build::build();

    // Note: UAC manifest is added via post-build step using mt.exe
    // to avoid conflicts with Tauri's built-in manifest
}

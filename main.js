const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');

const REACT_DEV_URL = 'http://localhost:3000';

if (process.platform === 'win32') {
    // Set App User Model ID for Windows taskbar grouping
    app.setAppUserModelId("PersonalProductivitySuite");
}

let mainWindow;
let splash;

function createWindow() {
    // Create splash screen with transparent background and rounded corners
    splash = new BrowserWindow({
        width: 500,
        height: 400,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        }
    });

    // Enhanced splash screen with rounded corners and transparent background
    splash.loadURL('data:text/html,<style>body{font-family:sans-serif;text-align:center;padding-top:150px;background:transparent;border:10px solid rgba(255, 255, 255, 0.3);border-radius:20px;color:white;} h2{font-size:30px;font-weight:bold;margin:0;}</style><h2>Loading App...</h2>');

    // Prepare the main window but do not show it yet
    mainWindow = new BrowserWindow({
        width: 970,
        height: 700,
        show: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            setMenubarVisibility: false,
        },
    });

    mainWindow.setMenuBarVisibility(false); // Hide the menu bar

    const loadReact = () => {
        http.get(REACT_DEV_URL, () => {
            // Load React once available
            mainWindow.loadURL(REACT_DEV_URL).then(() => {
                splash.destroy();
                mainWindow.show();
            });
        }).on('error', () => {
            setTimeout(loadReact, 500); // Retry after 500 ms
        });
    };

    loadReact();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

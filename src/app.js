import { app } from 'electron';
import path from "path";
import Window from "./main/window";
import{powerSaveBlocker} from 'electron';
require('@electron/remote/main').initialize();
app.once("ready", () => {
    app.commandLine.appendSwitch("disable-renderer-backgrounding");
    powerSaveBlocker.start('prevent-display-sleep');
    Window.load(`file://${path.join(__dirname, `html/index.html`)}`).then(()=>{
        // Window.openDevTools();
    });
});
app.once('window-all-closed', function () {
    app.quit();
});
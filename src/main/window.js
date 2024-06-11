const { BrowserWindow, ipcMain } = require('electron');
class Window {
    constructor() 
    {
        ipcMain.on("renderer", this.onMessage.bind(this));
        this._channels = {};
        this._uart = null;
    }
    load(url) {
        const self = this;
        if (!self._win) {
            self._win = new BrowserWindow({
                width: 1000,
                height: 750,
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                    enableRemoteModule:true
                }
            });
            self._win.webContents.openDevTools();
            require('@electron/remote/main').enable(self._win.webContents)
        }
        return new Promise(resolve => {
            self._win.once('ready-to-show', () => {
                self._win.show();
                resolve();
            });
            self._win.loadURL(url);
        });
    }
    openDevTools() {
        this._win.openDevTools();
    }
    send(channel, data) {
        this._win.webContents.send(channel, data);
    }
    onMessage(evt, msg) {
        if (this._channels[msg.method]) {
            this._channels[msg.method](evt.sender, msg);
        }
    }
    on(channel, callback) {
        this._channels[channel] = callback;
    }
}
export default new Window();
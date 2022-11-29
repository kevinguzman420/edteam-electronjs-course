const { app } = require("electron");
const { createWindow } = require("./main");

require("./db");

app.whenReady().then(createWindow);

app.disableHardwareAcceleration(); // disabled error

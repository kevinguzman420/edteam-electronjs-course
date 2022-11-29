const { BrowserWindow, Menu, app, ipcMain, Notification } = require("electron");
const Product = require("./models/Product");

// MAIN WINDOW
let mainWindow = null;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("src/gui/html/index.html");
  const mainMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("close", () => {
    app.quit();
  });
}
// Custom main menu
const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Products",
        accelerator: process.platform === "darwin" ? "Cmd+p" : "Ctrl+p",
        click() {
          console.log("Hola EDteam!!!");
        },
      },
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Cmd+p" : "Ctrl+q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

if (process.platform === "darwin") {
  template.unshift({
    label: app.getName()
  })
}

// PRODUCT WINDOW
let productWindow = null;
function createProductWindow() {
  productWindow = new BrowserWindow({
    width: 700,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  productWindow.loadFile("src/gui/html/create_product.html");
  productWindow.on("close", () => {
    productWindow = null;
  });
}

ipcMain.on("show-create-product", () => {
  productWindow === null && createProductWindow();
});

// Request all products
ipcMain.on("request-all-products", async () => {
  const products = await Product.find();
  mainWindow.webContents.send("new-product", JSON.stringify(products));
});

// Create product
ipcMain.on("create-product", async (event, product) => {
  const newProduct = Product(product);
  await newProduct.save();
  const products = await Product.find();
  mainWindow.webContents.send("new-product", JSON.stringify(products));
  productWindow.close();
});

// Delete product
ipcMain.on("delete-product", async (e, product_id) => {
  await Product.findByIdAndDelete(product_id);
  const products = await Product.find();
  mainWindow.webContents.send("new-product", JSON.stringify(products));
});

// Get product by id
ipcMain.on("get-product-by-id", async (e, product_id) => {
  const product = await Product.findById(product_id);
  createProductWindow();
  productWindow.webContents.on("did-finish-load", () => {
    productWindow.webContents.send("set-product", JSON.stringify(product));
  });
});

// Update product
ipcMain.on("update-product", async (e, product) => {
  await Product.findByIdAndUpdate(product.id, {
    name: product.name,
    description: product.description,
    price: product.price,
  });
  const products = await Product.find();
  mainWindow.webContents.send("new-product", JSON.stringify(products));
  productWindow.close();
});

// Notifications
ipcMain.on("show-notification", (e, notification) => {
  new Notification({
    title: notification.title,
    body: notification.body
  }).show();
});

module.exports = { createWindow };

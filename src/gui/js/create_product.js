const { ipcRenderer } = require("electron");

let updateStatus = false;
let productId = null;

const $form = document.querySelector("#productForm");
const $name = document.querySelector("#name");
const $description = document.querySelector("#description");
const $price = document.querySelector("#price");

$form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newProduct = {
    name: $name.value,
    description: $description.value,
    price: $price.value,
  };

  if (!updateStatus) {
    ipcRenderer.send("create-product", newProduct);
    const notification = {
      title: "Products",
      body: `Product ${$name.value} has been created successfully.`
    }
    ipcRenderer.send("show-notification", notification);
  } else {
    newProduct.id = productId;
    const notification = {
      title: "Products",
      body: `Product ${$name.value} has been updated successfully.`
    }
    ipcRenderer.send("update-product", newProduct);
    ipcRenderer.send("show-notification", notification);
  }
});

ipcRenderer.on("set-product", (e, data) => {
  const product = JSON.parse(data);
  $name.value = product.name;
  $description.value = product.description;
  $price.value = product.price;
  productId = product._id;
  updateStatus = true;
});

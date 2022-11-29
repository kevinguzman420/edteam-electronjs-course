const { ipcRenderer } = require("electron");

const $main = document.querySelector("#main");
let $productList = null;

function home() {
  $main.innerHTML = `
          <div class="flex flex-col justify-center items-center w-full h-full text-white">
            <figure class="mb-3">
                <img src="../imgs/electron-logo.png" alt="" width="250" height="250">
            </figure>
            <p class="mb-1 text-2xl font-light">Curso de Electron JS</p>
            <h2 class="text-2xl">EDteam</h2>
        </div>
          `;
}

function products() {
  $main.innerHTML = `
          <div class="flex justify-center items-start w-full h-full text-white">
            <div class="mt-8 w-[95%]">
              <div class="flex justify-between items-center px-8 h-[56px] bg-gray-800">
                <span>Nombre</span>
                <span>Descripción</span>
                <span>Precio</span>
                <span>Fecha Creación</span>
                <span>Acciones</span>
              </div>
              <div id="products" class="bg-gray-700 px-2 py-2"></div>
            </div>
          </div>
          `;
  $productList = document.querySelector("#products");

  ipcRenderer.send("request-all-products");
}

function create_product() {
  ipcRenderer.send("show-create-product");
}

ipcRenderer.on("new-product", (e, products) => {
  $productList.innerHTML = "";
  JSON.parse(products).map(
    (product) => ($productList.innerHTML += cardProduct(product))
  );
});

function cardProduct(product) {
  const date = new Date(product.createdAt);
  created_at = date.toLocaleDateString();
  return `
       <div class="flex justify-between items-center mb-2 px-3 h-[48px] text-white bg-slate-600 rounded">
        <span>${product.name}</span>
        <span>${product.description}</span>
        <span>${product.price}</span>
        <span>${created_at}</span>
        <div>
          <button onclick="update_product('${product._id}')" class="px-2 py-1 text-sm bg-blue-700 rounded">
            <i class="fa-solid fa-rotate"></i>
            Update
          </button>
          <button onclick="delete_product('${product._id}')" class="px-2 py-1 text-sm bg-red-700 rounded">
            <i class="fa-solid fa-trash"></i>
            Delete
          </button>
        </div>
       </div>
      `;
}

// Delete product
function delete_product(product_id) {
  if (confirm("Estás seguro de borrar este producto?")) {
    ipcRenderer.send("delete-product", product_id);

    const notification = {
      title: "Products",
      body: `Product has been deleted successfully.`
    }
    ipcRenderer.send("show-notification", notification);
  }
}

// Update product
function update_product(product_id) {
  ipcRenderer.send("get-product-by-id", product_id);
}

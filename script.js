console.clear();
const permissionSet = new Set([
  "ADD_TO_CART",
  "REMOVE_FROM_CART",
  "EMPTY_CART",
  "DISCOUNT_15",
]);

let productItem = [];
let payedCart = JSON.parse(sessionStorage.getItem("payedCart"));

setProducts();
if (payedCart && !isCartEmpty()) {
  updateAvailableStock();
  emptyCart();
}
showProductGallery(productItem);
showCartTable();
sessionStorage.setItem("payedCart", JSON.stringify(false));

function setProducts() {
  if (localStorage.getItem("shop")) {
    console.log("old shop");
    let shopArray = JSON.parse(localStorage.getItem("shop"));
    shopArray.forEach(function (product) {
      productItem.push(product);
    });
  } else {
    console.log("new shop");
    productItem = [
      new Product(1, "FinePix Pro2 3D Camera", "1800.00", 10, "camera.jpg"),
      new Product(
        2,
        "EXP Portable HD",
        "800.00",
        10,
        "external-hard-drive.jpg"
      ),
      new Product(
        3,
        "Luxury Ultra thin Wrist Watch",
        "500.00",
        10,
        "watch.jpg"
      ),
      new Product(4, "XP 1155 Intel Core Laptop", "1000.00", 10, "laptop.jpg"),
    ];
    const shopStockJSON = JSON.stringify(productItem);
    localStorage.setItem("shop", shopStockJSON);
  }
}

function updateAvailableStock() {
  if (!isCartEmpty()) {
    cartArray = JSON.parse(sessionStorage.getItem("shopping-cart"));

    for (let i = 0; i < cartArray.length; i++) {
      const productIndex = Number(cartArray[i].id);
      productItem[productIndex - 1].stock = cartArray[i].stock;
      const shopStockJSON = JSON.stringify(productItem);
      localStorage.setItem("shop", shopStockJSON);
    }
  }
}

function Product(id, name, price, stock, photo) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.stock = stock;
  this.photo = photo;
}

function addToCart(element) {
  const productParent = element.closest("div.product-item");
  let id = productParent.querySelector(".productid").value;
  let name = productParent.querySelector(".productname").innerText;
  let price = productParent.querySelector(".price span").innerText;
  let stock = productParent.querySelector(".stock span").innerText;
  let quantity = productParent.querySelector(".product-quantity").value;

  let cartItem = {
    id: id,
    name: name,
    price: price,
    stock: stock,
    quantity: quantity,
  };

  let cartArray = new Array();
  // If javascript shopping cart session is not empty
  if (!isCartEmpty()) {
    cartArray = JSON.parse(sessionStorage.getItem("shopping-cart"));
    const itemIndex = cartArray.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      if (stock >= Number(cartArray[itemIndex].quantity) + Number(quantity)) {
        cartArray[itemIndex].quantity =
          Number(cartArray[itemIndex].quantity) + Number(quantity);
      } else {
        alert("You can't add more than the current stock!");
      }
    } else {
      cartArray.push(cartItem);
    }
  } else {
    cartArray.push(cartItem);
  }

  const cartJSON = JSON.stringify(cartArray);
  sessionStorage.setItem("shopping-cart", cartJSON);
  showCartTable();
}

function removeFromCart(element) {
  let productParent = element.closest("div.product-item");
  let id = productParent.querySelector(".productid").value;
  let quantity = productParent.querySelector(".product-quantity").value;

  let cartArray = new Array();
  // If javascript shopping cart session is not empty
  if (!isCartEmpty()) {
    cartArray = JSON.parse(sessionStorage.getItem("shopping-cart"));
    const itemIndex = cartArray.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      cartArray[itemIndex].quantity = Math.max(
        Number(cartArray[itemIndex].quantity) - Number(quantity),
        0
      );
      if (!cartArray[itemIndex].quantity) {
        cartArray = cartArray.filter((value, index) => index !== itemIndex);
      }
    } else {
      alert("This item is not in your cart");
    }
  }
  if (!isCartEmpty()) {
    sessionStorage.removeItem("shopping-cart");
  }

  const cartJSON = JSON.stringify(cartArray);
  sessionStorage.setItem("shopping-cart", cartJSON);
  showCartTable();
}

function isCartEmpty() {
  const cart = JSON.parse(sessionStorage.getItem("shopping-cart"));
  console.log("cart = " + cart);
  if (cart && cart.length == 0) {
    return true;
  } else if (cart == null || cart == undefined) {
    return true;
  }
  return false;
}

function emptyCart() {
  if (!isCartEmpty()) {
    sessionStorage.removeItem("shopping-cart");
    showCartTable();
  } else {
    alert("Cart is already empty!");
  }
}

function checkout() {
  if (!isCartEmpty()) {
    window.location.href = "https://yarinnasri.github.io/Payment-Page/";
  } else {
    alert("Cannot proceed if the cart is empty!");
  }
}

function showCartTable() {
  let cartRowHTML = "";
  let itemCount = 0;
  let grandTotal = 0;

  let price = 0;
  let quantity = 0;
  let subTotal = 0;

  if (!isCartEmpty()) {
    let shoppingCart = JSON.parse(sessionStorage.getItem("shopping-cart"));

    //Iterate javascript shopping cart array
    shoppingCart.forEach(function (item) {
      price = parseFloat(item.price);
      quantity = parseInt(item.quantity);
      subTotal = price * quantity;
      itemCount += quantity;

      cartRowHTML +=
        "<tr>" +
        "<td>" +
        item.name +
        "</td>" +
        "<td class='text-right'>$" +
        price.toFixed(2) +
        "</td>" +
        "<td class='text-right'>" +
        quantity +
        "</td>" +
        "<td class='text-right'>$" +
        subTotal.toFixed(2) +
        "</td>" +
        "</tr>";

      grandTotal += subTotal;
    });
  }

  document.querySelector("#cartTableBody").innerHTML = cartRowHTML;
  document.querySelector("#itemCount").innerText = itemCount;
  document.querySelector("#totalAmount").innerText =
    "$" + grandTotal.toFixed(2);
}

function showProductGallery(product) {
  //Iterate javascript shopping cart array
  let productHTML = "";
  product.forEach(function (item) {
    productHTML +=
      '<div class="product-item">' +
      '<input class="productid" type="hidden" value="' +
      item.id +
      '">' +
      '<img src="./assets/product-images/' +
      item.photo +
      '">' +
      '<div class="productname">' +
      item.name +
      "</div>" +
      '<div class="price">$<span>' +
      item.price +
      "</span></div>" +
      '<div class="stock"><span>' +
      `${item.stock}` +
      "</span> in stock</div>";

    if (item.stock != 0) {
      productHTML +=
        '<div class="cart-action">' +
        '<input type="number" class="product-quantity" name="quantity" value="1" size="2" min="1"' +
        `max="${item.stock}" />` +
        '<input type="submit" value="Add" class="add-to-cart" onClick="addToCart(this)" />' +
        '<input type="submit" value="Remove" class="remove-from-cart" onClick="removeFromCart(this)" />' +
        "</div>";
    }
    productHTML += "</div>";
  });

  document.querySelector("#product-item-container").innerHTML = productHTML;
}

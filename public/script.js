// =========================
// PERFUME PRODUCTS
// =========================

const products = [
    {
        id: 1,
        name: "Perfume 1",
        price: 399,
        image: "images_perfume/image1.jpg",
        description: "Elegant fragrance for everyday use."
    },
    {
        id: 2,
        name: "Perfume 2",
        price: 475,
        image: "images_perfume/image2.jpg",
        description: "Fresh and lovely fragrance."
    },
    {
        id: 3,
        name: "Perfume 3",
        price: 550,
        image: "images_perfume/image3.jpg",
        description: "Sweet and attractive scent."
    },
    {
        id: 4,
        name: "Perfume 4",
        price: 625,
        image: "images_perfume/image4.jpg",
        description: "Perfect fragrance for any occasion."
    },
    {
        id: 5,
        name: "Perfume 5",
        price: 750,
        image: "images_perfume/image5.jpg",
        description: "Premium-inspired fragrance."
    }
];


// =========================
// STORAGE
// =========================

let cart =
    JSON.parse(
        localStorage.getItem(
            "perfume_shop_cart"
        )
    ) || [];

let currentUser =
    JSON.parse(
        localStorage.getItem(
            "perfume_shop_user"
        )
    ) || null;


// =========================
// PRODUCTS
// =========================

function displayProducts() {

    const productList =
        document.getElementById(
            "productList"
        );

    if (!productList) return;

    productList.innerHTML = "";

    products.forEach(function(product) {

        const card =
            document.createElement("div");

        card.className =
            "product-card";

        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <h3>${product.name}</h3>

            <p>
                ${product.description}
            </p>

            <div class="product-price">
                ₱${product.price.toFixed(2)}
            </div>

            <button
                onclick="viewProduct(${product.id})">
                View Product
            </button>

            <button
                onclick="addToCart(${product.id})">
                Add to Cart
            </button>

        `;

        productList.appendChild(card);
    });
}


// =========================
// VIEW PRODUCT
// =========================

function viewProduct(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) return;

    alert(
        product.name +
        "\n\n" +
        product.description +
        "\n\nPrice: ₱" +
        product.price.toFixed(2)
    );
}


// =========================
// CART
// =========================

function addToCart(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) return;

    const existing =
        cart.find(
            item => item.id === id
        );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            selected: true
        });
    }

    saveCart();

    displayCart();

    alert(
        product.name +
        " added to cart!"
    );
}


function displayCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    const cartTotal =
        document.getElementById(
            "cartTotal"
        );

    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.textContent =
            "0.00";

        return;
    }

    let selectedTotal = 0;

    cartItems.innerHTML = "";

    cart.forEach(function(item, index) {

        const total =
            Number(item.price) *
            Number(item.quantity);

        if (item.selected) {

            selectedTotal += total;
        }

        const row =
            document.createElement("div");

        row.className =
            "cart-item";

        row.innerHTML = `

            <div class="cart-item-left">

                <input
                    class="cart-checkbox"
                    type="checkbox"
                    ${item.selected ? "checked" : ""}
                    onchange="
                        toggleCartItem(${index})
                    "
                >

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <p>
                        ₱${Number(item.price).toFixed(2)}
                    </p>

                    <div class="quantity-controls">

                        <button
                            onclick="
                                decreaseQuantity(${index})
                            ">
                            -
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="
                                increaseQuantity(${index})
                            ">
                            +
                        </button>

                    </div>

                </div>

            </div>

            <div>

                <strong>
                    ₱${total.toFixed(2)}
                </strong>

                <br><br>

                <button
                    class="remove-btn"
                    onclick="
                        removeFromCart(${index})
                    ">
                    Remove
                </button>

            </div>

        `;

        cartItems.appendChild(row);
    });

    cartTotal.textContent =
        selectedTotal.toFixed(2);
}


function toggleCartItem(index) {

    if (!cart[index]) return;

    cart[index].selected =
        !cart[index].selected;

    saveCart();

    displayCart();
}


function increaseQuantity(index) {

    if (!cart[index]) return;

    cart[index].quantity++;

    saveCart();

    displayCart();
}


function decreaseQuantity(index) {

    if (!cart[index]) return;

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);
    }

    saveCart();

    displayCart();
}


function removeFromCart(index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart();

    displayCart();
}


function saveCart() {

    localStorage.setItem(
        "perfume_shop_cart",
        JSON.stringify(cart)
    );
}


// =========================
// CHECKOUT
// =========================

function checkout() {

    if (!currentUser) {

        alert(
            "Please login first before checkout."
        );

        openLogin();

        return;
    }

    const selectedItems =
        cart.filter(
            item => item.selected
        );

    if (selectedItems.length === 0) {

        alert(
            "Please select at least one item."
        );

        return;
    }

    let total = 0;

    selectedItems.forEach(function(item) {

        total +=
            Number(item.price) *
            Number(item.quantity);

    });

    localStorage.setItem(
        "perfume_shop_checkout",
        JSON.stringify({
            items: selectedItems,
            total: total
        })
    );

    showPaymentMethod();
}


// =========================
// PAYMENT METHOD
// =========================

function showPaymentMethod() {

    const modal =
        document.getElementById(
            "paymentModal"
        );

    if (!modal) return;

    modal.style.display =
        "flex";
}


function closePaymentMethod() {

    const modal =
        document.getElementById(
            "paymentModal"
        );

    if (modal) {

        modal.style.display =
            "none";
    }
}


function selectPaymentMethod(method) {

    closePaymentMethod();

    if (method === "PayMaya") {

        startPayMayaPayment();

        return;
    }

    if (method === "COD") {

        placeCODOrder();

        return;
    }
}


// =========================
// PAYMAYA
// =========================

async function startPayMayaPayment() {

    const checkoutData =
        JSON.parse(
            localStorage.getItem(
                "perfume_shop_checkout"
            )
        );

    if (!checkoutData) {

        alert(
            "Checkout information not found."
        );

        return;
    }

    if (!currentUser) {

        alert(
            "Please login first."
        );

        openLogin();

        return;
    }

    try {

        const response =
            await fetch(
                "/api/checkout",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            cart:
                                checkoutData.items,

                            userId:
                                currentUser.id

                        })
                }
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Unable to start Maya payment."
            );

            return;
        }

        localStorage.setItem(
            "perfume_shop_pending_order",
            JSON.stringify({

                orderNumber:
                    data.orderNumber,

                checkoutId:
                    data.checkoutId

            })
        );

        window.location.href =
            data.redirectUrl;

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }
}


// =========================
// COD
// =========================

async function placeCODOrder() {

    const checkoutData =
        JSON.parse(
            localStorage.getItem(
                "perfume_shop_checkout"
            )
        );

    if (!checkoutData) {

        alert(
            "Checkout information not found."
        );

        return;
    }

    if (!currentUser) {

        alert(
            "Please login first."
        );

        openLogin();

        return;
    }

    try {

        const response =
            await fetch(
                "/api/orders/cod",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            cart:
                                checkoutData.items,

                            userId:
                                currentUser.id

                        })
                }
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Unable to place COD order."
            );

            return;
        }

        removeSelectedItems();

        localStorage.removeItem(
            "perfume_shop_checkout"
        );

        alert(
            "Order placed successfully!"
        );

        await loadOrders();

        displayCart();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }
}


// =========================
// REMOVE SELECTED
// =========================

function removeSelectedItems() {

    cart =
        cart.filter(
            item => !item.selected
        );

    saveCart();
}


// =========================
// LOGIN
// =========================

function openLogin() {

    closeSignup();

    document.getElementById(
        "loginModal"
    ).style.display = "flex";
}


function closeLogin() {

    document.getElementById(
        "loginModal"
    ).style.display = "none";
}


function switchToSignup() {

    closeLogin();

    openSignup();
}


async function login() {

    const email =
        document.getElementById(
            "loginEmail"
        ).value.trim();

    const password =
        document.getElementById(
            "loginPassword"
        ).value;

    if (!email || !password) {

        alert(
            "Please enter email and password."
        );

        return;
    }

    try {

        const response =
            await fetch(
                "/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            email,
                            password
                        })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Login failed."
            );

            return;
        }

        currentUser =
            data.user;

        localStorage.setItem(
            "perfume_shop_user",
            JSON.stringify(
                currentUser
            )
        );

        closeLogin();

        updateAccountUI();

        await loadOrders();

        alert(
            "Login successful!"
        );

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );
    }
}


// =========================
// SIGN UP
// =========================

function openSignup() {

    closeLogin();

    document.getElementById(
        "signupModal"
    ).style.display = "flex";
}


function closeSignup() {

    document.getElementById(
        "signupModal"
    ).style.display = "none";
}


function switchToLogin() {

    closeSignup();

    openLogin();
}


async function signup() {

    const name =
        document.getElementById(
            "signupName"
        ).value.trim();

    const email =
        document.getElementById(
            "signupEmail"
        ).value.trim();

    const password =
        document.getElementById(
            "signupPassword"
        ).value;

    if (!name || !email || !password) {

        alert(
            "Please complete all fields."
        );

        return;
    }

    try {

        const response =
            await fetch(
                "/api/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            name,
                            email,
                            password
                        })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Registration failed."
            );

            return;
        }

        alert(
            "Account created successfully!"
        );

        document.getElementById(
            "signupName"
        ).value = "";

        document.getElementById(
            "signupEmail"
        ).value = "";

        document.getElementById(
            "signupPassword"
        ).value = "";

        closeSignup();

        openLogin();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );
    }
}


// =========================
// LOGOUT
// =========================

function logout() {

    currentUser = null;

    localStorage.removeItem(
        "perfume_shop_user"
    );

    updateAccountUI();

    document.getElementById(
        "orderList"
    ).innerHTML =
        "<p>Please login to view your orders.</p>";
}


// =========================
// ACCOUNT UI
// =========================

function updateAccountUI() {

    const loginBtn =
        document.getElementById(
            "loginBtn"
        );

    const signupBtn =
        document.getElementById(
            "signupBtn"
        );

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );

    const greeting =
        document.getElementById(
            "userGreeting"
        );

    if (currentUser) {

        loginBtn.style.display =
            "none";

        signupBtn.style.display =
            "none";

        logoutBtn.style.display =
            "inline-block";

        greeting.textContent =
            "Hi, " +
            currentUser.name;

    } else {

        loginBtn.style.display =
            "inline-block";

        signupBtn.style.display =
            "inline-block";

        logoutBtn.style.display =
            "none";

        greeting.textContent = "";
    }
}


// =========================
// ORDERS
// =========================

async function loadOrders() {

    const orderList =
        document.getElementById(
            "orderList"
        );

    if (!currentUser) {

        orderList.innerHTML =
            "<p>Please login to view your orders.</p>";

        return;
    }

    try {

        const response =
            await fetch(
                "/api/orders/user/" +
                currentUser.id
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {

            orderList.innerHTML =
                "<p>Unable to load orders.</p>";

            return;
        }

        displayOrders(
            data.orders || []
        );

    } catch (error) {

        console.error(error);

        orderList.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}


function displayOrders(orders) {

    const orderList =
        document.getElementById(
            "orderList"
        );

    if (!orders || orders.length === 0) {

        orderList.innerHTML =
            "<p>No orders yet.</p>";

        return;
    }

    orderList.innerHTML = "";

    orders.forEach(function(order) {

        const card =
            document.createElement("div");

        card.className =
            "order-card";

        let itemsHTML = "";

        (order.items || []).forEach(
            function(item) {

                itemsHTML += `

                    <div class="order-product">

                        <span>
                            ${item.product_name}
                            × ${item.quantity}
                        </span>

                        <strong>
                            ₱${Number(
                                item.subtotal
                            ).toFixed(2)}
                        </strong>

                    </div>

                `;
            }
        );

        card.innerHTML = `

            <div class="order-header">

                <span class="order-number">
                    Order #${order.order_number}
                </span>

                <span class="order-status">
                    ${order.order_status}
                </span>

            </div>

            ${itemsHTML}

            <p>
                Payment:
                ${order.payment_method}
            </p>

            <p>
                Payment Status:
                <span class="payment-status">
                    ${order.payment_status}
                </span>
            </p>

            <div class="order-total">

                Total:
                ₱${Number(
                    order.total
                ).toFixed(2)}

            </div>

        `;

        orderList.appendChild(card);
    });
}


// =========================
// SHOW PRODUCTS
// =========================

function showProducts() {

    const section =
        document.getElementById(
            "products"
        );

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// =========================
// SUCCESS PAYMENT
// =========================

async function finishSuccessfulPayment() {

    const pending =
        JSON.parse(
            localStorage.getItem(
                "perfume_shop_pending_order"
            )
        );

    if (!pending) {

        alert(
            "Payment information not found."
        );

        return;
    }

    try {

        const response =
            await fetch(
                "/api/orders/confirm-payment",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            orderNumber:
                                pending.orderNumber,

                            checkoutId:
                                pending.checkoutId
                        })
                }
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Payment could not be confirmed."
            );

            return;
        }

        removeSelectedItems();

        localStorage.removeItem(
            "perfume_shop_checkout"
        );

        localStorage.removeItem(
            "perfume_shop_pending_order"
        );

        alert(
            "Payment successful! Your order is now PAID."
        );

        window.location.href =
            "index.html#orders";

    } catch (error) {

        console.error(error);

        alert(
            "Unable to confirm payment."
        );
    }
}


// =========================
// PAGE START
// =========================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        displayProducts();

        displayCart();

        updateAccountUI();

        if (currentUser) {

            await loadOrders();
        }

        const params =
            new URLSearchParams(
                window.location.search
            );

        const paymentResult =
            params.get("payment");

        if (
            paymentResult ===
            "success"
        ) {

            await finishSuccessfulPayment();
        }

    }
);
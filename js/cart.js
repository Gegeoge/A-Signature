function getBag() {
    return JSON.parse(localStorage.getItem("bag")) || [];
}

function saveBag(bag) {
    localStorage.setItem("bag", JSON.stringify(bag));
}

function updateBagCount() {
    const bag = getBag();
    const bagCount = document.getElementById("bagCount");

    if (bagCount) {
        const totalItems = bag.reduce((sum, item) => sum + item.quantity, 0);
        bagCount.textContent = totalItems;
    }
}

function addToBag(productId, quantity = 1) {
    const bag = getBag();
    const existingItem = bag.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        bag.push({ id: productId, quantity });
    }

    saveBag(bag);
    updateBagCount();
    alert("Added to bag.");
}

function removeFromBag(productId) {
    const bag = getBag().filter(item => item.id !== productId);
    saveBag(bag);
    renderBag();
    updateBagCount();
}

function changeQuantity(productId, change) {
    const bag = getBag();
    const item = bag.find(item => item.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromBag(productId);
        return;
    }

    saveBag(bag);
    renderBag();
    updateBagCount();
}

function clearBag() {
    localStorage.removeItem("bag");
    renderBag();
    updateBagCount();
}

function renderBag() {
    const bagItems = document.getElementById("bagItems");
    const bagSummary = document.getElementById("bagSummary");

    if (!bagItems || !bagSummary) return;

    const bag = getBag();

    if (bag.length === 0) {
        bagItems.innerHTML = `
            <div class="empty-bag">
                <h2>Your bag is empty.</h2>
                <p>Discover pieces designed to become part of your story.</p>
                <a href="gold.html">Shop Gold</a>
                <a href="silver.html">Shop Silver</a>
            </div>
        `;

        bagSummary.innerHTML = "";
        return;
    }

    let subtotal = 0;

    bagItems.innerHTML = bag.map(item => {
        const product = products.find(product => product.id === item.id);

        if (!product) return "";

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        return `
            <div class="bag-item">
                <img src="${product.image}" alt="${product.name}">

                <div class="bag-item-info">
                    <h3>${product.name}</h3>
                    <p>${product.material ? product.material[0] : ""}</p>
                    <p>$${product.price}</p>

                    <div class="bag-quantity">
                        <button onclick="changeQuantity(${product.id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, 1)">+</button>
                    </div>

                    <p class="item-total">Item total: $${itemTotal}</p>

                    <button class="remove-button" onclick="removeFromBag(${product.id})">
                        Remove
                    </button>
                </div>
            </div>
        `;
    }).join("");

    bagSummary.innerHTML = `
        <div class="bag-summary">
            <h2>Order Summary</h2>

            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal}</span>
            </div>

            <div class="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
            </div>

            <div class="summary-row">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
            </div>

            <div class="summary-total">
                <span>Total today</span>
                <span>$${subtotal}</span>
            </div>

            <button class="checkout-button" onclick="startCheckout()">Checkout</button>

            <button class="clear-bag-button" onclick="clearBag()">Clear Bag</button>

            <p class="secure-note">
                Secure checkout powered by Stripe.
            </p>

            <a href="gold.html" class="continue-shopping-link">Continue Shopping</a>
        </div>
    `;
}

renderBag();
updateBagCount();
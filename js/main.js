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

/* COLLECTION PAGES */
const productGrid = document.getElementById("productGrid");

if (productGrid) {
    const pageTitle = document.title.toLowerCase();
    let currentCollection = "";

    if (pageTitle.includes("gold")) currentCollection = "gold";
    if (pageTitle.includes("silver")) currentCollection = "silver";

    const collectionProducts = products.filter(product => product.collection === currentCollection);

    function renderProducts(productList) {
        productGrid.innerHTML = productList.map(product => `
            <div class="shop-card">
                <a href="product.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="shop-image">
                </a>

                <a href="product.html?id=${product.id}" class="product-link">
                    <h3>${product.name}</h3>
                </a>

                <p>$${product.price}</p>

                <button onclick="addToBag(${product.id})">Add to Bag</button>

                <a href="product.html?id=${product.id}" class="view-button">View Piece</a>
            </div>
        `).join("");
    }

    renderProducts(collectionProducts);

    document.querySelectorAll(".filters a").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const selectedCategory = this.dataset.category;

            document.querySelectorAll(".filters a").forEach(item => {
                item.classList.remove("active-filter");
            });

            this.classList.add("active-filter");

            if (selectedCategory === "all") {
                renderProducts(collectionProducts);
            } else {
                const filteredProducts = collectionProducts.filter(product => product.type === selectedCategory);
                renderProducts(filteredProducts);
            }
        });
    });
}

/* PRODUCT PAGE */
const productPage = document.getElementById("productPage");

if (productPage) {
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));
    const product = products.find(item => item.id === productId);

    if (product) {
        const materialOptions = product.material
            ? product.material.map(item => `<option>${item}</option>`).join("")
            : `<option>Standard finish</option>`;

        const lengthOptions = product.lengths
            ? product.lengths.map(item => `<option>${item}</option>`).join("")
            : `<option>One size</option>`;

        productPage.innerHTML = `
            <div class="product-detail">
                <img src="${product.image}" alt="${product.name}">

                <div class="product-info">
                    <p class="section-label">${product.collection} collection</p>
                    <h1>${product.name}</h1>
                    <p class="product-price">From $${product.price}</p>
                    <p class="product-description">${product.description}</p>

                    <div class="product-options">
                        <div class="option-group">
                            <label>Material</label>
                            <select>${materialOptions}</select>
                        </div>

                        <div class="option-group">
                            <label>Size / Length</label>
                            <select>${lengthOptions}</select>
                        </div>
                    </div>

                    <div class="product-meta">
                        <p><strong>Finish</strong><br>${product.finish || "Details coming soon"}</p>
                        <p><strong>Width</strong><br>${product.width || "Details coming soon"}</p>
                        <p><strong>Approximate Weight</strong><br>${product.weight || "Details coming soon"}</p>
                        <p><strong>Shipping</strong><br>${product.shipping || "Ships within 3–5 business days"}</p>
                        <p><strong>Packaging</strong><br>${product.packaging || "Presented in A.Signature packaging."}</p>
                    </div>

                    <div class="quantity-row">
                        <label>Quantity</label>
                        <input id="quantityInput" type="number" value="1" min="1">
                    </div>

                    <button
                        class="add-bag"
                        onclick="addToBag(${product.id}, Number(document.getElementById('quantityInput').value))">
                        Add to Bag
                    </button>
                </div>
            </div>
        `;
    }
}

/* BAG PAGE */
const bagItems = document.getElementById("bagItems");
const bagSummary = document.getElementById("bagSummary");

function renderBag() {
    if (!bagItems || !bagSummary) return;

    const bag = getBag();

    if (bag.length === 0) {
        bagItems.innerHTML = `<p>Your bag is empty.</p>`;
        bagSummary.innerHTML = "";
        return;
    }

    let total = 0;

    bagItems.innerHTML = bag.map(item => {
        const product = products.find(product => product.id === item.id);
        if (!product) return "";

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        return `
            <div class="bag-item">
                <img src="${product.image}" alt="${product.name}">

                <div>
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>

                    <div class="bag-quantity">
                        <button onclick="changeQuantity(${product.id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, 1)">+</button>
                    </div>

                    <p>Total: $${itemTotal}</p>

                    <button class="remove-button" onclick="removeFromBag(${product.id})">
                        Remove
                    </button>
                </div>
            </div>
        `;
    }).join("");

    bagSummary.innerHTML = `
        <div class="bag-summary">
            <h2>Subtotal: $${total}</h2>
            <button>Checkout Coming Soon</button>
        </div>
    `;
}

renderBag();
updateBagCount();
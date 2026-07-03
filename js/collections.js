const productGrid = document.getElementById("productGrid");

if (productGrid) {
    const pageTitle = document.title.toLowerCase();

    let currentCollection = "";

    if (pageTitle.includes("gold")) {
        currentCollection = "gold";
    }

    if (pageTitle.includes("silver")) {
        currentCollection = "silver";
    }

    const collectionProducts = products.filter(product => {
        return product.collection === currentCollection;
    });

    function renderProducts(productList) {
        productGrid.innerHTML = productList.map(product => {
            return `
                <div class="shop-card">
                    <a href="product.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}" class="shop-image">
                    </a>

                    <a href="product.html?id=${product.id}" class="product-link">
                        <h3>${product.name}</h3>
                    </a>

                    <p class="product-material">${product.material ? product.material[0] : ""}</p>

                    <p class="product-card-price">From $${product.price}</p>

                    <button onclick="addToBag(${product.id})">Add to Bag</button>

                    <a href="product.html?id=${product.id}" class="view-button">View Piece</a>
                </div>
            `;
        }).join("");
    }

    renderProducts(collectionProducts);

    const filterLinks = document.querySelectorAll(".filters a");

    filterLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const selectedCategory = this.dataset.category;

            filterLinks.forEach(item => item.classList.remove("active-filter"));
            this.classList.add("active-filter");

            if (selectedCategory === "all") {
                renderProducts(collectionProducts);
            } else {
                const filteredProducts = collectionProducts.filter(product => {
                    return product.type === selectedCategory;
                });

                renderProducts(filteredProducts);
            }
        });
    });
}
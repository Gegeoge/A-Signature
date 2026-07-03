const featuredGrid = document.getElementById("featuredGrid");

if (featuredGrid) {
    const featuredIds = [1, 3, 5];

    const featuredProducts = products.filter(product =>
        featuredIds.includes(product.id)
    );

    featuredGrid.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="featured-image">
            </a>

            <a href="product.html?id=${product.id}" class="product-link">
                <h3>${product.name}</h3>
            </a>

            <p>${product.material ? product.material[0] : ""}</p>
            <p class="product-card-price">From $${product.price}</p>
        </div>
    `).join("");
}
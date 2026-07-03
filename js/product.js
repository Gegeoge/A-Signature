const productPage = document.getElementById("productPage");
const relatedGrid = document.getElementById("relatedGrid");

if (productPage) {
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));
    const product = products.find(item => item.id === productId);

    if (!product) {
        productPage.innerHTML = `<h2>Product not found.</h2>`;
    } else {
        productPage.innerHTML = `
            <div class="product-detail">

                <div class="product-gallery">
                    <img
                        id="mainImage"
                        src="${product.images[0]}"
                        alt="${product.name}"
                        class="main-image"
                    >

                    <div class="thumbnail-row">
                        ${product.images.map(image => `
                            <img
                                src="${image}"
                                alt="${product.name}"
                                class="thumbnail"
                                onclick="document.getElementById('mainImage').src='${image}'"
                            >
                        `).join("")}
                    </div>
                </div>

                <div class="product-information">
                    <p class="section-label">${product.collection} collection</p>

                    <h1>${product.name}</h1>

                    <p class="product-price">From $${product.price}</p>

                    <p class="product-description">${product.description}</p>

                    <div class="product-options">
                        <div>
                            <label>Material</label>
                            <div class="option-buttons">
                                ${product.material.map(material => `
                                    <button class="option-button">${material}</button>
                                `).join("")}
                            </div>
                        </div>

                        <div>
                            <label>Length / Size</label>
                            <div class="option-buttons">
                                ${product.lengths.map(length => `
                                    <button class="option-button">${length}</button>
                                `).join("")}
                            </div>
                        </div>
                    </div>

                    <div class="product-specs">
                        <div>
                            <h4>Finish</h4>
                            <p>${product.finish || "Details coming soon"}</p>
                        </div>

                        <div>
                            <h4>Width</h4>
                            <p>${product.width || "Details coming soon"}</p>
                        </div>

                        <div>
                            <h4>Weight</h4>
                            <p>${product.weight || "Details coming soon"}</p>
                        </div>

                        <div>
                            <h4>Shipping</h4>
                            <p>${product.shipping}</p>
                        </div>
                    </div>

                    <div class="product-care">
                        <h3>Packaging & Care</h3>
                        <p>${product.packaging}</p>
                        <p>Store your jewelry dry and polish gently with a soft cloth.</p>
                    </div>

                    <button class="add-bag" onclick="addToBag(${product.id})">
                        Add To Bag
                    </button>
                </div>

            </div>
        `;

        const relatedProducts = products
            .filter(item => item.collection === product.collection && item.id !== product.id)
            .slice(0, 3);

        relatedGrid.innerHTML = relatedProducts.map(item => `
            <div class="product-card">
                <a href="product.html?id=${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="featured-image">
                </a>

                <a href="product.html?id=${item.id}" class="product-link">
                    <h3>${item.name}</h3>
                </a>

                <p>${item.material ? item.material[0] : ""}</p>
                <p class="product-card-price">From $${item.price}</p>
            </div>
        `).join("");
    }
}
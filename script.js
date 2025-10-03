const MOCK_PRODUCTS = [
    { id: 1, name: "Fresh Milk (1L)", price: 62, originalPrice: 65, unit: "1 L", image: "images/milk.jpg", category: "Dairy Products", time: "10 min" },
    { id: 2, name: "Onion (pyaz)", price: 35, originalPrice: 40, unit: "1 kg", image: "images/onion.jpg", category: "Vegetables", time: "12 min" },
    { id: 3, name: "Potato (aloo)", price: 30, originalPrice: null, unit: "1 kg", image: "images/patato.jpg", category: "Vegetables", time: "10 min" },
    { id: 4, name: "Brown Bread", price: 45, originalPrice: 50, unit: "400 g", image: "images/bread.avif", category: "Breakfast", time: "15 min" },
    { id: 5, name: "Dishwash Gel", price: 140, originalPrice: 180, unit: "1 L", image: "images/diashwash.jpg", category: "Cleaning Essentials", time: "11 min" },
    { id: 6, name: "Apple - imported", price: 120, originalPrice: 190, unit: "1 kg", image: "images/apple.avif", category: "Fruits", time: "13 min" },
    { id: 7, name: "Lays - Spicy Flavor", price: 18, originalPrice: 20, unit: "100 g", image: "images/chips.avif", category: "Snacks", time: "10 min" },
    { id: 8, name: "Orange Juice", price: 90, originalPrice: 99, unit: "1 L", image: "images/orange.jpg", category: "Cold Drink & Juics", time: "14 min" },
    { id: 9, name: "Panner - 200g ", price: 85, originalPrice: 100, unit: "200g", image: "images/paneer.jpg", category: "Dairy Products", time: "10 min" },
    { id: 10, name: "Tomato Ketchup", price: 119, originalPrice: 149, unit: "750 g", image: "images/ket.jpg", category: "Masala", time: "10 min" },
    { id: 11, name: "Shampoo - Herbal", price: 189, originalPrice: 205, unit: "200 ml", image: "images/shampoo.avif", category: "Personal care", time: "12 min" },
    { id: 12, name: "Oreo - Silk", price: 195, originalPrice: 220, unit: "124 g", image: "images/silk.avif", category: "Sweets", time: "10 min" },
    { id: 13, name: "Banana", price: 50, originalPrice: 65, unit: "1 dozen", image: "images/banana.avif", category: "Fruits", time: "15 min" },
    { id: 14, name: "Cucumber - Fresh", price: 30, originalPrice: 35, unit: "1 kg", image: "images/cuc.avif", category: "Vegetables", time: "10 min" },
    { id: 15, name: "Maggi Instant Noodles", price: 46, originalPrice: 55, unit: "70.5 g", image: "images/instant.avif", category: "Breakfast", time: "8 min" },
    { id: 16, name: "Coca-Cola Soft Drink (300 ml)", price: 38, originalPrice: 40, unit: "300ml", image: "images/coca.jpg", category: "Cold Drink & Juics", time: "10 min" },
];

const MOCK_CATEGORIES = [
    { name: "Dairy Products", image: "images/dairy.jpg" },
    { name: "Fruits", image: "images/fruits.jpg" },
    { name: "Vegetables", image: "images/vegetables.jpg" },
    { name: "Snacks", image: "images/snacks.jpg" },
    { name: "Masala", image: "images/masala.jpg" },
    { name: "Personal care", image: "images/pc.jpg" },
    { name: "Cold Drink & Juics", image: "images/cold.jpg" },
    { name: "Breakfast", image: "images/break.jpg" },
    { name: "Sweets", image: "images/sweets.jpg" },
];

// Global state variables
let cart = [];

// DOM element references
let $categoryLinks, $productGrid, $listingTitle, $cartItemCount, $productSearch, $cartModal, $cartItemsList, $cartTotal, $loginModal;


// --- Cart Management Functions ---

// Adds a product to the cart array and updates the count.
function addToCart(productId) {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        showTemporaryMessage(`1 ${product.name} added to cart!`);
    }
}

// Removes the first matching instance of a product from the cart and refreshes the modal.
function removeFromCart(productId) {
    const index = cart.findIndex(p => p.id === productId);
    if (index > -1) {
        const product = cart[index];
        cart.splice(index, 1);
        updateCartCount();
        openCartModal(); // Re-render the cart modal content
        showTemporaryMessage(`${product.name} removed from cart.`, '#ef4444');
    }
}

// Updates the cart item count displayed in the header.
function updateCartCount() {
    if ($cartItemCount) {
        $cartItemCount.textContent = cart.length;
    }
}

// Opens and populates the cart modal with current cart items, grouping duplicates.
function openCartModal() {
    if (!$cartModal || !$cartItemsList || !$cartTotal) return;

    let total = 0;

    // Group items by ID and count them
    const itemCounts = cart.reduce((acc, item) => {
        const key = item.id;
        // If not seen, create a new object with the item details and count 0
        acc[key] = acc[key] || { ...item, count: 0 };
        // Increment the count for the item
        acc[key].count++;
        // Calculate total price based on individual items
        total += item.price;
        return acc;
    }, {});

    // Generate HTML for each unique item in the cart
    const cartItemsHtml = Object.values(itemCounts).map(item => {
        const itemTotal = item.price * item.count;
        return `
            <div class="cart-item-row">
                <div class="item-details-group">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null;this.src='https://placehold.co/50x50/cccccc/333?text=N/A';">
                    <div class="item-name-price">
                        <h4 class="font-medium text-gray-800">${item.name}</h4>
                        <p class="text-sm text-gray-500">₹${item.price} x ${item.count} (${item.unit})</p>
                    </div>
                </div>
                <div class="item-actions-group">
                    <span class="font-bold text-lg text-gray-800">₹${itemTotal}</span>
                    <button onclick="removeFromCart(${item.id})" class="remove-btn">
                        Remove
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Update modal content based on cart status
    if (cart.length === 0) {
        $cartItemsList.innerHTML = '<p class="text-center py-5 text-gray-500">Your cart is empty. Start adding some products! 🛒</p>';
        $cartTotal.querySelector('span:last-child').textContent = '₹0';
    } else {
        $cartItemsList.innerHTML = cartItemsHtml;
        $cartTotal.querySelector('span:last-child').textContent = `₹${total}`;
    }

    // Display the modal and prevent background scrolling
    $cartModal.style.display = 'flex';
    document.body.classList.add('modal-open');
}


// --- Modal Utility Functions ---

// Closes the specified modal.
function closeModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// Opens the login modal.
function openLoginModal() {
    if (!$loginModal) return;
    $loginModal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

// Displays a temporary, transient message at the bottom of the screen.
function showTemporaryMessage(message, bgColor = 'var(--primary-green)') {
    let tempEl = document.getElementById('tempMessage');
    // Create the message element if it doesn't exist
    if (!tempEl) {
        tempEl = document.createElement('div');
        tempEl.id = 'tempMessage';
        // Tailwind classes for positioning and styling
        tempEl.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 text-white px-4 py-2 rounded-lg shadow-xl opacity-0 transition-opacity duration-300 transform-gpu z-50';
        document.body.appendChild(tempEl);
    }
    tempEl.textContent = message;
    tempEl.style.backgroundColor = bgColor;
    // Show the message
    tempEl.classList.remove('opacity-0', 'hidden');
    tempEl.classList.add('opacity-100');

    // Hide the message after 2 seconds
    setTimeout(() => {
        tempEl.classList.remove('opacity-100');
        tempEl.classList.add('opacity-0');
    }, 2000);
}


// --- Navigation and Rendering Functions ---

// Handles navigation: 'home' for all products, 'category-' for filtered products.
function navigate(view) {
    if (view === 'home') {
        renderProductListing(MOCK_PRODUCTS, 'Popular Products');
    } else if (view.startsWith('category-')) {
        const category = view.replace('category-', '');
        // Filter products by the selected category
        const filteredProducts = MOCK_PRODUCTS.filter(p => p.category === category);
        renderProductListing(filteredProducts, `Shop ${category}`);
    }
    // Clear search bar on navigation
    if ($productSearch) {
        $productSearch.value = '';
    }
    // Ensure modals are closed on navigation
    closeModal($cartModal);
    closeModal($loginModal);
}

// Generates the HTML string for a single product card.
function renderProductCard(product) {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

    // Original price element only if a discount exists
    const originalPriceHtml = hasDiscount
        ? `<span class="original-price">₹${product.originalPrice}</span>`
        : '';

    const priceBoxHtml = `
        <div class="price-box">
            <span class="price">₹${product.price}</span>
            ${originalPriceHtml}
        </div>
    `;

    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/200x200/cccccc/333?text=N/A';">

            <div class="flex items-center text-xs text-gray-500 mb-1" style="display: flex; align-items: center; gap: 4px; margin-bottom: 5px;">
                <span style="font-size: 1.2em; color: var(--primary-green);">&bull;</span>
                <span style="font-weight: 500;">${product.time}</span>
            </div>

            <h3>${product.name}</h3>
            <p class="text-sm text-gray-500 mb-2">${product.unit}</p>

            <div class="price-info">
                ${priceBoxHtml}
                <button onclick="addToCart(${product.id})" class="add-btn">
                    ADD
                </button>
            </div>
        </div>
    `;
}

// Renders a list of products to the grid and updates the listing title.
function renderProductListing(products, title) {
    if (!$listingTitle || !$productGrid) return;

    $listingTitle.textContent = title;

    if (products.length === 0) {
        $productGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; padding: 30px; background: white; border-radius: 8px;">No products found matching your criteria.</p>`;
        return;
    }

    // Map the product array to HTML cards and join them
    $productGrid.innerHTML = products.map(renderProductCard).join('');
}

// Renders the interactive category links in the sidebar.
function renderCategoryLinks() {
    if (!$categoryLinks) return;

    $categoryLinks.innerHTML = MOCK_CATEGORIES.map(cat => `
        <div class="category-item" onclick="navigate('category-${cat.name}')">
            <img src="${cat.image}" alt="${cat.name}" onerror="this.onerror=null;this.src='https://placehold.co/80x80/cccccc/333?text=N/A';">
            <p>${cat.name}</p>
        </div>
    `).join('');
}

// Filters products based on the search input value and renders the result.
function handleSearch() {
    if (!$productSearch) return;

    const query = $productSearch.value.toLowerCase().trim();

    if (query === "") {
        // If search is empty, display all products (home view)
        renderProductListing(MOCK_PRODUCTS, 'Popular Products');
        return;
    }

    // Filter by name or category match
    const filteredProducts = MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );

    renderProductListing(filteredProducts, `Search Results for "${query}"`);
}


// --- Initialization ---

// Initialises DOM element references for global use.
function initializeSelectors() {
    $categoryLinks = document.getElementById('categoryLinks');
    $productGrid = document.getElementById('productGrid');
    $listingTitle = document.getElementById('listingTitle');
    $cartItemCount = document.getElementById('cartItemCount');
    $productSearch = document.getElementById('productSearch');
    $cartModal = document.getElementById('cartModal');
    $cartItemsList = document.getElementById('cartItemsList');
    $cartTotal = document.getElementById('cartTotal');
    $loginModal = document.getElementById('loginModal'); // New selector for login modal
}


// Runs on page load to set up the application state and event listeners.
window.onload = function() {
    initializeSelectors();

    renderCategoryLinks();
    // Load default product listing (all products)
    renderProductListing(MOCK_PRODUCTS, 'Popular Products');
    updateCartCount();

    // Attach search event listener
    if ($productSearch) {
        $productSearch.addEventListener('input', handleSearch);
    }

    // Attach cart link click handler to open the modal
    const cartLink = document.getElementById('cartLink');
    if(cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    }

    // Attach login link click handler to open the login modal
    const loginLink = document.getElementById('loginLink');
    if(loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            openLoginModal();
        });
    }

    // Attach modal close buttons handlers
    const cartModalCloseButton = document.getElementById('cartModalCloseButton');
    if(cartModalCloseButton) {
        cartModalCloseButton.addEventListener('click', () => closeModal($cartModal));
    }

    const loginModalCloseButton = document.getElementById('loginModalCloseButton');
    if(loginModalCloseButton) {
        loginModalCloseButton.addEventListener('click', () => closeModal($loginModal));
    }
};

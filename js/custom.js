document.addEventListener('DOMContentLoaded', function () {
  const typeFilter = document.getElementById('type-filter');
  const featuredContainer = document.getElementById('featured-products');
  const allProductsContainer = document.getElementById('all-products');

  if (!featuredContainer) {
      console.warn("A #featured-products elem nem található az oldalon.");
  }
  if (!allProductsContainer) {
      console.warn("A #all-products elem nem található az oldalon.");
  }

  // Termékek betöltése JSON-ból
  fetch('./products.json')
      .then(response => {
          if (!response.ok) {
              throw new Error(`Hálózati hiba: ${response.status}`);
          }
          return response.json();
      })
      .then(products => {
          if (featuredContainer) renderFeaturedProducts(products);
          if (allProductsContainer) renderProducts(products);

          // Szűrő eseményfigyelő
          if (typeFilter) {
              typeFilter.addEventListener('change', function () {
                  const selectedType = this.value;
                  const filteredProducts = selectedType === 'all' 
                      ? products 
                      : products.filter(product => product.type === selectedType);
                  if (allProductsContainer) renderProducts(filteredProducts);
              });
          }
      })
      .catch(error => console.error('Hiba a termékek betöltésekor:', error));

  // Kiemelt termékek megjelenítése
  function renderFeaturedProducts(products) {
      featuredContainer.innerHTML = '';
      products.filter(product => product.featured).forEach(product => {
          const card = `
              <div class="col-md-4 product-card">
                  <div class="card" onclick="viewProduct(${product.id})">
                      <div class="card-body">
                          <h5 class="card-title">${product.name}</h5>
                          <img src="${product.image}" class="card-img-top" alt="${product.name}">
                          <p class="card-text">${product.description.substring(0, 100)}...</p>
                          <button class="btn btn-primary">Olvass tovább</button>
                      </div>
                  </div>
              </div>`;
          featuredContainer.innerHTML += card;
      });
  }

  // Teljes terméklista megjelenítése
  function renderProducts(products) {
      allProductsContainer.innerHTML = '';
      products.forEach(product => {
          if (!product.visible) return;
          const card = `
              <div class="col-md-4 product-card">
                  <div class="card" onclick="viewProduct(${product.id})">
                      <div class="card-body">
                          <h5 class="card-title">${product.name}</h5>
                          <img src="${product.image}" class="card-img-top" alt="${product.name}">
                          <p class="card-text">${product.description.substring(0, 100)}...</p>
                          <button class="btn btn-primary">Olvass tovább</button>
                      </div>
                  </div>
              </div>`;
          allProductsContainer.innerHTML += card;
      });
  }
});



  function viewProduct(productId) {
    fetch('products.json')
      .then(response => response.json())
      .then(products => {
        const product = products.find(p => p.id === productId);
        if (product) {
          // Töltsd be a modal tartalmát dinamikusan
          document.getElementById('modal-title').innerText = product.name;
          document.getElementById('modal-image').src = product.image;
          document.getElementById('modal-description').innerText = product.description;
  
          // Ízek betöltése
          const flavorsList = document.getElementById('modal-flavors');
          flavorsList.innerHTML = product.flavors
            ? product.flavors.map(flavor => `<li>${flavor}</li>`).join('')
            : '<li>Nincs információ</li>';
  
          // Kiszerelés betöltése
          const packagingList = document.getElementById('modal-packaging');
          packagingList.innerHTML = product.packaging
            ? product.packaging.map(size => `<li>${size}</li>`).join('')
            : '<li>Nincs információ</li>';
  
          // Adagolás betöltése
          const dosageElement = document.getElementById('modal-dosage');
          dosageElement.innerText = product.dosage || 'Nincs információ';
  
          // Modal megjelenítése
          new bootstrap.Modal(document.getElementById('productModal')).show();
        } else {
          console.error('Nem található a termék az adott azonosítóval:', productId);
        }
      })
      .catch(error => console.error('Hiba a termék részleteinek betöltésekor:', error));
  }
  

const scrollArrow = document.getElementById('scroll-arrow');
let isAtBottom = false; // Jelöli, hogy az oldal legalján vagyunk-e

scrollArrow.addEventListener('click', () => {
  if (isAtBottom) {
    // Ha az oldal legalján vagyunk, visszagörgetünk a tetejére
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Az összes szekciót lekérjük
  const sections = document.querySelectorAll('section');
  const currentScroll = window.scrollY + 1; // Kisebb offset elkerülése miatt hozzáadunk 1-et

  // Keressük meg az első szekciót, amely a jelenlegi pozíció után van
  let foundNextSection = false;
  for (let i = 0; i < sections.length; i++) {
    const sectionTop = sections[i].offsetTop;
    if (sectionTop > currentScroll) {
      sections[i].scrollIntoView({ behavior: 'smooth' });
      foundNextSection = true;
      break;
    }
  }

  // Ha nincs több szekció, görgess az oldal aljára
  if (!foundNextSection) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});

// Görgetési esemény figyelése
window.addEventListener('scroll', () => {
  // Ellenőrizzük, hogy az oldal legaljára értünk-e
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
    scrollArrow.textContent = '↑'; // Nyíl felfelé
    isAtBottom = true;
  } else {
    scrollArrow.textContent = '↓'; // Nyíl lefelé
    isAtBottom = false;
  }
});


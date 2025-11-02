// Mana Pottery — centralized product data and rendering (clean LG-enabled version)
const products = [
  { 
    id: 1, 
    name: 'Biryani Pot', 
    description: 'Traditional terracotta biryani pot designed for slow-cooking rich and flavorful biryanis. Retains natural aroma and moisture.', 
    category: 'Kitchen', 
    price: 299, 
    img: 'images/biryani-pot.jpg' 
  },
  { 
    id: 2, 
    name: 'Rice Pot', 
    description: 'Classic clay rice pot that keeps your rice warm and fluffy for hours. Perfect for everyday use and festive meals.', 
    category: 'Kitchen', 
    price: 249, 
    img: 'images/rice-pot.jpg' 
  },
  { 
    id: 3, 
    name: 'Fish Curry Pot', 
    description: 'Handcrafted earthen pot ideal for preparing coastal-style fish curries. Enhances flavor with even heat distribution.', 
    category: 'Kitchen', 
    price: 249, 
    img: 'images/fish-curry-pot.jpg' 
  },
  { 
    id: 4, 
    name: 'Coffee Cups (Set of 3)', 
    description: 'Elegant handmade terracotta coffee cup set. Keeps beverages warm and adds rustic charm to your table.', 
    category: 'Kitchen', 
    price: 99, 
    img: 'images/coffee-cups.jpg' 
  },
  { 
    id: 5, 
    name: 'Curd and Milk Pots', 
    description: 'Eco-friendly clay cups perfect for serving curd, milk, or desserts. Naturally cool and chemical-free.', 
    category: 'Kitchen', 
    price: 99, 
    img: 'images/curd-milk-cups.jpg' 
  },
  { 
    id: 6, 
    name: 'Curry Pots', 
    description: 'Set of small terracotta curry cups ideal for serving traditional dishes or chutneys. Earthy and elegant.', 
    category: 'Kitchen', 
    price: 149, 
    img: 'images/curry-cups.jpg' 
  },
  { 
    id: 7, 
    name: 'Water Bottle', 
    description: 'Natural clay water bottles that keep your water cool, fresh, and naturally enriched with minerals.', 
    category: 'Everyday Use', 
    price: 99, 
    img: 'images/water-bottle.jpg' 
  },
  { 
    id: 8, 
    name: 'Terracotta Bells', 
    description: 'Beautifully handcrafted terracotta bells with soothing sound, perfect for home décor or garden spaces.', 
    category: 'Decorative', 
    price: 199, 
    img: 'images/terracotta-bells.jpg' 
  },
  { 
    id: 9, 
    name: 'Thulasi Pot', 
    description: 'Sacred clay Thulasi pot handcrafted for spiritual and aesthetic beauty. Symbol of purity in every Indian home.', 
    category: 'Decorative', 
    price: 249, 
    img: 'images/thulasi-pot.jpg' 
  }
];

function createCard(p){
  const el = document.createElement('div');
  el.className = 'product-card';
  el.innerHTML = `
    <div class="img-wrap"><img src="${p.img}" alt="${p.name}"></div>
    <div class="card-body">
      <h4>${p.name}</h4>
      <div class="short-spec">${p.category} • Handcrafted</div>
      <p class="price">₹${p.price.toFixed(2)}</p>
      <p class="desc">${p.description}</p>
      <div class="card-actions">
        <button class="btn" data-id="${p.id}">View</button>
        <button class="btn add-cart-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>
  `;
  // Add View button click event
  el.querySelector('button:not(.add-cart-btn)').addEventListener('click', ()=> openModal(p.id));
  
  // Add to Cart button click event
  el.querySelector('.add-cart-btn').addEventListener('click', ()=> {
    // Add to cart logic (always add 1)
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find(item => item.id === p.id);
    if (!exists) {
      cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 });
    } else {
      exists.qty += 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
    console.log('Current cart:', cart);  // Debug line
  });
  return el;
}

function renderGridInto(elementId, list){
  const container = document.getElementById(elementId);
  if(!container) return;
  container.innerHTML = '';
  list.forEach(p => container.appendChild(createCard(p)));
}

function openModal(id){
  const p = products.find(x => x.id === id);
  if(!p) return;
  const modal = document.getElementById('productModal');
  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <div class="modal-grid">
      <div class="modal-media"><img src="${p.img}" alt="${p.name}"></div>
      <div class="modal-info">
        <h3>${p.name}</h3>
        <p class="meta">Category: ${p.category}</p>
        <p class="price">₹${p.price.toFixed(2)}</p>
        <p>${p.description}</p>
        <div style="margin-top:12px"><button class="btn" onclick="alert('Demo checkout — contact Praveen to purchase')">Purchase</button></div>
      </div>
    </div>
  `;
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(){
  const modal = document.getElementById('productModal');
  if(modal) modal.setAttribute('aria-hidden', 'true');
}

function applyFiltersAndRender(targetId, opts = {}){
  let list = products.slice();
  if(opts.category && opts.category !== 'all'){
    if(opts.category === 'Deals'){
      // no explicit deal flag in this dataset; leave as category fallback
      list = list.filter(p => p.category === 'Deals');
    } else {
      list = list.filter(p => p.category === opts.category);
    }
  }
  if(opts.search){
    const q = opts.search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if(opts.sort === 'price-asc') list.sort((a,b) => a.price - b.price);
  if(opts.sort === 'price-desc') list.sort((a,b) => b.price - a.price);
  renderGridInto(targetId, list);
}

function renderSidebarFilters(sidebarEl, onChange){
  if(!sidebarEl) return;
  sidebarEl.innerHTML = '';
  const h = document.createElement('h4'); h.textContent = 'Categories'; sidebarEl.appendChild(h);
  const sel = document.createElement('select'); sel.id = 'categoryFilter';
  ['all','Kitchen','Garden','Decorative','Deals'].forEach(v => {
    const o = document.createElement('option'); o.value = v; o.textContent = v === 'all' ? 'All' : v; sel.appendChild(o);
  });
  sidebarEl.appendChild(sel);
  sel.addEventListener('change', onChange);

  const sortLabel = document.createElement('h4'); sortLabel.style.marginTop = '12px'; sortLabel.textContent = 'Sort'; sidebarEl.appendChild(sortLabel);
  const sortSel = document.createElement('select'); sortSel.id = 'sortSelect';
  [['','Recommended'],['price-asc','Price: Low to High'],['price-desc','Price: High to Low'],['name-asc','Name A–Z']].forEach(([val,txt])=>{ const o=document.createElement('option'); o.value=val; o.textContent=txt; sortSel.appendChild(o); });
  sidebarEl.appendChild(sortSel);
  sortSel.addEventListener('change', onChange);
}

document.addEventListener('DOMContentLoaded', ()=>{
  const productGrid = document.getElementById('productGrid');
  const gardenGrid = document.getElementById('gardenGrid');
  const sidebar = document.querySelector('.sidebar');
  const search = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  // initial render
  if(productGrid) applyFiltersAndRender('productGrid', {});
  if(gardenGrid) applyFiltersAndRender('gardenGrid', { category: 'Garden' });

  // modal close binding
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.addEventListener('click', (e)=>{ if(e.target.classList && e.target.classList.contains('modal')) closeModal(); });

  // sidebar filters
  if(sidebar){
    renderSidebarFilters(sidebar, ()=>{
      const cat = (document.getElementById('categoryFilter') || {}).value || 'all';
      const sort = (document.getElementById('sortSelect') || {}).value || '';
      const q = (search && search.value) ? search.value.trim() : '';
      applyFiltersAndRender('productGrid', { category: cat, sort: sort, search: q });
    });
  }

  // search
  if(search){
    search.addEventListener('input', (e)=>{
      const q = e.target.value.trim();
      const cat = (document.getElementById('categoryFilter') || {}).value || 'all';
      const sort = (document.getElementById('sortSelect') || {}).value || '';
      applyFiltersAndRender('productGrid', { category: cat, sort: sort, search: q });
    });
  }

  // sort (if present outside sidebar)
  if(sortSelect){
    sortSelect.addEventListener('change', ()=>{
      const cat = (document.getElementById('categoryFilter') || {}).value || 'all';
      const sort = sortSelect.value || '';
      const q = (search && search.value) ? search.value.trim() : '';
      applyFiltersAndRender('productGrid', { category: cat, sort: sort, search: q });
    });
  }
});

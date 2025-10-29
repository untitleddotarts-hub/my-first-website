// Mana Pottery — centralized product data and rendering (clean LG-enabled version)
const products = [
  { id: 1, name: 'Kitchen Set - Rustic Bowl', description: 'Hand-thrown bowl, microwave and dishwasher safe.', category: 'Kitchen', price: 24.99, img: 'images/product1.svg' },
  { id: 2, name: 'Serving Platter', description: 'Oval platter for family-style serving.', category: 'Kitchen', price: 39.99, img: 'images/product2.svg' },
  { id: 3, name: 'Heritage Planter', description: 'Frost-resistant planter with drainage.', category: 'Garden', price: 49.99, img: 'images/product3.svg' },
  { id: 4, name: 'Bird Bath', description: 'Decorative bird bath with hand-glazed finish.', category: 'Garden', price: 89.99, img: 'images/product4.svg' },
  { id: 5, name: 'Tea Set - Four Cup', description: 'Elegant tea set, perfect for gatherings.', category: 'Kitchen', price: 74.99, img: 'images/product5.svg' },
  { id: 6, name: 'Garden Lantern', description: 'Handcrafted lantern for ambient garden light.', category: 'Garden', price: 59.99, img: 'images/product6.svg' },
  { id: 7, name: 'Decorative Vase', description: 'Statement vase with matte glaze.', category: 'Decorative', price: 69.99, img: 'images/product7.svg' },
  { id: 8, name: 'Wall Tile - Pattern', description: 'Artisan tile for indoor/outdoor walls.', category: 'Decorative', price: 12.99, img: 'images/product8.svg' },
  { id: 9, name: 'Soup Mug', description: 'Large-handled mug for soups & stews.', category: 'Kitchen', price: 18.99, img: 'images/product9.svg' },
  { id: 10, name: 'Garden Marker Set', description: 'Ceramic markers to label your plants.', category: 'Garden', price: 14.99, img: 'images/product10.svg' }
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
      </div>
    </div>
  `;
  el.querySelector('button').addEventListener('click', ()=> openModal(p.id));
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

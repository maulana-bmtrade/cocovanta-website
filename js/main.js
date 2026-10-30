/* COCOVANTA interactions. Static-site only: RFQs are not stored on a server. */
(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const WA_NUMBER = '6285736277955';
  const format = (n, digits=0) => new Intl.NumberFormat('en-US',{maximumFractionDigits:digits}).format(n);

  // Mobile navigation
  const menuButton = $('#mobile-menu-btn');
  const mobileMenu = $('#mobile-menu');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const willOpen = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !willOpen);
      menuButton.setAttribute('aria-expanded', String(willOpen));
      const icon = $('i', menuButton);
      if (icon) icon.className = willOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
    $$('a', mobileMenu).forEach(link => link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden'); menuButton.setAttribute('aria-expanded','false');
      const icon = $('i',menuButton); if(icon) icon.className='fa-solid fa-bars';
    }));
    document.addEventListener('keydown', e => { if(e.key==='Escape' && !mobileMenu.classList.contains('hidden')) {mobileMenu.classList.add('hidden');menuButton.setAttribute('aria-expanded','false');menuButton.focus();} });
  }

  // FAQ accordion (one open at a time)
  $$('.faq-toggle').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.faq-item'); if (!item) return;
    const shouldOpen = !item.classList.contains('is-open');
    $$('.faq-item').forEach(other => {other.classList.remove('is-open');const b=$('.faq-toggle',other);if(b)b.setAttribute('aria-expanded','false');});
    if (shouldOpen) {item.classList.add('is-open');button.setAttribute('aria-expanded','true');}
  }));

  // Product filter + search are applied together.
  const productGrid = $('#product-grid');
  if (productGrid) {
    const cards = $$('.b2b-card', productGrid);
    const search = $('#product-search');
    const count = $('#product-result-count');
    const buttons = $$('#product-filter-tabs [data-filter]');
    let activeFilter = 'all';
    const applyFilters = () => {
      const term = (search?.value || '').trim().toLocaleLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const category = card.dataset.category || '';
        const text = (card.textContent || '').toLocaleLowerCase();
        const categoryMatch = activeFilter === 'all' || category === activeFilter;
        const searchMatch = !term || text.includes(term);
        const show = categoryMatch && searchMatch;
        card.hidden = !show; if (show) visible++;
      });
      let empty = $('.product-empty',productGrid);
      if (!visible && !empty) {empty=document.createElement('div');empty.className='product-empty';empty.textContent='No products match your search. Try another keyword or select “All Products”.';productGrid.appendChild(empty);}
      if (visible && empty) empty.remove();
      if (count) count.textContent = `Showing ${visible} of ${cards.length} products`;
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      buttons.forEach(b => {const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
      applyFilters();
    }));
    search?.addEventListener('input',applyFilters);
    applyFilters();
  }

  // Cocopeat calculator. Inputs are estimates, never a freight/loading guarantee.
  const blockInput = $('#block-count');
  const litersOutput = $('#calc-liters');
  const weightOutput = $('#calc-weight');
  const calculate = () => {
    if (!blockInput || !litersOutput || !weightOutput) return null;
    const raw = Number(blockInput.value);
    const blocks = Number.isFinite(raw) ? Math.max(1,Math.min(1000000,Math.floor(raw))) : 1;
    const liters = blocks * 70; const kg = blocks * 5;
    litersOutput.textContent = `${format(liters)} Liters`;
    weightOutput.textContent = `${format(kg/1000,2)} Metric Tons`;
    return {blocks,liters,kg};
  };
  if (blockInput) {blockInput.addEventListener('input',calculate);calculate();}
  $('#calc-cta-btn')?.addEventListener('click', () => {
    const result=calculate(); if(!result) return;
    const quantity = `${format(result.blocks)} x 5 kg blocks (estimated net product weight ${format(result.kg/1000,2)} MT)`;
    window.location.href = `contact.html?product=${encodeURIComponent('Cocopeat 5 kg Compressed Blocks')}&quantity=${encodeURIComponent(quantity)}`;
  });

  // Pre-fill RFQ from product/catalogue/calculator links.
  const params = new URLSearchParams(window.location.search);
  const productField = $('#rfq-product');
  const quantityField = $('#rfq-qty');
  if (productField && params.has('product')) {
    const requested = params.get('product') || '';
    const slugMap = {
      'low-ec-cocopeat':'Low EC Washed Cocopeat',
      'cocopeat-5kg-blocks':'Cocopeat 5 kg Compressed Blocks',
      'cocopeat-grow-bags':'Cocopeat Grow Bags',
      'natural-coco-fiber':'Natural Coco Fiber',
      'coco-chips':'Coco Chips (Husk Cubes)',
      'loose-coco-fiber':'Loose Coco Fiber'
    };
    const desired = slugMap[requested.toLowerCase()] || requested;
    const option = Array.from(productField.options).find(o => o.value.toLowerCase()===desired.toLowerCase() || o.text.toLowerCase()===desired.toLowerCase());
    if (option) productField.value=option.value;
  }
  if (quantityField && params.has('quantity')) quantityField.value=(params.get('quantity')||'').slice(0,180);

  // RFQ opens WhatsApp synchronously after native validation; no false "sent" claim.
  const rfqForm = $('#rfq-form');
  if (rfqForm) rfqForm.addEventListener('submit', event => {
    event.preventDefault();
    const status = $('#rfq-status');
    const trap = $('#rfq-website');
    if (trap && trap.value.trim()) return;
    const get = id => ($('#'+id)?.value || '').trim();
    const fields = [
      ['Company',get('rfq-company')],['Contact person',get('rfq-name')],['Business email',get('rfq-email')],
      ['Country',get('rfq-country')],['Product',get('rfq-product')],['Quantity',get('rfq-qty')],
      ['Destination port',get('rfq-port') || 'Not specified'],['Preferred Incoterm',get('rfq-incoterm') || 'To be discussed'],
      ['Sample request',get('rfq-sample') || 'Not requested'],['Documents / evidence requested',get('rfq-docs') || 'To be advised'],
      ['Additional requirements',get('rfq-message') || 'None']
    ];
    const email = get('rfq-email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {if(status)status.textContent='Please enter a valid business email address.';$('#rfq-email')?.focus();return;}
    const body = ['COCOVANTA — REQUEST FOR QUOTATION','',...fields.map(([k,v])=>`${k}: ${v}`),'','Please confirm supplier availability, technical documents, sample options, lead time and a supplier-backed quotation.'].join('\n');
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(body.slice(0,3500))}`;
    if (status) status.textContent='WhatsApp is opening. Please review the prepared inquiry and press Send in WhatsApp to submit it.';
    const opened = window.open(url,'_blank','noopener,noreferrer');
    if (!opened) window.location.href=url;
  });

  // Avoid loading video aggressively on data-constrained mobile devices; browser still honors poster.
  const heroVideo = $('video[autoplay]');
  if (heroVideo && window.matchMedia('(max-width: 640px)').matches) {
    heroVideo.pause(); heroVideo.removeAttribute('autoplay');
  }
})();


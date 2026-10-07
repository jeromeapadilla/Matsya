const products = [
  {id:'matcha',name:'Matcha Taho',desc:'Premium matcha · silken taho · arnibal · pearls',price:8.5,image:'./public/images/drink-matcha-taho.png?v=20261007-1',accent:'#456b1d'},
  {id:'strawberry',name:'Strawberry Matcha Taho',desc:'Strawberry compote · matcha · taho · pearls',price:9,image:'./public/images/drink-strawberry-matcha-taho.png?v=20261007-1',accent:'#c94548'},
  {id:'ube',name:'Ube Matcha Taho',desc:'Ube halaya · matcha · taho · pearls',price:9,image:'./public/images/drink-ube-matcha-taho.png?v=20261007-1',accent:'#6e3c95'},
  {id:'blueberry',name:'Blueberry Matcha Taho',desc:'Blueberry compote · matcha · taho · pearls',price:9,image:'./public/images/drink-blueberry-matcha-taho.png?v=20261007-1',accent:'#40598f'},
  {id:'mango',name:'Mango Matcha Taho',desc:'Mango purée · matcha · taho · pearls',price:9,image:'./public/images/drink-mango-matcha-taho.png?v=20261007-1',accent:'#d98f20'}
];
let cart = JSON.parse(localStorage.getItem('matsya-pages-cart') || '{}');
let promo = false;
const $ = s => document.querySelector(s);
const money = n => `$${n.toFixed(2)}`;
function subtotal(){return products.reduce((sum,p)=>sum+(cart[p.id]||0)*p.price,0)}
function count(){return Object.values(cart).reduce((a,b)=>a+b,0)}
function save(){localStorage.setItem('matsya-pages-cart',JSON.stringify(cart));renderProducts();renderCart();}
function add(id,n=1){cart[id]=Math.max(0,(cart[id]||0)+n);if(!cart[id])delete cart[id];save()}
function renderProducts(){
  $('#products').innerHTML=products.map((p,i)=>`<article class="product" style="--accent:${p.accent}"><div class="product-img"><img src="${p.image}" alt="${p.name}" style="object-position:${p.position||'center'};object-fit:${p.fit||'cover'};filter:${p.filter||'none'}">${i===0?'<span>Bestseller</span>':''}</div><div class="product-copy"><div><h3>${p.name}</h3><p>${p.desc}</p></div><b>${money(p.price)}</b></div>${cart[p.id]?`<div class="qty"><button onclick="add('${p.id}',-1)">−</button><b>${cart[p.id]}</b><button onclick="add('${p.id}',1)">+</button></div>`:`<button class="add" onclick="add('${p.id}')">Add to cart +</button>`}</article>`).join('');
}
function renderCart(){
  const n=count(),sub=subtotal(),discount=promo?sub*.1:0;
  $('#bag-count').textContent=n; $('#floating-count').textContent=`${n} item${n===1?'':'s'}`; $('#floating-total').textContent=money(sub-discount); $('#floating-cart').hidden=!n;
  const items=products.filter(p=>cart[p.id]);
  $('#cart-content').innerHTML=!n?'<div class="empty"><span>✦</span><h3>Your cart is waiting.</h3><p>Add a handcrafted Matcha Taho to begin your order.</p></div>':`<div class="cart-items">${items.map(p=>`<div class="cart-row"><img src="${p.image}" alt=""><div><b>${p.name}</b><small>${money(p.price)} each</small></div><div class="mini"><button aria-label="Remove one" onclick="add('${p.id}',-1)">−</button><span>${cart[p.id]}</span><button aria-label="Add one" onclick="add('${p.id}',1)">+</button></div></div>`).join('')}</div><div class="promo-input"><input id="promo-code" aria-label="Promo code" placeholder="Promo code" value="${promo?'MATSYA10':''}"><button id="apply-promo">${promo?'✓ Applied':'Apply'}</button></div><div class="totals"><p><span>Subtotal</span><span>${money(sub)}</span></p>${promo?`<p class="green"><span>Promotion</span><span>−${money(discount)}</span></p>`:''}<p class="grand"><span>Total</span><span>${money(sub-discount)}</span></p></div><button class="primary checkout" id="checkout">Continue to checkout →</button><p class="secure-note">Guest checkout · No online payment required</p>`;
  $('#apply-promo')?.addEventListener('click',()=>{promo=$('#promo-code').value.trim().toUpperCase()==='MATSYA10';renderCart()});
  $('#checkout')?.addEventListener('click',renderCheckout);
}
function renderCheckout(){
  const total=subtotal()*(promo?.9:1); $('#cart-title').textContent='Guest checkout';
  $('#cart-content').innerHTML=`<form id="order-form" class="order-form"><div class="tabs"><button type="button" class="active">Pickup</button><button type="button">Delivery</button></div><label>Name<input name="name" required></label><label>Email<input name="email" type="email" required></label><label>Phone<input name="phone" required></label><label>Preferred date & time<input name="time" placeholder="Saturday at 2:00 PM" required></label><label>Order notes<textarea name="notes"></textarea></label><div class="checkout-total"><span>Total</span><b>${money(total)}</b></div><button class="primary checkout">Send order request</button><small>We’ll open an email with your order details so Matsya can confirm it with you.</small></form>`;
  $('#order-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const lines=products.filter(p=>cart[p.id]).map(p=>`${cart[p.id]} × ${p.name}`);const body=`New Matsya order request%0D%0A%0D%0A${encodeURIComponent(lines.join('\n'))}%0D%0A%0D%0ATotal: ${encodeURIComponent(money(total))}%0D%0AName: ${encodeURIComponent(f.get('name'))}%0D%0APhone: ${encodeURIComponent(f.get('phone'))}%0D%0APreferred time: ${encodeURIComponent(f.get('time'))}%0D%0ANotes: ${encodeURIComponent(f.get('notes'))}`;location.href=`mailto:orders@matsya.ca?subject=Matsya order request&body=${body}`});
}
function openCart(){ $('#cart-overlay').hidden=false;document.body.classList.add('locked');renderCart() }
function closeCart(){ $('#cart-overlay').hidden=true;document.body.classList.remove('locked') }
$('#open-cart').onclick=openCart;$('#floating-cart').onclick=openCart;$('#close-cart').onclick=closeCart;$('#cart-overlay').onclick=e=>{if(e.target===e.currentTarget)closeCart()};
$('#claim-promo').onclick=()=>{promo=true;openCart()};renderProducts();renderCart();

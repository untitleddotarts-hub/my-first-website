document.addEventListener('DOMContentLoaded', function() {
  const cartItemsDiv = document.getElementById('cartItems');
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  let html = '<table class="cart-table" style="width:100%;border-collapse:collapse;">';
  html += '<tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr>';
  let grandTotal = 0;
  cart.forEach(item => {
    const total = item.price * item.qty;
    grandTotal += total;
    html += `<tr>
      <td style="padding:8px 4px;"><img src="${item.img}" alt="${item.name}" style="height:32px;vertical-align:middle;margin-right:8px;">${item.name}</td>
      <td style="text-align:center;">${item.qty}</td>
      <td style="text-align:right;">₹${item.price.toFixed(2)}</td>
      <td style="text-align:right;">₹${total.toFixed(2)}</td>
    </tr>`;
  });
  html += `<tr><td colspan="3" style="text-align:right;font-weight:700;">Grand Total</td><td style="text-align:right;font-weight:700;">₹${grandTotal.toFixed(2)}</td></tr>`;
  html += '</table>';
  html += `<div class="payment-section" style="margin-top:32px;padding:18px 0;border-top:1px solid #eee;">
    <h3 style="margin-bottom:12px;color:#388e3c;">Payment</h3>
    <label style="font-size:1.1em;display:flex;align-items:center;gap:8px;">
      <input type="radio" name="payment" value="cod" id="codOption"> Cash on Delivery (COD)
    </label>
    <button id="placeOrderBtn" style="margin-top:18px;background:#43a047;color:#fff;font-weight:700;font-size:1.15em;padding:12px 0;width:100%;border:none;border-radius:8px;box-shadow:0 2px 8px rgba(67,160,71,0.10);cursor:pointer;display:block;">Place Order</button>
  </div>`;
  cartItemsDiv.innerHTML = html;
  document.getElementById('placeOrderBtn').addEventListener('click', function() {
    const codChecked = document.getElementById('codOption').checked;
    if (!codChecked) {
      alert('Please select Cash on Delivery (COD) to place your order.');
      return;
    }
    // Prepare order details
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let orderDetails = cart.map(item => `${item.name} (Qty: ${item.qty}) - ₹${item.price.toFixed(2)}`).join('\n');
    let grandTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    // Send email via EmailJS
    emailjs.init('user_untitleddotarts'); // Replace with your EmailJS User ID if needed
    emailjs.send('service_dccqdir', 'template_ohnglkc', {
      to_email: 'untitleddotarts@gmail.com',
      order_list: orderDetails,
      total: `₹${grandTotal.toFixed(2)}`,
      payment: 'Cash on Delivery (COD)'
    }).then(function(response) {
      alert('Order placed! You will be contacted for COD.');
      localStorage.removeItem('cart');
      window.location.reload();
    }, function(error) {
      alert('Order could not be sent. Please try again later.');
    });
  });
});

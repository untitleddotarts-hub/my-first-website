document.addEventListener('DOMContentLoaded', function() {
  const cartItemsDiv = document.getElementById('cartItems');
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  function displayCart() {
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }

    let html = `
      <table class="cart-table" style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;padding:12px 8px;">Product</th>
            <th style="text-align:center;padding:12px 8px;">Quantity</th>
            <th style="text-align:right;padding:12px 8px;">Price</th>
            <th style="text-align:right;padding:12px 8px;">Total</th>
            <th style="text-align:center;padding:12px 8px;">Action</th>
          </tr>
        </thead>
        <tbody>
    `;

    let grandTotal = 0;

    cart.forEach((item, index) => {
      const total = item.price * item.qty;
      grandTotal += total;
      html += `
        <tr>
          <td style="padding:12px 8px;">
            <div style="display:flex;align-items:center;gap:12px;">
              <img src="${item.img}" alt="${item.name}" style="height:48px;width:48px;object-fit:cover;border-radius:4px;">
              <span style="font-weight:500;">${item.name}</span>
            </div>
          </td>
          <td style="text-align:center;padding:12px 8px;">
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
              <button onclick="updateQuantity(${index}, -1)" style="padding:4px 8px;border:1px solid #ddd;background:none;cursor:pointer;">-</button>
              <span>${item.qty}</span>
              <button onclick="updateQuantity(${index}, 1)" style="padding:4px 8px;border:1px solid #ddd;background:none;cursor:pointer;">+</button>
            </div>
          </td>
          <td style="text-align:right;padding:12px 8px;">₹${item.price.toFixed(2)}</td>
          <td style="text-align:right;padding:12px 8px;">₹${total.toFixed(2)}</td>
          <td style="text-align:center;padding:12px 8px;">
            <button onclick="removeItem(${index})" style="color:#d32f2f;background:none;border:none;cursor:pointer;padding:4px 8px;">
              Remove
            </button>
          </td>
        </tr>
      `;
  });

  html += `<tr>
    <td colspan="3" style="text-align:right;font-weight:700;">Grand Total</td>
    <td style="text-align:right;font-weight:700;">₹${grandTotal.toFixed(2)}</td>
  </tr>`;
  html += '</table>';

    html += `
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="text-align:right;padding:16px 8px;font-weight:700;">Grand Total:</td>
          <td style="text-align:right;padding:16px 8px;font-weight:700;">₹${grandTotal.toFixed(2)}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    <div class="checkout-section" style="margin-top:32px;padding:24px;background:#f5f5f5;border-radius:8px;">
      <h3 style="margin:0 0 20px;color:#2e7d32;">Checkout Information</h3>
      
      <div class="form-group" style="margin-bottom:20px;">
        <label for="customerName" style="display:block;margin-bottom:8px;font-weight:500;">Full Name *</label>
        <input type="text" id="customerName" required
               style="width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;font-size:16px;"
               placeholder="Enter your full name">
      </div>

      <div class="form-group" style="margin-bottom:20px;">
        <label for="customerEmail" style="display:block;margin-bottom:8px;font-weight:500;">Email Address *</label>
        <input type="email" id="customerEmail" required
               style="width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;font-size:16px;"
               placeholder="Enter your email address">
      </div>

      <div class="form-group" style="margin-bottom:20px;">
        <label for="customerPhone" style="display:block;margin-bottom:8px;font-weight:500;">Phone Number *</label>
        <input type="tel" id="customerPhone" required
               style="width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;font-size:16px;"
               placeholder="Enter your phone number">
      </div>

      <div class="form-group" style="margin-bottom:20px;">
        <label for="customerAddress" style="display:block;margin-bottom:8px;font-weight:500;">Delivery Address *</label>
        <textarea id="customerAddress" required rows="3"
                  style="width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;font-size:16px;resize:vertical;"
                  placeholder="Enter your complete delivery address"></textarea>
      </div>

      <div class="form-group" style="margin-bottom:24px;">
        <label style="display:flex;align-items:center;gap:8px;font-weight:500;">
          <input type="radio" name="payment" value="cod" id="codOption" required>
          Cash on Delivery (COD)
        </label>
      </div>

      <button id="placeOrderBtn"
              style="width:100%;padding:14px;background:#2e7d32;color:white;border:none;border-radius:4px;
                     font-size:16px;font-weight:600;cursor:pointer;transition:background-color 0.2s;">
        Place Order
      </button>
    </div>
  `;

    cartItemsDiv.innerHTML = html;
  }

  // Initialize the cart display
  displayCart();

  // Update quantity function
  window.updateQuantity = function(index, change) {
    if (cart[index]) {
      cart[index].qty = Math.max(1, cart[index].qty + change);
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCart();
    }
  };

  // Remove item function
  window.removeItem = function(index) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCart();
    }
  };

  // Place order event listener
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'placeOrderBtn') {
      const name = document.getElementById('customerName')?.value?.trim();
      const email = document.getElementById('customerEmail')?.value?.trim();
      const phone = document.getElementById('customerPhone')?.value?.trim();
      const address = document.getElementById('customerAddress')?.value?.trim();
      const codChecked = document.getElementById('codOption')?.checked;

      // Validation
      if (!name) {
        alert('Please enter your full name');
        return;
      }
      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Please enter a valid email address');
        return;
      }
      if (!phone || !phone.match(/^\d{10}$/)) {
        alert('Please enter a valid 10-digit phone number');
        return;
      }
      if (!address) {
        alert('Please enter your delivery address');
        return;
      }
      if (!codChecked) {
        alert('Please select Cash on Delivery (COD) to place your order');
        return;
      }

      // Calculate totals
      const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

      // Prepare email template parameters
      const templateParams = {
        order_id: Date.now().toString(36).toUpperCase(),
        email: email,
        orders: cart.map(item => ({
          image_url: item.img,
          name: item.name,
          units: item.qty,
          price: item.price.toFixed(2)
        })),
        cost: {
          shipping: '0.00',
          tax: '0.00',
          total: grandTotal.toFixed(2)
        },
        customer: {
          name: name,
          phone: phone,
          address: address
        }
      };

      // Send order email
      console.log('Sending order with params:', JSON.stringify(templateParams, null, 2));
      
      emailjs.send('service_dccqdir', 'template_ohnglkc', templateParams)
        .then(function(response) {
          console.log('✅ Order confirmation sent successfully:', response);
          alert('Order placed successfully! You will receive a confirmation email shortly.');
          localStorage.removeItem('cart');
          window.location.reload();
        })
        .catch(function(error) {
          console.error('❌ EmailJS error details:', {
            error: error,
            templateParams: templateParams,
            serviceId: 'service_dccqdir',
            templateId: 'template_ohnglkc'
          });
          
          let errorMessage = 'There was an error placing your order:\n\n';
          
          if (error.text) {
            errorMessage += error.text;
          } else if (error.message) {
            errorMessage += error.message;
          } else {
            errorMessage += 'Unknown error occurred. Please verify your email address and try again.';
          }
          
          errorMessage += '\n\nIf this persists, please contact support.';
          alert(errorMessage);
        });
    }
  });
});

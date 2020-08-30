var STRIPE_PK = window.location.hostname === 'localhost' ? 'pk_test_Tb50ODjOdtCqUOGtKtFIqiLN' : 'pk_live_Cb6D5Nbk7JgzXZ1YAkttiQCN'
var CHARGE_ENDPOINT = window.location.hostname === 'localhost' ? 'http://localhost:9099/charge' : 'https://charge.recollection.com.au/charge'

var handler = StripeCheckout.configure({
    key: STRIPE_PK,
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: function(token) {
        $.ajax({
            type: 'POST',
            url: CHARGE_ENDPOINT,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                email: token.email,
                stripeToken: token.id,
                price: (cart.totalPrice) * 100,
                cartItems: cart.metadataItems(),
                cartShipping: cart.shippingCost * 100,
            }),
            success: function() {
                console.warn('success', arguments)
                cart.clear()
                window.location.href = window.kirby.home + '/thanks'
            },
            error: function() {
                console.error('error', arguments)
            }
        });
    }
});

var store = {
    read: function(key) {
        if (!localStorage[key]) localStorage[key] = '{}'
        return JSON.parse(localStorage[key])
    },

    write: function(key, o) {
        localStorage[key] = JSON.stringify(o)
    },

    clear: function(key) {
        localStorage[key] = null
    }
}

var cart = {
    baseShippingPrice: 0,
    totalQuantity: 0,
    totalPrice: 0,
    items: store.read('cart'),
    shippingCost: 0,

    update: function() {
        var items = this.items
        this.totalQuantity = Object.keys(items).reduce(function(previous, key) {
            return previous + items[key].quantity;
        }, 0)

        var shippingCost = (1 + Math.floor(this.totalQuantity / 2.001)) * this.baseShippingPrice
        $('.shipping-cost').html(shippingCost)

        this.shippingCost = shippingCost

        var cartStr = '';
        var totalPrice = 0;
        for (key in items) {
            cartStr += '<tr>'
            cartStr += '<td>' + items[key].title + '</td>'
            cartStr += '<td>$' + items[key].price + '</td>'
            cartStr += '<td>'
            if (items[key].type == 'book') {
                cartStr += '<a href="#" class="button--unbuy" data-id="' + key + '">&minus;</a>'
                cartStr += +items[key].quantity
                cartStr += '<a href="#" class="button--buy" data-id="' + key + '">+</a>'
            }
            cartStr += '</td>'
            cartStr += '</tr>'
            totalPrice += items[key].price * items[key].quantity
        }
        if (this.totalQuantity > 0) {
            this.totalPrice = totalPrice + shippingCost
            $('.cart-shipping').show()
        } else {
            $('.cart-shipping').hide()
            this.totalPrice = 0
        }
        $('.cart tbody.book-cart').html(cartStr)
        $('.cart-update--amount').show().html('Cart (' + (this.totalQuantity) + ')')
        if (this.totalPrice < 1) {
            $('.cart-update--amount').hide()
        } else {
            $('.cart-total').html('$' + this.totalPrice)
        }
    },

    save: function() {
        store.write('cart', this.items)
        this.update()
    },

    updateBaseShipping: function(cost) {
        this.baseShippingPrice = cost
        this.update()
    },

    addItem: function(obj) {
        if (this.items[obj.id]) {
            this.items[obj.id].quantity += 1
        } else {
            obj.quantity = 1;
            this.items[obj.id] = obj
        }
        this.save()
    },

    removeItem: function(obj) {
        if (this.items[obj.id]) this.items[obj.id].quantity -= 1
        if (this.items[obj.id].quantity == 0) delete this.items[obj.id]
        this.save()
    },

    clear: function() {
        this.items = {}
        this.save()
    },

    metadataItems: function() {
        return Object.keys(this.items).map(function(id) {
            var item = this.items[id]
            return item.title
        }.bind(this)).join(',')
    }
}

$(function() {
    cart.update()

    $('.shipping-type').on('change', function() {
        cart.updateBaseShipping(this.value)
    }).trigger('change')

    $('body').on('click', '.button--unbuy', function(e) {
        e.preventDefault()
        cart.removeItem($(this).data())
    })

    $('body').on('click', '.button--buy', function(e) {
        e.preventDefault()
        cart.addItem($(this).data())
        document.body.classList.toggle('cart-open')
    })

    $('.cart-update--amount').on('click', function(e) {
        e.preventDefault()
        document.body.classList.toggle('cart-open')
    })

    $('body').on('click', '.button--checkout', function(e) {
        e.preventDefault()
        var price = (cart.totalPrice) * 100
        handler.open({
            name: 'Re:collection',
            currency: 'AUD',
            shippingAddress: true,
            billingAddress: true,
            zipCode: true,
            amount: price
        })
    })

    window.addEventListener('popstate', function() {
        handler.close();
    })

})
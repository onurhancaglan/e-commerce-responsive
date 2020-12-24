// MODELS
var restaurant = {
    name: 'Sahane',
    rating: 3.5,
    numberOfScoring: 120,
    address: 'Kartepe, Kocaeli 41170, Suadiye, Turkey',
    isOpen: true,
    availableTimeString: '24 Hours, 7 Days.',
    isDeliveryAvailable: false,
    isPickUpAvailable: false,
    deliveryCost: 0,
    minOrderAmount: 0
};
var primaryColor = '#ea5728';
var backgroundColor = '#efedee';
var successColor = '#b7e1b3';
var currency = 'CHF';
window.menu = [{
    id: '1',
    name: 'Puff-Puff',
    description: 'Traditional Nigerian donut ball, rolled in sugar',
    price: 4.99
}, {
    id: '2',
    name: 'SCOTCH EGG',
    description: 'Boiled egg wrapped in a ground meat mixture, coated in breadcrumbs, and depp-fried',
    price: 2
}, {
    id: '3',
    name: 'ATA RICE',
    description: 'Special shrimp sauted in crushed green Jamaican pepper',
    price: 12
}, {
    id: '4',
    name: 'RICE AND FOOD',
    description: '(plantains) w/chicken, fish, beef or goat',
    price: 11.99
}, {
    id: '5',
    name: 'Special Shrimp Deluxe',
    description: 'Fresh shrimp sauteed in blended mixture, coated in breadcrumbs, and depp-fried',
    price: 12.99
}, {
    id: '6',
    name: 'Whole catfish with rice and vegetables',
    description: 'Whole catfish slow cooked in tomatoes, pepper and onion',
    price: 13.99
}];
var categories = ['Appetizer', 'Specials', 'Salads', 'Seafoods', 'Traditional', 'Main Course', 'Desserts', 'Drinks'];

(function () {
    // Inject category list
    categories.map(function (categoryText) {
        $('#category-list').append('<li class="category-item"><a class="text-center category-link" href="#">' +
            categoryText + '</a></li>');
    });

    //Inject restaurant info
    $('#restaurant-rating span')

    $('#restaurant-name').text(restaurant.name);
    $('#restaurant-address').text(restaurant.address);

    /** todo delivery pick up ayır*/
    if (restaurant.isDeliveryAvailable) {
        $('.delivery-pick-up-available').text('Delivery and pick-up available');
    } else {
        $('.delivery-pick-up-available').text('Delivery and pick-up unavailable');
        $('.delivery-pick-up-available').addClass('closed');
    }

    if (restaurant.isOpen) {
        $('.restaurant-available').text('We are open');
        $('.restaurant-available').addClass('open');
    } else {
        $('.restaurant-available').text('Closed');
        $('.restaurant-available').addClass('closed');
    }

    if (restaurant.deliveryCost > 0) {
        $('.delivert-cost').text('Delivery cost: ' + restaurant.deliveryCost + ' ' + currency);
    } else {
        $('.delivert-cost').text('Free above on all orders');
    }

    //Inject Menu
    menu.map(function (food) {
        $('.restaurant-menu ul').append(
            '<div class="row"><li class="menu-item col-12"><div class="row"><div class="name-description col-8"><div class="row">' +
            '<span class="primary-text col-12" id="food-name">' + food.name + '</span><span class="secondary-text col-12"' +
            ' id="food-descripton">' + food.description + '</span></div></div><div class=' +
            '"action-price col-4"><div class="row"><span class="primary-text col-7 price text-right">' +
            food.price + currency + '</span>' +
            '<div class="col-5"><button class="primary-text btn-add-to-cart btn btn-light" product-id="' + food.id +
            '">+</button></div></div></div></div></li></div><hr>'
        )
    });

    //Min order amount
    if (restaurant.minOrderAmount > 0) {
        $('#min-order-amount').text('Min. Order Amount:' + restaurant.minOrderAmount);
    } else {
        $('#min-order-amount').text('No Min. Order Amount');
    }

    //remove to cart
    $(document).on('click', '.btn-remove-to-cart', function () {
        var id = $(this).attr('product-id');
        var cart = JSON.parse(localStorage.getItem('cart') || '[]') || [];
        var deletedProduct = cart.filter(function (product) {
            return product.id === id;
        })[0] || {};

        cart = removeCart(deletedProduct.id, cart);
        deletedProduct.quantity--;

        if (deletedProduct.quantity > 0) {
            cart.push(deletedProduct);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    });

    //add to cart
    $('.btn-add-to-cart').on('click', function () {
        var id = $(this).attr('product-id');
        var cart = JSON.parse(localStorage.getItem('cart') || '[]') || [];
        var addedProduct;
        var alreadyInProduct = cart.filter(function (product) {
            return product.id === id;
        });

        Object.values(window.menu).map(function (food) {
            if (food['id'] === id) {
                addedProduct = food;
            }
        });

        if (alreadyInProduct.length > 0) {
            alreadyInProduct = alreadyInProduct[0];

            cart = removeCart(alreadyInProduct.id, cart);

            alreadyInProduct.quantity += 1;
            cart.push(alreadyInProduct);
        } else {
            addedProduct.quantity = 1;
            addedProduct.time = new Date().getTime();

            cart.push(addedProduct);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    });

    updateCart();
})();

function removeCart(deletedId, from) {
    from = from.filter(function (cartProduct) {
        return deletedId !== cartProduct.id;
    });

    return from;
}

function updateCart() {
    var cart = JSON.parse(localStorage.getItem('cart') || '[]') || [];
    var total = 0;

    cart.sort((a, b) => a.time - b.time);

    if (cart.length > 0) {
        $('.cart-area').html('');

        cart.map(function (product) {
            if (product.quantity > 0) {
                total += product.price * product.quantity;

                $('.cart-area').append(
                    '<div class="row cart-item" product-id="' + product.id + '"><div class="col-2">' +
                    '<button class="primary-text btn-remove-to-cart btn btn-light" product-id="' + product.id + '">-</button></div><div' +
                    ' class="col-6"><div class="row"><div class="col-12"><span class="primary-text"' +
                    ' id="quantity">' + product.quantity + ' x </span>' +
                    product.name + '</div><div class="col-12 secondary-text">Drinks</div><div class=' +
                    '"col-12 secondary-text">Coke</div></div></div><div class="col-4"><span class="' +
                    'secondary-text product-price text-right">' + product.price + currency + '</span></div></div>'
                );
            }
        });
    } else {
        $('.cart-area').html('');
        $('.cart-area').append('<p class="text-center secondary-text">No Item</p>');
    }

    $('.order-price').text(total + ' CHF');
    $('.sub-price').text(total + ' CHF');
}
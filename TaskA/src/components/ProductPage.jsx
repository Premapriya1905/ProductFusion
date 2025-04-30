import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useCart from '../hooks/useCart';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { cart, addToCart, removeFromCart, totalPrice } = useCart();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error(err);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products when category or search term changes
  useEffect(() => {
    let result = products;

    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchTerm, products]);

  // Render product cards
  const renderProducts = useMemo(() => {
    return filteredProducts.map(product => (
      <div key={product.id} className="product-card">
        <img src={product.image} alt={product.title} />
        <h3>{product.title}</h3>
        <p>${product.price}</p>
        <button onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    ));
  }, [filteredProducts, addToCart]);

  // Render cart items
  const renderCartItems = useMemo(() => {
    return cart.map(item => (
      <div key={item.id} className="cart-item">
        <span>{item.title} x {item.quantity}</span>
        <span>${(item.price * item.quantity).toFixed(2)}</span>
        <button onClick={() => removeFromCart(item.id)}>Remove</button>
      </div>
    ));
  }, [cart, removeFromCart]);

  return (
    <div className="product-page">
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}

      <div className="product-grid">
        {!isLoading && renderProducts}
      </div>

      <div className="cart">
        <h2>Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {renderCartItems}
            <div className="cart-total">
              <strong>Total: ${totalPrice}</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage;

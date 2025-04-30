# Performance Optimization Review

## Identified Optimization Opportunities

1. **Issue-1: Some parts of code are not organized well giving a mess** 
   - **Description:**  Component Separation and Code Organization by splitting large JSX sections into smaller, reusable components. This will improve readability, testability, and maintainability.
   - **Proposed Solution:** TO handle this I have created a seperate files named ProductCard.jsx and CartItem.jsx
   - **Benefits:** SO this solution has improved the code readability and modularity and also enables the reuse of ProductCard.jsx if needed.

2. **Issue-2: The filtering logic is inefficient** 
   - **Description:**  The filter logic inside the second useEffect which was given before runs every time the products, searchTerm, or selectedCategory change, but it re-filters the entire products array even when a minimal change happens.
   - **Proposed Solution:** I used memoization (useMemo) to filter products which will only filter products when necessary and avoid storing filteredProducts in state.
   - **Benefits:** This eliminates unnecessary re-renders caused by setting filteredProducts with setState, which is one of the best react practices(no redundant state). 

3. **Issue-3: To avoid unnecessary re-renders** 
   - **Description:** Whenever the state in ProductPage changes (e.g., search, cart updates), all child components re-render, including ProductCard and CartItem, even when their props haven’t changed. This can become a performance bottleneck when the product or cart list is large. 

   - **Proposed Solution:** First memoizing the callbacks with useCallback Second I am wrapping components with the React.memo.
   - **Benefits:**  Prevents unnecessary re-rendering of product and cart items when unrelated state changes. Improves performance especially when there are many products or cart updates.

4. **Issue: The calculateTotal() function recalculates on every render** 
   - **Description:** The calculateTotal() function is called during every render of the component, even if the cart hasn’t changed. This is inefficient and unnecessary, especially as the number of cart items grows.
   - **Proposed Solution:** I have used the useMemo to cache the total price calculation
   - **Benefits:** So the benefit of this is By memoizing it, we only recalculate the total when the cart changes.

5. **Issue:** 
   - **Description:** The cart logic (add, remove, calculate total) is cluttering the ProductPage component and makes it less reusable or testable.
   - **Proposed Solution:** I have extracted all cart-related state and logic into a custom hook called useCart.
   - **Benefits:** Cleaner and more modular ProductPage component. Easy to reuse useCart in future components.

## Additional Recommendations

(Include any additional recommendations or architectural changes you would suggest)

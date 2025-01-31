function confirmDataLoss() {
    if (confirm("Reloading this page leads to data loss. Are you sure?")) {
      return true; // Proceed to cart.html
    } else {
      return false; // Stay on current page
    }
  }
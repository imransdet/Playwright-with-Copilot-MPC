const { test, expect } = require('@playwright/test');
const { LoginPage, InventoryPage, CartPage, CheckoutPage } = require('../pages/SauceDemoPages');

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

test('Login, add highest price product to cart, and checkout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login(USERNAME, PASSWORD);
  await inventoryPage.addHighestPriceProduct();
  await inventoryPage.goToCart();
  await cartPage.checkout();
  await checkoutPage.fillInfo('Test', 'User', '12345');
  await checkoutPage.finishCheckout();
  await checkoutPage.verifyOrderComplete();
});

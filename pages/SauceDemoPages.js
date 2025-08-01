const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = '#user-name';
    this.passwordInput = '#password';
    this.loginButton = '#login-button';
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username, password) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
    await this.page.waitForURL('https://www.saucedemo.com/inventory.html');
  }
}

class InventoryPage {
  constructor(page) {
    this.page = page;
    this.priceSelector = '.inventory_item_price';
    this.addButtonSelector = '.btn_inventory';
    this.cartLink = '.shopping_cart_link';
  }


  async addHighestPriceProduct() {
    const prices = await this.page.$$eval(this.priceSelector, els => els.map(e => parseFloat(e.textContent.replace('$', ''))));
    const maxPrice = Math.max(...prices);
    const maxIndex = prices.indexOf(maxPrice);
    const addButtons = await this.page.$$(this.addButtonSelector);
    await addButtons[maxIndex].click();
  }

  async addLowestPriceProduct() {
    const prices = await this.page.$$eval(this.priceSelector, els => els.map(e => parseFloat(e.textContent.replace('$', ''))));
    const minPrice = Math.min(...prices);
    const minIndex = prices.indexOf(minPrice);
    const addButtons = await this.page.$$(this.addButtonSelector);
    await addButtons[minIndex].click();
  }

  async goToCart() {
    await this.page.click(this.cartLink);
    await this.page.waitForURL('https://www.saucedemo.com/cart.html');
  }
}

class CartPage {
  constructor(page) {
    this.page = page;
    this.checkoutButton = '#checkout';
  }

  async checkout() {
    await this.page.click(this.checkoutButton);
    await this.page.waitForURL('https://www.saucedemo.com/checkout-step-one.html');
  }
}

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = '#first-name';
    this.lastNameInput = '#last-name';
    this.postalCodeInput = '#postal-code';
    this.continueButton = '#continue';
    this.finishButton = '#finish';
    this.completeHeader = '.complete-header';
  }

  async fillInfo(firstName, lastName, postalCode) {
    await this.page.fill(this.firstNameInput, firstName);
    await this.page.fill(this.lastNameInput, lastName);
    await this.page.fill(this.postalCodeInput, postalCode);
    await this.page.click(this.continueButton);
  }

  async finishCheckout() {
    await this.page.click(this.finishButton);
    await this.page.waitForURL('https://www.saucedemo.com/checkout-complete.html');
  }

  async verifyOrderComplete() {
    await this.page.waitForSelector(this.completeHeader);
    await expect(this.page.locator(this.completeHeader)).toHaveText('Thank you for your order!');
  }
}

module.exports = { LoginPage, InventoryPage, CartPage, CheckoutPage };

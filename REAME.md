
## Playwright with GitHub Copilot and MCP Server
![MCP Main Thumbnail](screenshots/mcp.png)

### Prerequisite   
- VSCode
- GitHub Copilot VSCode Extension
- GitHub Account (To Active Copilot)
- Playwright [Installed](https://playwright.dev/docs/intro#installing-playwright)
- Playwright Test for VSCode Extension (optional)

### Install Playwright [MCP](https://github.com/microsoft/playwright-mcp) Server
### Verify Playwright MCP Installed
- Open Copilot Chat
- Click on the settings icon

![MCP Installed](screenshots/mcp_installed.png)

### Generate Test Cases
- Write a common prompt (context) in a `.txt` file and keep it anywhere in the project, for example:

```
- Act as a playwright test code generator for a web application
- After generating keep the test case in tests folder
- Run the test after generating
- If there is any failed case, fix it and rerun
- Keep running and fixing until got passed
```

- Now open the copilot chat
- Attach the `context.txt`
- Then put the individual test case's prompt, for example 

```
1. Go to https://www.saucedemo.com/
2. Login by using existing credentials 
3. Add lowest price product to cart
4. Checkout 
```

- The Output
```javascript
const { test, expect } = require('@playwright/test');

// Credentials for saucedemo.com (standard_user is a common demo account)
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

// Helper to find the lowest price product
async function addLowestPriceProduct(page) {
  // Get all product prices
  const prices = await page.$$eval('.inventory_item_price', els => els.map(e => parseFloat(e.textContent.replace('$', ''))));
  const minPrice = Math.min(...prices);
  // Find the index of the lowest price
  const minIndex = prices.indexOf(minPrice);
  // Click the corresponding 'Add to cart' button
  const addButtons = await page.$$('.btn_inventory');
  await addButtons[minIndex].click();
}

test('Login, add lowest price product, and checkout', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', USERNAME);
  await page.fill('#password', PASSWORD);
  await page.click('#login-button');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  await addLowestPriceProduct(page);
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

  await page.click('#checkout');
  // Fill in checkout info (using demo data)
  await page.fill('#first-name', 'Test');
  await page.fill('#last-name', 'User');
  await page.fill('#postal-code', '12345');
  await page.click('#continue');
  await page.click('#finish');
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});
```

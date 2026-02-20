import { test, expect } from '@playwright/test';
import sharp from 'sharp';
import {
  getMatchingProduct,
  transformProducts,
} from '../../src/data/products';
import { checkTruthy } from '../../src/scripts/Utils/typeChecker';

test.describe('ui', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174/index.html');
  });

  test.describe('amazon header', () => {
    test('page icon link can redirect', async ({ page }) => {
      const icon = page.locator('.amazon-link');
      await expect(icon).toBeVisible();
      await icon.click();
      expect(page.url()).toBe('http://localhost:5174/index.html');
    });

    test('page icon link has the right icon', async ({ page }) => {
      const icon = page.locator('.amazon-link');
      const iconScreenShot = await sharp(await icon.screenshot())
        .webp()
        .toBuffer();
      expect(iconScreenShot).toMatchSnapshot(
        '../../images/amazon-logo-white.webp',
      );
    });

    test('has search input', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toBeEditable();
    });

    test('has search button', async ({ page }) => {
      const searchButton = page.locator('.search-button');
      await expect(searchButton).toBeVisible();
    });

    test('search button has the right icon', async ({ page }) => {
      const searchButton = page.locator('.search-button');
      await expect(searchButton).toHaveScreenshot(
        '../../images/icons/search-icon.png',
      );
    });

    test('"Return & Orders" link can redirect', async ({ page }) => {
      const link = page.getByRole('link', { name: 'Returns & Orders' });
      await expect(link).toBeVisible();

      await link.click();
      expect(page.url()).toBe('http://localhost:5174/orders.html');
    });

    test('cart link can redirect', async ({ page }) => {
      const link = page.getByRole('link', { name: 'Cart' });
      await expect(link).toBeVisible();
      await expect(link.locator('.cart-quantity')).toContainText('0');

      await link.click();
      expect(page.url()).toBe('http://localhost:5174/checkout.html');
    });

    test('cart link has the right icon', async ({ page }) => {
      const link = page.getByRole('link', { name: 'Cart' });
      await expect(link).toHaveScreenshot(
        '../../images/icons/cart-icon.png',
      );
    });
  });

  test.describe('products-grid', () => {
    test('product container is visible', async ({ page }) => {
      const productsLocator = page.locator('.product-container');
      await expect(productsLocator).toHaveCount(42);

      const containers = await page.locator('.product-container').all();
      for (const container of containers) {
        await expect(container).toBeVisible();
      }
    });

    test('products image is correct', async ({ page }) => {
      const containers = await page.locator('.product-container').all();
      const rawProducts = (
        await import('../../src/api/rawProducts.json', {
          with: { type: 'json' },
        })
      ).default;
      const clothings = (
        await import('../../src/api/clothing.json', {
          with: { type: 'json' },
        })
      ).default;
      const products = transformProducts(rawProducts, clothings);
      for (const container of containers) {
        const productImage = container.locator('.product-image');
        const productImageScreenshot = await sharp(
          await productImage.screenshot(),
        )
          .webp()
          .toBuffer();

        const productId = await container.evaluate(
          (element) => element.dataset.productId,
        );
        checkTruthy(productId);
        const product = getMatchingProduct(products, productId);
        checkTruthy(product);
        const realProductImage = product.image;
        checkTruthy(realProductImage);
        expect(productImageScreenshot).toMatchSnapshot(realProductImage);
      }
    });
  });
});

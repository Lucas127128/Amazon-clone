import { expect, test } from '@playwright/test';
import { getMatchingProduct, transformProducts } from 'shared/products';
import type { RawProduct } from 'shared/schema';
import { checkNullish } from 'shared/typeChecker';
import sharp from 'sharp';

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
        '../../web/images/amazon-logo-white.webp',
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

    // test('search button has the right icon', async ({ page }) => {
    //   const searchButton = page.locator('.search-button');
    //   await expect(searchButton).toHaveScreenshot(
    //     '../../images/icons/search-icon.svg',
    //   );
    // });

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
      await expect(productsLocator).toHaveCount(43);

      const containers = await page.locator('.product-container').all();
      await Promise.all(
        containers.map(
          async (container) => await expect(container).toBeVisible(),
        ),
      );
    });

    test('products image is correct', async ({ page }) => {
      const containers = await page.locator('.product-container').all();
      const rawProducts = (
        await import('server/rawProducts', {
          with: { type: 'json' },
        })
      ).default;
      const clothings = (
        await import('server/clothing', {
          with: { type: 'json' },
        })
      ).default;
      const products = transformProducts(
        rawProducts as RawProduct[],
        clothings,
      );
      const productsId = await Promise.all(
        containers.map(
          async (container) =>
            await container.evaluate(
              (element) => element.dataset.productId,
            ),
        ),
      );

      const productImageScreenshots = await Promise.all(
        containers.map(async (container) => {
          const productImage = container.locator('.product-image');
          return await sharp(await productImage.screenshot())
            .webp()
            .toBuffer();
        }),
      );
      for (const [index] of containers.entries()) {
        const productImageScreenshot = productImageScreenshots[index];

        const productId = productsId[index];
        checkNullish(productId);
        const product = getMatchingProduct(products, productId);
        checkNullish(product);
        const realProductImage = product.image;
        checkNullish(realProductImage);
        expect(productImageScreenshot).toMatchSnapshot(realProductImage);
      }
    });
  });
});

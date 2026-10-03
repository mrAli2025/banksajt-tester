import { test, expect } from '@playwright/test';

function uniqueUsername() {
  return `e2euser_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

test.describe('Banksajt E2E', () => {
  test('en besökare utan inloggning kan inte se kontosidan eller transaktionshistoriken', async ({ page }) => {
    await page.goto('/account');
    await page.waitForURL('**/login');
    await expect(page.getByRole('button', { name: /logga in/i })).toBeVisible();

    await page.goto('/transactions');
    await page.waitForURL('**/login');
    await expect(page.getByRole('button', { name: /logga in/i })).toBeVisible();
  });

  test('en ny användare kan registrera sig, logga in, sätta in pengar och se rätt saldo och historik', async ({ page }) => {
    const username = uniqueUsername();
    const password = 'test123';

    await page.goto('/register');
    await page.getByLabel(/användarnamn/i).fill(username);
    await page.getByLabel(/lösenord/i).fill(password);
    await page.getByRole('button', { name: /skapa användare/i }).click();

    await page.waitForURL('**/login');
    await page.getByLabel(/användarnamn/i).fill(username);
    await page.getByLabel(/lösenord/i).fill(password);
    await page.getByRole('button', { name: /logga in/i }).click();

    await page.waitForURL('**/account');
    await expect(page.getByText(/saldo: 0 kr/i)).toBeVisible();
    await page.getByLabel(/belopp/i).fill('250');
    await page.getByRole('button', { name: /sätt in pengar/i }).click();
    await expect(page.getByText(/saldo: 250 kr/i)).toBeVisible();

    await page.getByRole('link', { name: /transaktionshistorik/i }).click();
    await page.waitForURL('**/transactions');
    await expect(page.getByText(/250 kr/i).first()).toBeVisible();
  });

  test('historiken finns kvar efter omladdning och ogiltigt belopp ändrar inte saldo eller historik', async ({ page }) => {
    const username = uniqueUsername();
    const password = 'test123';

    await page.goto('/register');
    await page.getByLabel(/användarnamn/i).fill(username);
    await page.getByLabel(/lösenord/i).fill(password);
    await page.getByRole('button', { name: /skapa användare/i }).click();

    await page.waitForURL('**/login');
    await page.getByLabel(/användarnamn/i).fill(username);
    await page.getByLabel(/lösenord/i).fill(password);
    await page.getByRole('button', { name: /logga in/i }).click();
    await page.waitForURL('**/account');

    await page.getByLabel(/belopp/i).fill('100');
    await page.getByRole('button', { name: /sätt in pengar/i }).click();
    await expect(page.getByText(/saldo: 100 kr/i)).toBeVisible();

    await page.reload();
    await expect(page.getByText(/saldo: 100 kr/i)).toBeVisible();

    await page.goto('/login');
    await page.getByLabel(/användarnamn/i).fill(username);
    await page.getByLabel(/lösenord/i).fill(password);
    await page.getByRole('button', { name: /logga in/i }).click();
    await page.waitForURL('**/account');
    await expect(page.getByText(/saldo: 100 kr/i)).toBeVisible();

    await page.getByRole('link', { name: /transaktionshistorik/i }).click();
    await page.waitForURL('**/transactions');
    await expect(page.getByText(/100 kr/i).first()).toBeVisible();

    await page.goto('/account');
    await expect(page.getByText(/saldo: 100 kr/i)).toBeVisible();
    await page.getByLabel(/belopp/i).fill('-50');
    await page.getByRole('button', { name: /sätt in pengar/i }).click();
    await expect(page.getByText(/saldo: 100 kr/i)).toBeVisible();
  });
});
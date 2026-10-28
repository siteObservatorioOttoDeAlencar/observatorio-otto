import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Portal do Observatório — Testes E2E, A11y e Regressão Visual", () => {
  test("Capa de Revista: deve carregar título, telemetria e passar na auditoria WCAG AA", async ({ page }) => {
    await page.goto("/");

    // 1. Verificação de Conteúdo Essencial
    await expect(page).toHaveTitle(/Observatório Digital Otto de Alencar/i);
    await expect(page.locator("h1")).toContainText(/A Fronteira Visível do Universo/i);
    await expect(page.getByText(/FORTALEZA/i).first()).toBeVisible();

    // 2. Auditoria Automatizada de Acessibilidade com Axe
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Navegação: deve transicionar para a página O Céu Hoje", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Explorar a Abóboda Celeste");

    await expect(page).toHaveURL(/\/ceu-hoje/);
  });
});

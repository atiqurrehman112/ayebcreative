import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { services, serviceFAQs } from "../data/services";
import { deliverInquiry } from "../lib/inquiry-delivery";
import { validateInquiry } from "../lib/inquiry";

async function fillBrief(page: Page) {
  await page
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Website QA");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("qa@example.com");
  await page
    .getByRole("checkbox", { name: "Brand Identity", exact: true })
    .check();
  await page
    .getByLabel("Tell us about your project")
    .fill("Local QA inquiry. No external message should be sent.");
}

test("services content, FAQ keyboard interaction, metadata and inquiry links", async ({
  page,
}) => {
  await page.goto("/services");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "WHAT WE CREATE.",
  );
  await expect(page).toHaveTitle("Services — Ayeb Creative");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Services — Ayeb Creative",
  );
  await expect(page.locator(".service-detail")).toHaveCount(6);
  for (const [index, service] of services.entries()) {
    await expect(
      page
        .locator(".service-detail")
        .nth(index)
        .locator(".service-deliverables li"),
    ).toHaveText(service.deliverables);
    await page
      .getByRole("link", {
        name: `${String(index + 1).padStart(2, "0")} ${service.title}`,
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(/\/contact\?service=/);
    await expect(
      page.locator(`input[name="services"][value="${service.title}"]`),
    ).toBeChecked();
    await page.goto("/services");
  }
  for (const faq of serviceFAQs) {
    const summary = page.locator("summary").filter({ hasText: faq.question });
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(faq.answer, { exact: true })).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.getByText(faq.answer, { exact: true })).not.toBeVisible();
  }
  await page
    .locator(".cta-section")
    .getByRole("link", { name: "START A PROJECT" })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page).toHaveTitle("Start a Project — Ayeb Creative");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/contact$/,
  );
});

test("multiple services, budget and launch preferences are preserved in an honest email draft", async ({
  page,
}) => {
  await page.goto("/contact?service=Social%20Media%20Design");
  await fillBrief(page);
  await page.getByLabel("Company / Brand").fill("QA Brand");
  await page.getByLabel("Website", { exact: true }).fill("example.com");
  await page
    .getByLabel("Estimated project budget")
    .selectOption("$1,000–$2,500");
  await page
    .getByLabel("Timeline", { exact: true })
    .selectOption("Specific launch date");
  await page.getByLabel("Intended launch date").fill("2027-06-15");
  await page
    .getByLabel("How did you hear about Ayeb Creative?")
    .fill("A recommendation");
  await page.getByRole("button", { name: "Prepare email inquiry" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Nothing has been sent yet",
  );
  await expect(page.getByRole("status")).toBeFocused();
  const draft = new URL(
    (await page
      .getByRole("link", { name: "Open email draft" })
      .getAttribute("href"))!,
  );
  expect(draft.protocol).toBe("mailto:");
  expect(draft.pathname).toBe("AyebCreative@gmail.com");
  expect(draft.searchParams.get("body")).toContain(
    "Brand Identity, Social Media Design",
  );
  expect(draft.searchParams.get("body")).toContain("$1,000–$2,500");
  expect(draft.searchParams.get("body")).toContain("2027-06-15");
  expect(draft.searchParams.get("body")).toContain("https://example.com/");
  await expect(
    page.getByText("Your project inquiry has been received."),
  ).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Updated QA");
  await expect(
    page.getByRole("link", { name: "Open email draft" }),
  ).toHaveCount(0);
});

test("required, email, website and conditional-date errors are associated with their fields", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Prepare email inquiry" }).click();
  for (const field of ["name", "email", "message"]) {
    await expect(page.locator(`#${field}`)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page.locator(`#${field}`)).toHaveAttribute(
      "aria-describedby",
      `${field}-error`,
    );
  }
  await expect(page.getByRole("checkbox").first()).toHaveAttribute(
    "aria-describedby",
    "services-error",
  );
  await fillBrief(page);
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("invalid-email");
  await page.getByLabel("Website", { exact: true }).fill("javascript:alert(1)");
  await page
    .getByLabel("Timeline", { exact: true })
    .selectOption("Specific launch date");
  await page.getByRole("button", { name: "Prepare email inquiry" }).click();
  await expect(
    page.getByRole("textbox", { name: "Email", exact: true }),
  ).toBeFocused();
  await expect(page.locator("#website-error")).toBeVisible();
  await expect(page.locator("#launchDate-error")).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations.map((item) => item.id)).toEqual([]);
});

test("submitting and success states require an acknowledged response (mock endpoint)", async ({
  page,
}) => {
  let acknowledge: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    acknowledge = resolve;
  });
  await page.route("**/api/inquiry", async (route) => {
    await gate;
    await route.fulfill({ status: 200, json: { status: "received" } });
  });
  await page.goto("/contact");
  await fillBrief(page);
  await page.getByRole("button", { name: "Prepare email inquiry" }).click();
  await expect(page.getByRole("button", { name: "Preparing…" })).toBeDisabled();
  await expect(
    page.getByRole("textbox", { name: "Name", exact: true }),
  ).toBeDisabled();
  await expect(page.getByRole("form")).toHaveAttribute("aria-busy", "true");
  acknowledge();
  await expect(page.getByRole("heading", { name: "THANK YOU." })).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "Your project inquiry has been received.",
  );
  await expect(page.getByRole("status")).toBeFocused();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations.map((item) => item.id)).toEqual([]);
  await page.getByRole("link", { name: "Explore our work" }).click();
  await expect(page).toHaveURL(/\/work$/);
});

test("delivery and network errors retain details and allow retry or an email draft", async ({
  page,
}) => {
  let attempts = 0;
  await page.route("**/api/inquiry", async (route) => {
    attempts += 1;
    if (attempts === 1)
      return route.fulfill({
        status: 422,
        json: {
          status: "error",
          message: "Please check the highlighted fields.",
          errors: { name: "Please check your contact name." },
        },
      });
    if (attempts === 2)
      return route.fulfill({
        status: 502,
        json: {
          status: "error",
          message: "We couldn’t confirm receipt. Please try again.",
        },
      });
    if (attempts === 3) return route.abort("failed");
    return route.fulfill({ status: 200, json: { status: "draft" } });
  });
  await page.goto("/contact");
  await fillBrief(page);
  const submit = page.getByRole("button", { name: "Prepare email inquiry" });
  await submit.click();
  await expect(page.locator("#name-error")).toHaveText(
    "Please check your contact name.",
  );
  await expect(
    page.getByRole("textbox", { name: "Name", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("textbox", { name: "Name", exact: true }),
  ).toBeEnabled();
  await submit.click();
  await expect(page.locator(".inquiry-feedback[role=alert]")).toContainText(
    "couldn’t confirm receipt",
  );
  await expect(
    page.getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Website QA");
  await expect(
    page.getByRole("checkbox", { name: "Brand Identity", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("link", { name: "Open email draft" }),
  ).toBeVisible();
  await submit.click();
  await expect(page.locator(".inquiry-feedback[role=alert]")).toContainText(
    "Check your connection",
  );
  await submit.click();
  await expect(page.getByRole("status")).toContainText(
    "Nothing has been sent yet",
  );
});

test("unconfigured inquiry API returns a draft and validates requests", async ({
  request,
}) => {
  const data = {
    name: "QA",
    email: "qa@example.com",
    services: ["Brand Identity"],
    message: "Local validation check only.",
  };
  const draft = await request.post("/api/inquiry", { data });
  expect(draft.status()).toBe(200);
  expect(await draft.json()).toEqual({ status: "draft" });
  const invalid = await request.post("/api/inquiry", {
    data: { ...data, email: "invalid", services: [] },
  });
  expect(invalid.status()).toBe(422);
  expect((await invalid.json()).errors).toHaveProperty("email");
  expect(
    (
      await request.post("/api/inquiry", {
        data,
        headers: { Origin: "https://unrelated.example" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/inquiry", {
        data: Buffer.from("not json"),
        headers: { "Content-Type": "application/json" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/inquiry", {
        data: { ...data, message: "a".repeat(25_000) },
      })
    ).status(),
  ).toBe(413);
});

test("services FAQs and selected inquiry controls are accessible on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/services");
  await page.locator("summary").first().click();
  let result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations.map((item) => item.id)).toEqual([]);
  await page.goto("/contact");
  await page.getByRole("checkbox", { name: "Logo & Visual Identity" }).focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("checkbox", { name: "Logo & Visual Identity" }),
  ).toBeChecked();
  await page
    .getByLabel("Estimated project budget")
    .selectOption("Not sure yet");
  await page
    .getByLabel("Timeline", { exact: true })
    .selectOption("Specific launch date");
  result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations.map((item) => item.id)).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("delivery adapter requires an explicit provider acknowledgment", async () => {
  const originalEndpoint = process.env.INQUIRY_ENDPOINT;
  const originalKey = process.env.INQUIRY_API_KEY;
  const originalFetch = globalThis.fetch;
  const { values } = validateInquiry({
    name: "QA",
    email: "qa@example.com",
    services: ["Brand Identity"],
    message: "Adapter validation only.",
  });
  try {
    delete process.env.INQUIRY_ENDPOINT;
    expect(await deliverInquiry(values)).toBe("draft");
    process.env.INQUIRY_ENDPOINT = "https://provider.example/inquiries";
    process.env.INQUIRY_API_KEY = "test-only-token";
    globalThis.fetch = async (_url, options) => {
      expect(JSON.parse(options!.body as string)).toEqual(values);
      expect(new Headers(options!.headers).get("Authorization")).toBe(
        "Bearer test-only-token",
      );
      return Response.json({ received: true });
    };
    expect(await deliverInquiry(values)).toBe("received");
    globalThis.fetch = async () => Response.json({ received: false });
    await expect(deliverInquiry(values)).rejects.toThrow(
      "Missing inquiry acknowledgment",
    );
    globalThis.fetch = async () =>
      Response.json({ received: true }, { status: 500 });
    await expect(deliverInquiry(values)).rejects.toThrow(
      "Inquiry was not acknowledged",
    );
    process.env.INQUIRY_ENDPOINT = "http://provider.example/inquiries";
    await expect(deliverInquiry(values)).rejects.toThrow(
      "Invalid inquiry endpoint",
    );
  } finally {
    globalThis.fetch = originalFetch;
    if (originalEndpoint === undefined) delete process.env.INQUIRY_ENDPOINT;
    else process.env.INQUIRY_ENDPOINT = originalEndpoint;
    if (originalKey === undefined) delete process.env.INQUIRY_API_KEY;
    else process.env.INQUIRY_API_KEY = originalKey;
  }
});

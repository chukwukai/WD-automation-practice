import { expect, test } from '@playwright/test';

test.describe('Walker Dunlop Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://suite.walkerdunlop.com');
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test('Verify a user login to the WD app and navigates to their saved dashboard', async ({ page }) => {
    
       /* await page.getByRole('button',  { name: 'Login' }).click();
        await page.getByRole('textbox', { name: 'Email' }).fill('thechuks09@yahoo.com');
        await page.getByRole('textbox', { name: 'Password' }).fill('PassPass123!');
        await page.locator('button[data-test="signInButton"]').click(); 
        expect(page.locator('button[data-test="userPropertiesButton"]')).toBeVisible();
        await page.locator('button[data-test="userPropertiesButton"]').click();
        expect(page.locator('button[data-test="userPropertiesViewButton"]')).toBeVisible(); */
        await page.route('https://evra-backend-api.prod.wdtech.org/evra/v5.11/my-properties?sort_by=created_at', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify([{ 
                "property_id": "457edfd2-f0a2-4803-a472-ec10347a51e5",
                "address_repr": "7272 Wisconsin Ave, Bethesda, MD 20814, USA",
                "city": "Bethesda",
                "state": "MD",
                "street_name": "Wisconsin Avenue",
                "street_number": "7272",
                "postal_code_value": "20814",
                "status": "saved",
                "latitude": 38.98199,
                "longitude": -77.09334,
                "construction_year": null,
                "size_in_units": null,
                "latest_valuation": null,
                "vantage_v3_score_median": null,
                "vantage_v3_score_median_trend_1y": null,
                "consumer_wcs_dpd_30p_trade_ec_rep_last_6m_percentage": null,
                "consumer_wcs_dpd_30p_trade_ec_rep_last_6m_percentage_trend_1y": null,
                "credit_util_trade_rev_open_rep_last_6m_mean": null,
                "credit_util_trade_rev_open_rep_last_6m_mean_trend_1y": null,
                "iq_cr_last_3m_count_mean": null,
                "iq_cr_last_3m_count_mean_trend_1y": null,
                "pay_1m_trade_open_rep_last_6m_mean": null,
                "pay_1m_trade_open_rep_last_6m_mean_trend_1y": null,
                "national_percentile_overall": 0.9104248473305036,
                "national_percentile_housing": 0.7946470392040031,
                "national_percentile_demographics": 0.9398014777744346,
                "national_percentile_amenities": 0.9968260250130733,
                "national_percentile_crime": 0.08090151655071927,
                "created_at": "2026-04-11T16:04:12.275455",
                "neighborhood_rating": "A+",
                "violent_offense_estimated_rate_change_1yr_percentage": 1.5336994914044,
                "property_offense_estimated_rate_change_1yr_percentage": 0.969811924197571
}]),
            });
        });
        //await page.getByPlaceholder('Search by property name or address').fill("7272 Wisconsin Ave, Bethesda, MD, USA", { timeout: 60000 });
        //await page.locator('[data-test="suggestedAddresses"]').click();
        //await page.getByRole('text', {name: 'places-autocomplete-input'}).type("7272 Wisconsin Ave, Bethesda, MD, USA");
        await page.goto('https://suite.walkerdunlop.com/dashboard/');

   });

   test('Verify a user can search for a property and validate the results displays', async ({ page }) => {
        //await expect(page.locator('div[data-test="researchSection"]')).toBeVisible();
        await page.locator('input[data-test="searchInput"]').fill("North Carolina Musemum");
        await page.locator('div[data-test="propertyItem"]').filter({ hasText: /west building/i }).click();
        await expect(page.locator('img[data-test="propertyImage"]')).toHaveAttribute('alt', 'North Carolina Museum of Art West Building');
        await page.locator('li[data-slot="navigation-menu-item"]')
            .filter({ hasText: 'Neighborhood' }) 
            .click();
        const neighborhoodCard = await page.locator('div[data-test="neighborhoodOverallCard"]');
        await expect(neighborhoodCard).toHaveText('Neighborhood OverallA+');
    });

    test('Verify a user search for the property name', async ({ page }) => {
        //await expect(page.locator('div[data-test="researchSection"]')).toBeVisible();
        await page.locator('input[data-test="searchInput"]').fill("7272 Wisconsin Ave, Bethesda, MD, USA");
        await page.locator('div[data-test="propertyItem"]').first().click()
        await expect(page.locator('h2[data-test="propertyName"]')).toHaveText('7272 Wisconsin Ave');
        await page.getByRole('button', {name: 'Save to Dashboard'}).click();
        await page.locator('label[data-test="userPropertiesSaveSavedProperty"]').click();
        await page.locator('button[data-test="userPropertiesSaveConfirm"]').click();
        await expect(page.locator('div[data-test="toastTitle"]')).toHaveText('Property added to Saved Properties');
  });  


  test('Verify property coordinates are displayed correctly', async ({ page }) => {
    // Navigate to research page
    await page.getByRole('link', { name: 'Research & Insights' }).click();
    await expect(page.locator('div[data-test="researchSection"]')).toBeVisible();

    // Search for a property
    await page.locator('input[data-test="searchInput"]').fill("7272 Wisconsin Ave, Bethesda, MD, USA");
    await page.locator('div[data-test="propertyItem"]').first().click();

    // Verify coordinates are displayed (adjust selector based on actual DOM)
    const latitudeElement = page.locator('[data-test="latitude"]');
    const longitudeElement = page.locator('[data-test="longitude"]');

    // Test that coordinates exist and have valid format
    await expect(latitudeElement).toBeVisible();
    await expect(longitudeElement).toBeVisible();

    // Validate coordinate values (if displayed as text)
    const latitudeText = await latitudeElement.textContent();
    const longitudeText = await longitudeElement.textContent();

    // Check if coordinates are valid numbers within expected ranges
    const latitude = parseFloat(latitudeText || '0');
    const longitude = parseFloat(longitudeText || '0');

    expect(latitude).toBeGreaterThanOrEqual(-90);
    expect(latitude).toBeLessThanOrEqual(90);
    expect(longitude).toBeGreaterThanOrEqual(-180);
    expect(longitude).toBeLessThanOrEqual(180);

    // Test specific coordinate values if known
    expect(latitude).toBeCloseTo(38.98, 2); // Approximate latitude for Bethesda, MD
    expect(longitude).toBeCloseTo(-77.09, 2); // Approximate longitude for Bethesda, MD
  });

  test('Verify coordinate-based property search', async ({ page }) => {
    // Test searching by coordinates directly
    const testLat = 38.98199;
    const testLng = -77.09334;

    // Navigate to property page using coordinates
    await page.goto(`https://suite.walkerdunlop.com/property/lat/${testLat}/lng/${testLng}/ChIJyeqQ-HrJt4kRLDr3ciQQqW0/overview`);

    // Verify the property loads correctly
    await expect(page.locator('h2[data-test="propertyName"]')).toBeVisible();

    // Verify coordinates in URL or displayed data match expected values
    const currentUrl = page.url();
    expect(currentUrl).toContain(`lat/${testLat}`);
    expect(currentUrl).toContain(`lng/${testLng}`);
  });
});
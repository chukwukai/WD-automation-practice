import { expect, test } from '@playwright/test';

test.describe('Walker Dunlop Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/'); 
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

   test('Verify a user can search for a property and validate the neighborhood information', async ({ page }) => {
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

    test('Verify a user can save the property to the dashboard', async ({ page }) => {
        await page.locator('input[data-test="searchInput"]').fill("7272 Wisconsin Ave, Bethesda, MD, USA");
        await page.locator('div[data-test="propertyItem"]').first().click()
        await expect(page.locator('h2[data-test="propertyName"]')).toHaveText('7272 Wisconsin Ave');
        await page.getByRole('button', {name: 'Save to Dashboard'}).click();
        await page.locator('label[data-test="userPropertiesSaveSavedProperty"]').click();
        await page.locator('button[data-test="userPropertiesSaveConfirm"]').click();
        await expect(page.locator('div[data-test="toastTitle"]')).toHaveText('Property added to Saved Properties');
  });  



  test('Verify a user can login and view their saved properties using mock data', async ({ page }) => {
        //await expect(page.locator('div[data-test="researchSection"]')).toBeVisible();
        const jsonResponse = [
    {
        "property_id": "457edfd2-f0a2-4803-a472-ec10347a51e5",
        "address_repr": "4279 Wisconsin Ave, Bethesda, MD 20814, USA",
        "city": "Bethesda",
        "state": "MD",
        "street_name": "Wisconsin Avenue",
        "street_number": "4279",
        "postal_code_value": "20814",
        "status": "owned",
        "latitude": 38.98199,
        "longitude": -77.09334,
        "construction_year": 1995,
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
        "created_at": "2026-04-14T01:43:16.364828",
        "neighborhood_rating": "B+",
        "violent_offense_estimated_rate_change_1yr_percentage": 1.5336994914044,
        "property_offense_estimated_rate_change_1yr_percentage": 0.969811924197571
    }
];
        await page.route('*/**/evra/v5.11/my-properties?sort_by=created_at', async route => {
            await route.fulfill({ json: jsonResponse });
        });
        await page.getByRole('button', { name: 'Login' }).click();
        await page.locator('input[data-test="userEmail"]').fill('thechuks09@yahoo.com');
        await page.locator('input[data-test="userPassword"]').fill('PassTest1234!');
        await page.locator('button[data-test="signInButton"]').click();
        await page.locator('form[name="loginForm"]').waitFor({ state: 'hidden' });
        await page.locator('button[data-test="landingPageGoToMyDashboard"]').click();
        await expect(page.locator('button[data-test="propertyAddress"]')).toHaveText(jsonResponse[0].address_repr);
        await expect(page.locator('td[data-test="propertyConstructionYear"]')).toHaveText(jsonResponse[0].construction_year.toString());
        await expect(page.locator('td[data-test="propertyRating"]')).toHaveText(jsonResponse[0].neighborhood_rating);

    });
});

"""Test script for KidPotential app"""
from playwright.sync_api import sync_playwright
import time

def test_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        print("Opening http://localhost:5174/")
        page.goto('http://localhost:5174/')
        page.wait_for_load_state('networkidle')

        # Take screenshot of homepage
        page.screenshot(path='D:/CODE/brain_opencodeCursor/test_screenshots/01_homepage.png')
        print("Screenshot saved: 01_homepage.png")

        # Check for disclaimer modal
        time.sleep(1)
        if page.locator('text=重要声明与使用须知').count() > 0:
            print("Found disclaimer modal")
            page.screenshot(path='D:/CODE/brain_opencodeCursor/test_screenshots/02_disclaimer.png')
            print("Screenshot saved: 02_disclaimer.png")

            # Accept disclaimer
            page.check('input[type="checkbox"]')
            page.click('text=我已了解并同意，开始测评')
            page.wait_for_timeout(500)
            print("Accepted disclaimer")

        # Check for norm collection prompt
        if page.locator('text=邀请您参与常模数据收集').count() > 0:
            print("Found norm collection prompt")
            page.screenshot(path='D:/CODE/brain_opencodeCursor/test_screenshots/03_norm_prompt.png')
            print("Screenshot saved: 03_norm_prompt.png")

            # Accept norm collection
            page.check('input[type="checkbox"]')
            page.click('text=我同意参与')
            page.wait_for_timeout(500)
            print("Accepted norm collection")

        # Click start button
        page.click('text=开始探索')
        page.wait_for_load_state('networkidle')
        print("Navigated to profile page")

        # Take screenshot of profile page
        page.screenshot(path='D:/CODE/brain_opencodeCursor/test_screenshots/04_profile.png')
        print("Screenshot saved: 04_profile.png")

        # Fill profile form
        page.fill('input[placeholder*="姓名"]', '测试儿童')
        page.select_option('select', '10')
        page.click('button:has-text("男")')
        print("Filled profile: name=测试儿童, age=10, gender=male")

        page.wait_for_timeout(500)
        page.screenshot(path='D:/CODE/brain_opencodeCursor/test_screenshots/05_profile_filled.png')

        # Click continue
        page.click('text=继续')
        page.wait_for_load_state('networkidle')
        print("Navigated to questionnaire page")

        page.screenshot(path='D:/CODE/brain_opencodeCursor/test_screenshots/06_questionnaire_intro.png')
        print("Screenshot saved: 06_questionnaire_intro.png")

        print(f"Current URL: {page.url}")
        print(f"Page title: {page.title()}")

        browser.close()
        print("\n=== Test completed ===")
        print("Check screenshots in: D:/CODE/brain_opencodeCursor/test_screenshots/")

if __name__ == '__main__':
    test_app()

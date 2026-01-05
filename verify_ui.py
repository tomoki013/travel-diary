
import os
from playwright.sync_api import sync_playwright

def verify_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Verify Journey Page
        print("Navigating to /journey...")
        try:
            page.goto("http://localhost:3000/journey", timeout=60000)
            page.wait_for_selector("h1:has-text('Journey History')", timeout=10000)
            # Wait for animation
            page.wait_for_timeout(2000)
            page.screenshot(path="verification_journey.png", full_page=False)
            print("Captured verification_journey.png")
        except Exception as e:
            print(f"Error on /journey: {e}")

        # Verify Contact Page
        print("Navigating to /contact...")
        try:
            page.goto("http://localhost:3000/contact", timeout=60000)
            page.wait_for_selector("h1:has-text('お問い合わせ')", timeout=10000)
            page.screenshot(path="verification_contact.png", full_page=True)
            print("Captured verification_contact.png")
        except Exception as e:
            print(f"Error on /contact: {e}")

        browser.close()

if __name__ == "__main__":
    verify_ui()

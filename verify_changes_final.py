import time
from playwright.sync_api import sync_playwright, expect

def verify_changes(page):
    # Navigate to home to check footer
    page.goto("http://localhost:3001", timeout=60000)

    # Scroll to footer
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

    # Check Footer Column 4 Title
    # The new title is "お問い合わせ・サポート"
    support_heading = page.get_by_role("heading", name="お問い合わせ・サポート")
    expect(support_heading).to_be_visible()

    # Check items in the column
    # FAQ, Contact, Article Theme Request
    # We check if these links are present.
    # Note: They are inside the column, but checking global visibility in footer context is enough for this verification.
    expect(page.get_by_role("link", name="FAQ", exact=True)).to_be_visible()
    expect(page.get_by_role("link", name="お問い合わせ", exact=True)).to_be_visible()
    expect(page.get_by_role("link", name="記事テーマ募集", exact=True)).to_be_visible()

    # Check that "機能要望・バグ報告" is NOT visible
    expect(page.get_by_role("link", name="機能要望・バグ報告")).not_to_be_visible()

    # Take screenshot of Footer
    page.screenshot(path="verification_footer_final.png")

    # Navigate to FAQ page
    page.goto("http://localhost:3001/faq", timeout=60000)

    # Check for new questions
    expect(page.get_by_text("お問い合わせ方法は？")).to_be_visible()
    expect(page.get_by_text("記事の寄稿やコラボレーションは可能ですか？")).to_be_visible()

    # Check that AI questions are GONE
    expect(page.get_by_text("AIトラベルプランナーは無料ですか？")).not_to_be_visible()

    # Take screenshot of FAQ
    page.screenshot(path="verification_faq_final.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_changes(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification_failure_final.png")
            raise e
        finally:
            browser.close()

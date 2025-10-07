from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Geliştirme sunucusunun çalıştığı adrese git
        page.goto("http://localhost:5173", timeout=60000)

        # Dashboard sayfasının başlığını kontrol et
        expect(page.get_by_role("heading", name="Ana Gösterge Paneli")).to_be_visible(timeout=30000)

        # Ekran görüntüsü al
        page.screenshot(path="jules-scratch/verification/verification.png")
        print("Ekran görüntüsü başarıyla alındı.")

    except Exception as e:
        print(f"Bir hata oluştu: {e}")
        # Hata durumunda da ekran görüntüsü alarak durumu görelim
        page.screenshot(path="jules-scratch/verification/error.png")
        print("Hata ekran görüntüsü alındı.")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)
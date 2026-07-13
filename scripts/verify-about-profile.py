"""Verify About Profile stays visible beside the featured Omni AI video."""
from playwright.sync_api import sync_playwright

URL = "https://cyrhiel.vercel.app/?v=about-verify2"
SHOT = "C:/Users/Cyrhiel/Music/cyrhielportfolio/portfolio/.tmp-about-verify.png"

EXPECTED_FRAGMENTS = [
    "Architecture",
    "graduate",
    "Ubujan",
    "structures and systems",
    "passive income",
    "faster than traditional IT",
    "Websites",
    "Android APK",
    "PisoWiFi",
    "Brief me",
    "Omni AI Builder",
    "#1 SOFTWARE MADE SO FAR",
]


def scroll_about_to_featured(page):
    about = page.locator("#about")
    about.wait_for(state="attached", timeout=30000)
    top = about.evaluate(
        "el => el.getBoundingClientRect().top + window.scrollY"
    )
    height = about.evaluate("el => el.offsetHeight")
    # Mid-late About scroll: featured on, sticky still holding
    target = int(top + height * 0.62)
    page.evaluate("([y]) => window.scrollTo(0, y)", [target])
    page.wait_for_timeout(1600)


def main():
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))

        page.goto(URL, wait_until="networkidle", timeout=90000)
        page.wait_for_timeout(500)
        scroll_about_to_featured(page)
        page.screenshot(path=SHOT, full_page=False)

        about = page.locator("#about")
        text = about.inner_text()

        profile = about.get_by_text("Architecture", exact=False)
        featured = about.get_by_text("Omni AI Builder", exact=False)
        video = about.locator("video").last

        profile_visible = profile.first.is_visible()
        featured_visible = featured.first.is_visible()
        video_visible = video.is_visible() if video.count() else False

        profile_box = profile.first.bounding_box() if profile_visible else None
        video_box = video.bounding_box() if video_visible else None

        side_by_side = False
        if profile_box and video_box:
            side_by_side = (
                profile_box["x"] + profile_box["width"] / 2 < video_box["x"]
                and abs(
                    (profile_box["y"] + profile_box["height"] / 2)
                    - (video_box["y"] + video_box["height"] / 2)
                )
                < 520
            )

        missing = [
            s for s in EXPECTED_FRAGMENTS if s.lower() not in text.lower()
        ]

        profile_style = page.evaluate(
            """() => {
              const root = document.querySelector('#about');
              if (!root) return null;
              const h2 = [...root.querySelectorAll('h2')].find(el =>
                (el.getAttribute('aria-label') || el.textContent || '')
                  .includes('Architecture graduate')
              );
              if (!h2) return { found: false };
              const style = getComputedStyle(h2);
              const rect = h2.getBoundingClientRect();
              return {
                found: true,
                opacity: style.opacity,
                visibility: style.visibility,
                inViewport: rect.top < innerHeight && rect.bottom > 56 && rect.left < innerWidth,
                x: Math.round(rect.x),
                y: Math.round(rect.y),
              };
            }"""
        )

        print("=== About Profile Playwright verify ===")
        print(f"url: {URL}")
        print(f"profile visible: {profile_visible}")
        print(f"featured title visible: {featured_visible}")
        print(f"featured video visible: {video_visible}")
        print(f"side-by-side (profile left of video): {side_by_side}")
        print(f"profile style: {profile_style}")
        print(f"missing strings ({len(missing)}): {missing}")
        print(f"page errors: {errors}")
        print(f"screenshot: {SHOT}")
        print("--- text sample ---")
        print(text[:1100])

        ok = (
            profile_visible
            and featured_visible
            and video_visible
            and side_by_side
            and not missing
            and (profile_style or {}).get("found") is True
            and (profile_style or {}).get("opacity") not in ("0",)
            and (profile_style or {}).get("visibility") != "hidden"
            and (profile_style or {}).get("inViewport") is True
            and not errors
        )
        print(f"RESULT: {'PASS' if ok else 'FAIL'}")
        browser.close()
        raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main()

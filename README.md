# Dabara & Co. · DTC landing page with built-in growth instrumentation

**[Live demo](https://yashsarkar1806-creator.github.io/dabara-coffee-landing/)** · **[Marketer view](https://yashsarkar1806-creator.github.io/dabara-coffee-landing/?admin=1)** · **[Brand & GTM brief](docs/brand-strategy.md)**

A conversion-focused landing page for **Dabara & Co.**, a *fictional* direct-to-consumer South Indian filter-coffee
subscription aimed at India and the Indian diaspora in Australia and the UAE. It's built the way a growth marketer
would want a launch page: every section has a job, and every interaction is measurable.

> Dabara & Co. is a made-up brand created for this portfolio. Reviews on the page are labelled sample copy and no
> data is sent anywhere.

## What it shows
| Marketing skill | Where it lives |
|---|---|
| **Positioning and messaging** | Brand brief with personas, positioning statement and brand voice ([docs/brand-strategy.md](docs/brand-strategy.md)) |
| **A/B testing** | Two headline variants (functional vs emotional), sticky per visitor, forceable with `?v=a` / `?v=b`, saved on every lead |
| **Attribution** | First-touch UTM capture (`utm_source`, `utm_medium`, `utm_campaign`…) stored with each lead |
| **Lead capture** | Waitlist form with validation, a market field and an incentive code |
| **Interactive conversion** | 3-question blend quiz that recommends one of three blends |
| **Pricing and AOV** | Subscription builder with INR/AUD markets, frequency discounts, free-shipping thresholds and cost per cup |
| **Analytics tagging** | GA4-style `dataLayer` events: `page_view_variant`, `quiz_complete`, `add_to_cart`, `generate_lead`, `faq_open`, `scroll_depth` |
| **Reporting** | `?admin=1` marketer view: lead count, A/B split, live event log and CSV export |

## Try it
1. Open the [live demo with a campaign link](https://yashsarkar1806-creator.github.io/dabara-coffee-landing/?utm_source=instagram&utm_medium=paid_social&utm_campaign=diwali_launch&admin=1).
2. Take the quiz, toggle India/Australia, and join the waitlist.
3. Scroll to the marketer view to see the events fire and export a CSV of the lead with its UTMs and headline variant.

## Run locally
It's plain HTML, CSS and JavaScript, no build step:
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Tests
Pricing, quiz scoring, A/B assignment, UTM parsing and CSV export are unit-tested, and a DOM test loads the real page
in [jsdom](https://github.com/jsdom/jsdom) and walks through the quiz, market toggle and lead capture.
```bash
npm install && npm test
```

## Project structure
```
index.html            page markup
css/style.css         styles
js/logic.js           pure, testable logic (pricing, quiz, A/B, UTMs, CSV)
js/app.js             page wiring and dataLayer events
docs/brand-strategy.md  brand, GTM, pricing and metrics brief
tests/                node:test unit and DOM tests
```

## License
MIT, see [LICENSE](LICENSE).

---
Built by **Yash Sarkar** · Master of Marketing (UWA) · GA4 and Google Ads certified · part of my
[daily portfolio builds](https://github.com/yashsarkar1806-creator/marketing-ai-ideas#daily-builds).

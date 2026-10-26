# Dabara & Co. · brand and go-to-market brief

> **Fictional brand.** Everything here is a concept written for a portfolio. Prices, targets and personas are
> planning assumptions, not market research results or real company data.

## 1. The problem
South Indian filter coffee ("filter kaapi") is a daily ritual for millions of people, but the good stuff is hard to get:
* Supermarket filter-coffee powder is often stale, because it is ground months before it is opened.
* People who have moved away from home (to Pune, Delhi, Dubai, Melbourne, Perth) can't easily buy from a local roaster.
* Brewing a proper decoction in a steel filter takes 15 to 20 minutes, which doesn't fit a weekday morning.

## 2. Target customers
| Persona | Who | What they want | Where to reach them |
|---|---|---|---|
| **The homesick professional** (primary) | 25 to 40, South Indian, living in another Indian metro or abroad (UAE, Australia) | The taste of home without a trip to a speciality store | Instagram Reels, community WhatsApp groups, Tamil/Telugu/Kannada creator content |
| **The speciality-coffee explorer** | 22 to 35, urban, already buys DTC coffee | A new brew method and origin story | Coffee subreddits and YouTube, speciality-coffee newsletters |
| **The gifter** | Any age, festival season | A culturally meaningful gift box | Google Shopping, Diwali and Pongal gift guides |

## 3. Positioning
**For** South Indians away from home and curious coffee drinkers **who** miss a properly thick, frothy filter kaapi,
**Dabara & Co. is** a filter-coffee subscription **that** roasts and grinds to order and ships within 72 hours,
**unlike** supermarket powders that sit on shelves for months.

**Brand pillars:** freshness you can taste, heritage without nostalgia overload, and a 4-minute ritual.

**Voice:** warm, a little cheeky, fluent in "amma" and "decoction", never twee.

## 4. Messaging test (built into the page)
The landing page runs a 50/50 headline test, with the variant stored per visitor and attached to every lead:
* **A, the functional benefit:** "Real South Indian filter coffee, without the 20-minute ritual."
* **B, the emotional/identity hook:** "Your amma's filter kaapi. Delivered."

**Hypothesis:** B will win with the homesick-professional persona (paid social), A with the speciality explorer
(search). The decision metric is waitlist conversion rate by variant and `utm_source`, read only after a pre-set
sample size (for example, at least 400 visitors per variant for a 5-point lift from a 10% baseline at 80% power).

## 5. Go-to-market (first 90 days, concept)
1. **Weeks 1 to 4, waitlist:** this landing page, ₹15%-off first-bag code, 20 micro-creators (10k to 50k followers) from Chennai, Bengaluru and Hyderabad posting brew Reels.
2. **Weeks 5 to 8, India launch:** subscriptions live; referral credit of one free bag per two friends; Google Shopping for "filter coffee powder".
3. **Weeks 9 to 12, diaspora pilot:** Australia (A$ pricing already in the builder) via Indian grocery partnerships and community events, and a UAE gift box ahead of Diwali.

## 6. Pricing logic
| | India | Australia |
|---|---|---|
| 250 g bag | ₹549 | A$19 |
| Shipping on one-off orders | ₹79, free from 2 bags | A$9, free from 3 bags |
| Monthly subscription | 10% off, free shipping | 10% off, free shipping |
| Fortnightly subscription | 15% off, free shipping | 15% off, free shipping |

Subscriptions get free shipping because a subscriber is worth many one-off orders. The builder shows **cost per cup**
(assuming 30 cups a bag) to reframe a premium price against a café filter coffee.

## 7. Metrics and instrumentation
Every interaction pushes a GA4-style event to `window.dataLayer`, ready for Google Tag Manager:

| Event | Fires when | Used for |
|---|---|---|
| `page_view_variant` | Page loads | Headline test denominator |
| `quiz_complete` | Quiz submitted | Engagement and blend demand |
| `select_market` | Currency toggled | Market interest (India vs Australia) |
| `add_to_cart` | Builder CTA | Purchase intent, AOV and frequency mix |
| `generate_lead` | Valid email submitted | Primary conversion |
| `faq_open` | FAQ expanded | Objections to answer higher on the page |
| `scroll_depth` | 50% and 90% | Content engagement |

**North-star metric:** active subscribers. **Launch KPIs (planning targets, not results):** waitlist conversion rate,
cost per lead by creator, quiz-to-lead rate, and share of subscriptions chosen over one-off orders.

# Nexus 2026 Daily Brief - Mock-up Outline

## Design Philosophy
* **Aesthetic**: Cyber-Glass / Premium Dark Mode. Deep indigo backgrounds (`#0a0a1f`) with neon accents for status (Cyan for Info, Amber for Warning, Rose for Critical).
* **Interaction**: Cards float and expand on hover. Background has a subtle "breathing" gradient animation.

## Layout Grid (Dashboard)

### Zone 1: The Morning Download (Top Hero Section)
* **Component**: `DailySummaryCard`
* **Content**:
  * "Good Morning, [Manager Name]."
  * **Sentiment Ticker**: Rolling text of key market movements affecting top 3 customers.
  * **Critical Action Count**: Large number (e.g., "3") indicating immediate blockers.
* **Visuals**: Large typography, subtle weather/global-map background effect.

### Zone 2: Customer Pulse (Left Column - 60% Width)
* **Component**: `CustomerNewsFeed`
* **Structure**: Masonry grid of `NewsCard`s.
* **Card Details**:
  * **Header**: Company Logo + Stock Shift (e.g., "+2.4%").
  * **Headline**: Summarized by AI (e.g., "RetailCo announces major migration to GCP").
  * **Impact Analysis**: "High Opportunity - Potential for GKE expansion." (AI generated).
  * **Action**: "Schedule Sync" button.

### Zone 3: Operational Health (Right Column - 40% Width)
* **Component**: `TeamStatusRail`
* **Content**:
  * **Blocker Alerts**: List of active red-flag projects.
    * _Example_: "FinTech App - Capacity Constraint (Needs Spanner Expert)."
  * **Talent Highlights**: "Sarah just got Certified in Gemini Pro!" (Celebration card).
  * **Upcoming Renewals**: Timeline view of contracts expiring in <90 days.

## Interaction Flow
1. **Load**: Elements stagger-fade in.
2. **Hover**: News cards lift (`translateY(-4px)`), glow intensity increases.
3. **Click**: Expanding a News Card opens a "War Room" modal with detailed analysis and "Assign Team" quick actions.

## Mobile View (Responsive)
* Stacked layout: Summary -> Alerts -> News.
* Swipe gestures to dismiss news items or "save for later".

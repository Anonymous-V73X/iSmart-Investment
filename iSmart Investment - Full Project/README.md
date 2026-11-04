# Week 01 Progress Report: My Platform Frontend & Investor Experience

**Project Name:** iSmart Investment Platform  
**Milestone:** Week 01 – Frontend Foundation, Brand Landing Page & Investor Portal  
**Year:** 2026  
**Author / Builder:** MORIS KARANI  
**Status:** Completed & Ready for Review  

---

## 1. My Overview & Objectives for Week 01

This week, I set out to build and deliver the complete frontend experience for **iSmart Investment**. My goal for Week 01 was to establish a polished, trustworthy public presence to convert prospective investors, alongside the primary authenticated user interfaces: the Investor Dashboard, User Profile, and Investment Packages catalog.

I have assembled all components, responsive styling, brand assets, and scripts into this clean, self-contained `Week 01 progress/` folder so it can be demonstrated and reviewed independently.

---

## 2. What I Built & Accomplished This Week

### A. High-Converting Landing Page & Public Presence
I built the public landing page to clearly communicate the iSmart value proposition and ensure full mobile and desktop responsiveness:

- **Hero & Core Messaging:** Designed the hero section with my core tagline: *"Invest Today, Prosper Tomorrow"*, paired with high-impact 3D investment growth illustrations.
- **Immediate Call-to-Actions (CTAs):** Integrated clear action buttons directing new visitors to register (*"Get Started"*) and existing investors to sign in (*"Login"*).
- **Core Value Highlights:** Built structured value cards showcasing key financial pillars:
  - **+35% Weekly Profit Target:** Prominently featured earning projections to build investor confidence.
  - **Capital Protection & Growth:** Reassuring value-assurance statements.
  - **Fast Liquidity & Withdrawals:** Visualized prompt turnaround workflows.
- **Social Proof & Interactive Elements:** Integrated an automated investor testimonial slider using `Owl Carousel 2` and smooth scroll-triggered entrance animations via `AOS`.
- **Branding & Layout:** Standardized 2026 copyright footers, quick links, and responsive navigation across all screen sizes.

### B. Member Authentication Flows
- **Login Portal (`login/index.html`):** Developed a clean sign-in screen with form validation, error handling, and password reset flows.
- **Registration Interface (`register/index.html`):** Implemented client-side input validation for usernames, password matching, and email pattern verification.

### C. Investor Dashboard (`login/dashboard/`)
I built the main member control panel to give users a comprehensive view of their finances:
- **Key Financial Metrics:** Created visual metric cards displaying **Account Balance**, **Active Investments**, **Total Profit**, and **Referral Bonuses**.
- **Quick-Access Navigation:** Built quick-navigation tabs to allow members to jump directly to **Packages**, **Profile**, **Transactions**, and **Withdrawals**.
- **Responsive Layout:** Developed a collapsable sidebar navigation tailored for smooth mobile and desktop browsing.

### D. Investment Packages Catalog (`login/packages/`)
- **Tiered Investment Plans:** Created package comparison cards displaying deposit limits, percentage returns, investment durations, and active plan indicators.
- **Action Triggers:** Designed one-click package selection modals ready for user funding.

### E. User Profile Management (`login/profile/`)
- **Investor Identity Card:** Created a clean summary card displaying the member's username, verified email, phone number, unique account UID, and registration date.
- **Account Settings Interface:** Formatted the layout to support personal detail updates and security settings.

---

## 3. Directory Layout for My Week 01 Deliverables

I organized all files for this milestone in the `Week 01 progress/` directory:

```text
Week 01 progress/
├── index.html                  # My public landing page (2026 edition)
├── README.md                   # My progress report & project documentation
├── css/                        # My styles, custom themes & responsive rules
├── js/                         # My landing page interactions & animations
├── img/                        # 3D assets, illustration graphics & user avatars
├── vendor/                     # Supporting UI libraries (Bootstrap, jQuery, OwlCarousel)
├── register/                   # My user registration interface
└── login/
    ├── index.html              # My member login interface
    ├── login.css & js          # Authentication styles & scripts
    ├── dashboard/              # My investor dashboard interface
    ├── profile/                # My investor profile management interface
    ├── packages/               # My investment packages catalog
    ├── transactions/           # Transaction history interface preview
    └── withdraw/               # Withdrawal request interface preview
```

---

## 4. How to Preview My Work

1. Open `index.html` inside the `Week 01 progress/` folder directly in any browser.
2. Explore the landing page sections and click the navigation links.
3. Access each member interface directly:
   - **Register:** `./register/index.html`
   - **Login:** `./login/index.html`
   - **Dashboard:** `./login/dashboard/index.html`
   - **Packages:** `./login/packages/index.html`
   - **Profile:** `./login/profile/index.html`
4. Toggle device view (F12 in Chrome/Edge) to test my mobile and tablet responsive layouts.

---

## 5. Backend Architecture & My Firebase Configuration

I have structured the frontend to communicate with **Firebase Authentication** and **Firebase Realtime Database (RTDB)**. 

### My Firebase Config Setup
To maintain full ownership and privacy over user credentials, balances, and transaction records, I have configured my project connection across these scripts:

- `login/firebase-login.js`
- `register/firebase-register.js`
- `login/dashboard/refresh.js`
- `login/packages/refresh.js`
- `login/profile/refresh.js`
- `login/transactions/refresh.js`
- `login/withdraw/refresh.js`

Here is where my configuration object is loaded:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 6. What I Plan to Tackle in Week 02

- **Package Activation Engine:** Implement interactive investment confirmation modals on package cards with automated balance verification and deduction.
- **Deposit & Top-up Flow via M-Pesa:** Add an intuitive "Fund Account" interface allowing investors to submit deposit requests directly to their transaction feed.
- **Dynamic Yield & Maturity Calculations:** Transition profit accrual logic from static calendar offsets to individualized investment start timestamps.
- **End-to-End Database Validation:** Perform live testing of the complete investor journey (registration, package purchase, and withdrawal requests) on the connected Firebase database (`i-smart-600b9`).

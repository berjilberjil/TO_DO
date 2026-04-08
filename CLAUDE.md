@AGENTS.md

# Task Manager — Full Documentation

## Overview

A production-ready Task Manager web application built with Next.js (App Router), Tailwind CSS, Framer Motion, and Razorpay payment integration. Features include animated mascot characters, goal tracking, dark mode, simulated auth with OTP recovery, PDF export, and mobile-optimized PWA support.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Characters**: Lottie (lottie-react) + SVG fallback system
- **Payments**: Razorpay (live integration)
- **PDF Export**: jsPDF + jspdf-autotable
- **Date Utilities**: date-fns
- **Progress Rings**: react-circular-progressbar
- **State**: React useState + useEffect
- **Data**: In-memory API + localStorage hybrid persistence
- **Deploy Target**: Vercel (PWA-ready)

---

## Environment Variables

Stored in `.env.local` (gitignored):

```
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
NEXT_PUBLIC_RAZORPAY_KEY_ID=<your_razorpay_key_id>
```

**IMPORTANT**: Never commit API keys. Rotate keys if exposed.

---

## File Structure

```
app/
  page.tsx                        # Dashboard (protected) — task CRUD, stats, clock, mascot
  layout.tsx                      # Root layout with PWA metadata, font loading, AppShell
  globals.css                     # Tailwind base with dark mode custom variant
  login/page.tsx                  # Login form with mascot + forgot password link
  signup/page.tsx                 # Signup form with phone field + mascot
  forgot-password/page.tsx        # OTP request via email or phone
  reset-password/page.tsx         # New password form with token verification
  profile/page.tsx                # User profile, stats, inline name edit (protected)
  settings/page.tsx               # Theme, notifications, data export, account (protected)
  goals/page.tsx                  # Goal CRUD with progress rings + countdown (protected)
  pricing/page.tsx                # Free vs Pro with live Razorpay checkout
  privacy/page.tsx                # Privacy policy
  terms/page.tsx                  # Terms of service
  api/
    tasks/route.ts                # GET, POST, PUT, DELETE — in-memory task store
    goals/route.ts                # GET, POST, PUT, DELETE — in-memory goal store
    payment/route.ts              # Creates Razorpay order
    payment/verify/route.ts       # Verifies Razorpay payment signature

components/
  AppShell.tsx                    # Auth guard + sidebar/mobile nav wrapper
  Mascot.tsx                      # Lottie animated character with SVG fallback
  Header.tsx                      # Top bar with theme toggle + avatar
  Sidebar.tsx                     # Desktop sidebar navigation (w-64)
  MobileNav.tsx                   # Mobile bottom tab bar
  TaskInput.tsx                   # Task input with priority pills + due date
  TaskItem.tsx                    # Animated task card with priority badge + overdue
  TaskList.tsx                    # Filtered/searched task list with AnimatePresence
  FilterBar.tsx                   # All/Active/Done filter tabs with counts
  SearchBar.tsx                   # Debounced search input (300ms)
  EmptyState.tsx                  # Mascot-powered empty state messages
  Toast.tsx                       # Animated toast notifications (auto-dismiss 3s)
  GoalCard.tsx                    # Goal card with progress ring + timer
  GoalTimer.tsx                   # Countdown timer with clock animation
  ClockAnimation.tsx              # Live SVG analog clock with animated hands
  ProgressRing.tsx                # Circular progress bar wrapper
  ThemeToggle.tsx                 # Animated sun/moon icon toggle
  ExportPDF.tsx                   # PDF export button using jsPDF
  RazorpayCheckout.tsx            # Razorpay payment flow component

lib/
  auth.ts                         # Simulated auth: login, signup, logout, OTP, password reset
  storage.ts                      # localStorage helpers for tasks + goals
  themes.ts                       # Dark/light/system theme management

public/
  manifest.json                   # PWA web app manifest
```

---

## Data Models

### Task
```typescript
{
  id: number,
  title: string,           // required, max 200 chars
  completed: boolean,       // default false
  createdAt: string,        // ISO timestamp
  priority: "low" | "medium" | "high",  // default "medium"
  dueDate: string | null,   // optional ISO date
  goalId: number | null      // optional link to a goal
}
```

### Goal
```typescript
{
  id: number,
  title: string,
  description: string,
  targetDate: string,       // ISO date
  createdAt: string,
  tasks: number[],          // linked task IDs
  completed: boolean
}
```

### User (localStorage)
```typescript
{
  id: string,
  name: string,
  email: string,
  phone?: string,
  createdAt: string
}
```

---

## API Routes

| Method | Endpoint             | Description                    |
|--------|----------------------|--------------------------------|
| GET    | /api/tasks           | Return all tasks               |
| POST   | /api/tasks           | Create task (body: {title, priority, dueDate}) |
| PUT    | /api/tasks?id=N      | Toggle task.completed          |
| DELETE | /api/tasks?id=N      | Delete task (id=-1 clears all) |
| GET    | /api/goals           | Return all goals               |
| POST   | /api/goals           | Create goal                    |
| PUT    | /api/goals?id=N      | Toggle goal.completed          |
| DELETE | /api/goals?id=N      | Delete goal                    |
| POST   | /api/payment         | Create Razorpay order          |
| POST   | /api/payment/verify  | Verify payment signature       |

---

## Authentication Flow

1. **Signup**: Creates user in localStorage `tm_users` array, sets `tm_user` as current session
2. **Login**: Validates email/password against `tm_users`, sets `tm_user`
3. **Auth Guard**: `AppShell.tsx` checks `isLoggedIn()` on every protected route, redirects to `/login`
4. **Logout**: Clears `tm_user`, redirects to `/login`
5. **Forgot Password**: Choose email or phone → receive 6-digit OTP (simulated, shown in UI) → verify OTP → get reset token
6. **Reset Password**: Use token to set new password

Public routes (no auth required): `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/pricing`, `/privacy`, `/terms`

---

## Payment Integration (Razorpay)

1. User clicks "Upgrade to Pro" on `/pricing`
2. Frontend calls `POST /api/payment` to create an order (₹500)
3. Razorpay checkout modal opens with order details
4. On payment success, frontend calls `POST /api/payment/verify` with signature
5. Server verifies HMAC signature against secret key
6. On verification, `tm_pro` flag is set in localStorage
7. Pro status is reflected in the pricing page UI

---

## Mascot System

The mascot uses a multi-layer fallback system:
1. **Primary**: Tries Lottie animation URLs (multiple CDN fallbacks)
2. **Fallback**: Animated SVG characters with mood-specific expressions and animations

Moods and their triggers:
- **idle**: Default state on dashboard, profile
- **celebrate**: Task completed, goal completed, payment success, signup success
- **think**: Login page, forgot password, search with no results
- **sad**: Empty task list, empty goals list

Each mascot includes an animated speech bubble with contextual messages.

---

## Dark Mode

- Uses Tailwind v4 `@custom-variant dark` with class strategy
- Theme stored in localStorage key `tm_theme`
- Three modes: Light, Dark, System (follows OS preference)
- Toggle available in Header (all pages) and Settings page
- All components include `dark:` variants for backgrounds, text, borders

---

## Mobile Optimization

- **Responsive breakpoints**: 375px (mobile) to 1280px (desktop)
- **PWA manifest**: `public/manifest.json` with standalone display mode
- **Apple Web App**: Meta tags for iOS home screen support
- **Viewport**: Locked scale for native app feel
- **Navigation**: Sidebar on desktop (md:), bottom tab bar on mobile
- **Content padding**: `pb-20` on mobile to clear bottom nav

---

## Export Features

- **JSON Export**: Downloads all tasks as formatted JSON file (Settings page)
- **PDF Export**: Professional PDF with task table, stats summary, color-coded priorities (Dashboard + Settings)

---

## Running the App

```bash
npm install
npm run dev        # Development server at localhost:3000
npm run build      # Production build
npm start          # Production server
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables in Vercel dashboard:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
4. Deploy

---

## Key Conventions

- No `alert()` or `console.log()` for user feedback — always Toast or inline errors
- Optimistic UI for toggle and delete operations
- All forms validate inline with error text below inputs
- Framer Motion on all page transitions, list items, buttons, modals
- No page reloads on any action — all CRUD via fetch
- localStorage is backup persistence; in-memory arrays are source of truth during session

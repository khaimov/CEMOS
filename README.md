# Nexus 2026 - Outcome CE Operating System

## Overview
Nexus 2026 is an AI-orchestrated interface designed for Outcome CE Managers. It unifies customer intelligence, talent capabilities, and execution velocity into a single, high-fidelity dashboard.

## Features
*   **Strategic Pulse**: Real-time news ticker and sentiment analysis.
*   **Talent Matrix**: Visual skills gap analysis and team capabilities.
*   **Velocity Engine**: Revenue forecasting and execution tracking.

## Tech Stack
*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS + Custom "Glassmorphic" Design System
*   **Animation**: Framer Motion
*   **Charts**: Recharts

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open Browser**:
    Navigate to `http://localhost:3000` (or the port shown in terminal).

## Design System
The project uses a custom "Cyber-Glass" aesthetic with:
*   Deep indigo backgrounds (`#0a0a1f`)
*   Neon accents (Cyan, Pink, Amber)
*   Backdrop blur effects for glass panels

## Key Directories
*   `app/page.tsx`: Landing Page
*   `app/pulse/page.tsx`: Daily Brief Dashboard
*   `app/talent/page.tsx`: Skills Matrix
*   `app/velocity/page.tsx`: Forecasting
*   `components/ui/GlassCard.tsx`: Reusable Glass Card

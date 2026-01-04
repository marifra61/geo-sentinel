<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1AfBbMMXW_Mgkoxjz0GvE9uCJW-ghDarV

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


Here is a comprehensive workflow description and a ready-to-use **User Guide** tailored specifically for **Geo-Sentinel**.

Since you provided the specific details, I have filled out the configuration sections so you can copy this directly into a `README.md` file in your GitHub repository or a dedicated documentation page in your application.

---

### Part 1: The Geo-Sentinel Workflow

This is how the specific components you provided interact to create the live application.

#### 1. The "Runtime" Flow (What happens when a user visits)
1.  **Entry Point:** A user navigates to `https://geo-sentinel.net/`.
2.  **Cloudflare (DNS & Security):**
    *   Cloudflare intercepts the request, manages the SSL certificate (HTTPS), and checks for security threats.
    *   It routes the clean traffic to **Vercel**.
3.  **Vercel (Frontend Host):**
    *   Vercel serves the user interface (React/Next.js).
    *   When the user interacts with the tool (e.g., requests an analysis), the browser sends an API request.
4.  **Google Cloud Run (Backend Logic):**
    *   The request is forwarded to a container running in project `gen-lang-client-0382288410`.
    *   This container holds your Python/Node.js logic.
5.  **Google AI Studio (Intelligence):**
    *   The Cloud Run backend sends the data + prompt to the Gemini API using your API key.
    *   Gemini returns the AI-generated analysis.
6.  **Return Path:** The data flows back from Cloud Run -> Vercel -> User's Browser.

#### 2. The "Development" Flow (How you update it)
1.  **AI Studio:** You continually refine your prompts and model settings in Google AI Studio.
2.  **GitHub (`marifra61/geo-sentinel`):**
    *   When you save changes, they are pushed to this repository.
3.  **Automated Deployment:**
    *   **Vercel** sees the update on GitHub and redeploys the frontend at `geo-sentinel.net`.
    *   **Google Cloud Build** (if configured) sees the update, builds a new container image, and updates the Cloud Run service in project `gen-lang-client-0382288410`.

---

### Part 2: Geo-Sentinel User & Developer Guide

Below is the text you can copy and paste directly into your project documentation.

***

# Geo-Sentinel: Architecture & Developer Guide

**Geo-Sentinel** is an AI-powered application designed to provide [insert brief specific purpose, e.g., geospatial analysis/monitoring] using Google's Gemini models. This document outlines the technical architecture, data flow, and deployment configuration for developers and stakeholders.

## 🏗 System Architecture

The application operates on a modern, serverless "split-stack" architecture ensuring high availability, global performance, and secure AI processing.

*   **Frontend (UI):** [Vercel](https://vercel.com)
    *   *Role:* Hosts the client-side application and manages static assets.
    *   *URL:* `https://geo-sentinel.net/`
*   **Backend (API & Logic):** [Google Cloud Run](https://cloud.google.com/run)
    *   *Role:* Serverless container environment that processes business logic and securely communicates with the AI models.
    *   *Project:* `gen-lang-client-0382288410`
*   **AI Engine:** **Google Gemini (via AI Studio)**
    *   *Role:* Processes natural language prompts and data inputs to generate intelligent responses.
*   **Network & Security:** [Cloudflare](https://www.cloudflare.com/)
    *   *Role:* DNS management, DDoS protection, and SSL/TLS encryption.

## 🔄 Data Workflow

### 1. User Request Cycle
1.  **Access:** The user visits `https://geo-sentinel.net/`.
2.  **Routing:** Cloudflare resolves the DNS and routes traffic to the Vercel Edge Network.
3.  **Interaction:** The user inputs data into the UI.
4.  **Processing:**
    *   The frontend sends a payload to the backend hosted on Google Cloud Run.
    *   The backend authenticates the request and forwards the prompt to Google's Gemini API.
5.  **Response:** The AI model generates insights, which are sent back through Cloud Run to the Vercel frontend for display.

### 2. CI/CD Deployment Pipeline
All code is version-controlled in the master repository:
*   **Repository:** [github.com/marifra61/geo-sentinel](https://github.com/marifra61/geo-sentinel)

**Deployment Triggers:**
*   **Frontend:** A push to the `main` branch triggers Vercel to rebuild and redeploy the UI.
*   **Backend:** A push to the `main` branch triggers Google Cloud Build to create a new Docker container and deploy it to the Cloud Run service in project `gen-lang-client-0382288410`.

## ⚙️ Configuration & Environment

For developers creating a local instance or troubleshooting the deployment, the following configuration details are critical.

### Key Identifiers
| Component | ID / URL |
| :--- | :--- |
| **Public Domain** | `https://geo-sentinel.net/` |
| **GitHub Repo** | `marifra61/geo-sentinel` |
| **GCP Project ID** | `gen-lang-client-0382288410` |

### Environment Variables
*These variables manage the connection between the frontend, backend, and AI services.*

*   `NEXT_PUBLIC_API_URL`: Points to the Google Cloud Run service URL.
*   `GOOGLE_API_KEY`: The secret key for accessing Gemini models (Managed in Google Secret Manager).
*   `CLOUDFLARE_DNS`: Managed via Cloudflare dashboard pointing to Vercel CNAME targets.

## 🛠 Troubleshooting

*   **App not loading:** Check [Cloudflare Status](https://www.cloudflarestatus.com/) to ensure DNS is resolving.
*   **AI Response Errors:** If the application loads but AI responses fail, check the **Google Cloud Run logs** in project `gen-lang-client-0382288410` for API quota limits or timeout errors.
*   **Version Mismatch:** Ensure the local environment matches the `main` branch on GitHub.

---
*Maintained by the Geo-Sentinel Development Team.*

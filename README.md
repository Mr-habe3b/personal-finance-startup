# Zyyn8 - Startup Equity Management Dashboard

Zyyn8 is a comprehensive dashboard for early-stage startup founders to manage, visualize, and model their company's equity. It provides tools for cap table management, fundraising pipeline tracking, financial analysis, and more, with AI-powered features to provide insights and streamline workflows.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN
- **Generative AI:** Google AI (via Genkit)
- **Authentication:** Mocked (Context API)
- **Drag & Drop:** dnd-kit

## Features

- **Dashboard**: Get a high-level overview of key metrics like total investment, team size, ESOP allocation, and active fundraising deals.
- **Team Management**: Add, edit, and manage team members, including their equity allocation and vesting schedules.
- **Cap Table Visualization**: View an interactive chart of your company's ownership structure.
- **Client & Project Management**: Track clients and their associated projects with a detailed CRM-like interface.
- **Fundraising Pipeline**: Manage your investor pipeline from lead to close using a drag-and-drop Kanban board.
- **Financials Tracking**: Log monthly revenue and expenses, visualize financial trends, and get AI-powered analysis of your company's performance.
- **Document Q&A**: Upload legal or other documents and use an AI assistant to ask questions and find information within the text.
- **Milestone & Target Setting**: Plan and track your startup's progress with a Kanban board for milestones, featuring AI-assisted description and sub-task generation.
- **AI Dilution Simulator**: Model new funding rounds by inputting investment amounts and valuations to see the immediate impact on your cap table.
- **Internal Wiki**: Create and manage an internal knowledge base for your team, with AI content generation to get you started.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd Zyyn8
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Before running the application, you need to set up your environment variables.

1.  Create a `.env` file in the root directory by copying the example:
    ```bash
    cp .env.example .env
    ```
2.  Add your Google AI API key to the `.env` file:
    ```
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```
    This is required for all the AI-powered features to work correctly.

### Running the Application

This project uses Genkit for its AI flows, which runs in a separate process from the main Next.js development server.

1.  **Start the Genkit server:**
    Open a terminal and run:
    ```bash
    npm run genkit:watch
    ```
    This will start the Genkit development server and watch for any changes in your AI flow files.

2.  **Start the Next.js development server:**
    Open a second terminal and run:
    ```bash
    npm run dev
    ```
    This will start the Next.js application on `http://localhost:9002`.

You can now access the application in your browser and start exploring its features.

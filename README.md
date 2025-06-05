# ChatOllama

A modern web application that allows you to manage your [Ollama](https://ollama.ai) server and chat with Large Language Models (LLMs) from anywhere in the world.

## ✨ Features

- **Model Management**: View, download, and delete AI models
- **AI Chat**: Interactive conversations with large language models
- **Knowledge Base**: Integrate and chat with your knowledge base
- **Flexible Configuration**: Remote Ollama server setup
- **Modern Interface**: Beautiful UI/UX built with Nuxt 3 and TailwindCSS
- **Real-time**: Streaming response support
- **Responsive**: Compatible with all devices

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **UI**: [Nuxt UI](https://ui.nuxt.com/) + [TailwindCSS](https://tailwindcss.com/)
- **AI Integration**: [Ollama](https://ollama.ai), [LangChain](https://langchain.com/)
- **Database**: [Prisma](https://prisma.io/) ORM
- **Vector Database**: [ChromaDB](https://www.trychroma.com/)
- **Deployment**: [Vercel](https://vercel.com/) ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Running Ollama server

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Open-Chat-UI
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
DISABLE_VERCEL_ANALYTICS=false
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_url
```

4. **Database setup**
```bash
npm run prisma-migrate
npm run prisma-generate
```

5. **Run the application**
```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

The application will be available at `http://localhost:3000`

## 📖 Usage Guide

### 1. Configure Ollama Server

- Ensure your Ollama server is publicly accessible
- If needed, use [ngrok](https://ngrok.com/) to expose your local server
- Go to [Settings](/settings) to configure your Ollama server host

### 2. Model Management

- Visit [Models](/models) to:
  - View available models
  - Download new models
  - Delete unnecessary models

### 3. Chat with AI

- Go to [Chat](/chat) to start conversations
- Select the appropriate model from the dropdown
- Type your message and receive real-time responses

### 4. Knowledge Base

- Create and manage knowledge bases
- Upload PDF documents for AI reference
- Chat with AI based on document content

## 🐳 Docker

The application supports containerization with Docker:

```bash
# Build image
docker build -t chatollama .

# Run container
docker run -p 3000:3000 chatollama
```

## 🚀 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Connect to Vercel
3. Configure environment variables
4. Deploy!

### Other platforms

```bash
npm run build
npm run preview
```

## 📝 License

This project is distributed under the MIT License. See the `LICENSE` file for more details.

**Built with ❤️ for the AI community**

# Secretary AI

This repository contains a reference implementation of the **Secretary AI** project, a lightweight and friendly AI assistant.

**Live Demo**: Access the chatbot hosted on an Apache server, running on a MacBook here: [https://home.tago.so/ai/](https://home.tago.so/ai/)

![images/CleanShot%202025-01-27%20at%2023.43.10%402x.png](https://github.com/tagoso/secretary-AI/blob/e7e42d0d5aa8b4f46bcad95a85e96c7fc4737aff/images/CleanShot%202025-01-27%20at%2023.43.10%402x.png)

---

## How to Use

### 1. Clone the Repository

```bash
git clone <repository_url>
cd <repository_folder>
```

### 2. Set Up Environment Variables

1. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with the necessary values:
   - `ALLOWED_ORIGIN`
   - `GENERATE_API_URL`
   - `MODEL_NAME`
   - `PORT`

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Backend Server

```bash
node server.js
```

### 5. Set Up Ollama

- Ensure **Ollama** is installed and running locally.
- Load the required model:
  ```bash
  ollama create <model_name> -f <path_to_Modelfile>
  ```
- **Here is the fan part** -- Customize the Modelfile to suit your preferences. Edit the file to define behavior, rules, or responses specific to your needs before creating the model.

### 6. (Optional) Configure Apache

- Install and configure Apache to serve the frontend (`ollama-frontend`) at your desired domain or subdomain.

### 7. Access the Frontend

Navigate to:

```
http://localhost:<PORT>
```

Replace `<PORT>` with the value specified in your `.env` file.

### 8. Test the AI Assistant

Use the chat interface to interact with your AI secretary. Sample questions are available to help you get started.

---

## Features

- **Lightweight AI Assistant**: Powered by the Mistral 7B language model.
- **Secure Backend API**: Ensures safe handling of user queries.
- **Interactive Web Interface**: Provides real-time responses through a sleek chat UI.

---

## Project Overview

A friendly AI secretary designed to keep your life organized. This humble yet efficient assistant:

- Runs entirely on a macOS laptop (no GPU or cloud required).
- Delivers clear, concise responses with minimal hallucinations.
- Embraces occasional harmless mistakes with charm. 😉

### Key Components

#### Backend

- Built with **Node.js** and **Express.js**.
- Security features include:
  - **Helmet** for secure headers.
  - **Domain-restricted CORS**.
  - **Rate limiting**.
  - **Request logging**.

#### Frontend

- Interactive chat interface built with **HTML**, **CSS**, and **JavaScript**.
- Real-time query and response functionality.

#### AI Model Integration

- Powered by the **Mistral 7B** language model.
- Uses a custom Modelfile for behavior and rules configuration.

---

## Deployment

- **Local macOS Environment**:
  - Runs seamlessly on a macOS laptop without requiring a GPU or cloud resources.
- **Self-Contained Hosting**:
  - Backend and frontend are designed for standalone deployment.
- **Scalable**:
  - Optimized for potential production extension.

---

## License

This project is licensed under the **Apache License 2.0**. See the `LICENSE` file for details.

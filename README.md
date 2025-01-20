# TrinityWallet Server

## Overview

This server provides a secure way for **TrinityWallet** (a digital identity wallet conforming to eIDAS 2.0) to access certain secrets. It will likely server as the mock wallet provider server for TrinityWallet in the future.

## Features

- Secure retrieval of secrets for TrinityWallet
- TLS/SSL-enabled communication for secure data transmission
- Easy setup for local development and testing

## Table of Contents

- [Installation](#installation)
- [Building and Running Locally](#building-and-running-locally)

## Installation

### Prerequisites

Before running the server locally, ensure the following dependencies are installed:

- **Node.js** (version 14.x or higher)
- **npm** (Node Package Manager)

You can install them by running:

```bash
npm install -g node
npm install -g npm
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=443
AZURE_SECRET_NAME=your_secret_name
AZURE_KEY_VAULT_NAME=your_vault_name
FLASK_SECRET_KEY=your_flask_secret
EIDASNODE_LIGHTTOKEN_SECRET=your_eidas_secret
```
#### Environment Variables

- `PORT`: The port the server will listen on (defaults to 443 for HTTPS)
- `AZURE_SECRET_NAME`: Name of the secret in Azure Key Vault
- `AZURE_KEY_VAULT_NAME`: Name of your Azure Key Vault instance
- `FLASK_SECRET_KEY`: Secret key for Flask session management
- `EIDASNODE_LIGHTTOKEN_SECRET`: Secret key for eIDAS light token generation


## Building and Running Locally

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone <repository-url>
cd TrinityWalletServer
```

### Step 2: Install Dependencies

Install the necessary dependencies:

```bash
npm install
```

### Step 3: Create SSL/TLS Keys and Certificates

To enable secure communication via SSL/TLS, generate SSL keys and a certificate:

```bash
openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365 -subj "/CN=localhost"
```

### Step 4: Run the Server

Run the server using:

```bash
node server.mjs
```

The server will start on https://localhost:443 with SSL/TLS enabled.
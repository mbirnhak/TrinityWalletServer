# TrinityWallet Server

## Overview

TrinityWallet Server provides a secure backend for **TrinityWallet** — a digital identity wallet that conforms to eIDAS 2.0 standards. This server facilitates secure access to critical secrets and will likely serve as the mock wallet provider server for TrinityWallet in future implementations.

## Features

- Secure retrieval and management of wallet secrets  
- Credential issuance and verification capabilities  
- TLS/SSL-enabled communication for robust data security  
- Azure Key Vault integration for secret management  
- RESTful API endpoints for wallet operations  

## Table of Contents

- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Configuration](#configuration)  
- [Building and Running](#building-and-running)  
- [API Endpoints](#api-endpoints)  

## Prerequisites

Before running the server, ensure you have the following installed:

- **Node.js** (version 14.x or higher)  
- **npm** (Node Package Manager)  

```bash
# Install or update Node.js and npm if needed
npm install -g node
npm install -g npm
```

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd TrinityWalletServer
```

### Install Dependencies

```bash
npm install
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=443
AZURE_SECRET_NAME=your_secret_name
AZURE_KEY_VAULT_NAME=your_vault_name
PRIVATE_KEY={"your":"private_key_in_jwk_format"}
PUBLIC_KEY={"your":"public_key_in_jwk_format"}
```

#### Required Variables

- `PRIVATE_KEY`: Issuer's private key for credential signing (JWK format)  
- `PUBLIC_KEY`: Issuer's public key associated with the private key (JWK format)  
- `PORT`: Server listening port (defaults to 443 for HTTPS)  
- `AZURE_SECRET_NAME`: Name of the secret in Azure Key Vault  
- `AZURE_KEY_VAULT_NAME`: Name of your Azure Key Vault instance  

### SSL/TLS Configuration

Generate SSL keys and certificate for secure communications:

```bash
# Requires san.cnf file with appropriate configurations
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem -out cert.pem \
  -config san.cnf -extensions v3_req
```

## Building and Running

### Start the Server

```bash
node server.mjs
```

The server will start on `https://localhost:443` with SSL/TLS enabled.

### Expose Locally for Testing

For temporary external access during development:

```bash
cloudflared tunnel --no-tls-verify --url https://localhost:443
```

## API Endpoints

- `GET /` — Welcome message  
- `GET /azure-secret` — Retrieve secrets from Azure Key Vault
- `GET /credential-issuance?username=<username>` — Issue and verify credentials for a specific username
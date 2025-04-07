# 🚀 Fasco Shop Backend - NestJS Backend



## 📑 Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [API](#API)
- [Installation](#installation)



## 📝 Introduction


"This is a backend REST API built with NestJS for project Fasco Shop"

## ⚙️ Tech Stack

- [NestJS](https://nestjs.com/) - Node.js framework
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)- Write trigger to constraint
- TypeORM - Transaction, Migration, Logging script SQL
- JWT Authentication
- [Docker](https://www.docker.com/) - Run container Redis
- Redis - Caching Data & store block list token
- Socket.IO - notify status of order in realtime
- GoogleOAuth & FacebookOAuth

## ✨ API


### File postman to import
[Download postpost.json](postman.json)

### Modules

- Auth
- User
- Brand
- Product
- Tag
- Cart
- Province (District, Commune)
- Address
- Favorite
- Order
- Category
- Email
- Log - log status of order
- Socket - Notify status of order



## 🛠 Installation

### Prerequisites

- Node.js >= 18.x
- Yarn or npm
- PostgreSQL
- Docker

### Steps

```bash
# Clone the repository
git clone https://github.com/phapnguyennhat/FascoBE.git

# Navigate to the project directory
cd FascoFE

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run migrations 
npm run migration:generate -- db/migrations/init-base-table
npm run migration:run

# Run file trigger sql in databsae


# Build the application
npm run build
# start the application
node dist/src/main

# Replay UX/UI

This project is a Next.js application for match-making and user authentication using Steam and Google providers. It includes a Docker setup for easy deployment and development.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Docker](#docker)
- [Testing](#testing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/replay-ux-ui.git
    cd replay-ux-ui
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

## Usage

To start the development server, run:
```sh
npm run dev
```

The application will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
STEAM_SECRET="your_steam_secret"
STEAM_VHASH_SOURCE="your_steam_vhash_source"
NODE_ENV="development"
REPLAY_API_URL="http://host.docker.internal:4991"
LEET_GAMING_PRO_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXTAUTH_URL="http://localhost:3000/api/auth"
NEXTAUTH_TOKEN="your_nextauth_token"
NEXTAUTH_SECRET="your_nextauth_secret"
```

## Docker

To build and run the application using Docker, follow these steps:

1. Build the Docker image:
    ```sh
    docker build -t replay-ux-ui .
    ```

2. Run the Docker container:
    ```sh
    docker run -p 3000:3000 --env-file .env replay-ux-ui
    ```

Alternatively, you can use Docker Compose:

1. Build and start the services:
    ```sh
    docker-compose up --build
    ```

## Testing

To run the tests, use the following command:
```sh
npm test
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
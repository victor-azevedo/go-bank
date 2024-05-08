# GO Bank

API to simulate a bank accounts transactions.

## How to run

### 1. Locally Option:

#### Requirements

Have Node.js (recommended version: 20.12.2) and MongoDB (recommended version: 7.0.9) installed in your machine.

1.1 Clone this repository;

```bash
git clone git@github.com:victor-azevedo/go-bank.git
cd go-bank
```

1.2 Install all dependencies:

```bash
npm i
```

1.3 Create a `.env` file based in `.env.example`;

1.4 Compile Typescript code:

```bash
npm run build
```

1.5 Start application:

```bash
npm start
```

### 2. Docker Option:

#### Requirements

Have Docker and Docker Compose installed.

2.1 Clone this repository;

```bash
git clone git@github.com:victor-azevedo/go-bank.git
cd go-bank
```

2.2 Create a `.env` file based in `.env.example`;

2.3 Run Docker Compose file:

```bash
sudo docker compose up
```

## Environments

This API can be run in three types of environments.

For each environment, configure the respective `.env` file:

- For production: Configure `.env`
- For development: Configure `.env.development`
- For testing: Configure `.env.test`

## Tests

Unit and integration tests have been implemented.
To run the tests, configure `.env.test` adn run:

```bash
npm run test
```

Check for other available test scripts in the package.json.

## Documentation

This API is documented using Swagger OpenAPI 3.0.0.

To access the documentation, visit the endpoint: `/docs`.

Note: This endpoint is only accessible when running the application in `development` environment.

![Cover ](/assets/sample-swagger.png)

## Authorship

This project was developed by [Victor Azevedo](https://victorazevedo.vercel.app/).

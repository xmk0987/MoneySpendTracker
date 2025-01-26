# Where did my money go?

A web application that allows you to import your bank statement as an csv. If its suitable for the application you can use the dashboard to navigate how much you have spend/received in different time frames and also see interesting statistics about where do you use most of your money and what type of payment is your most used payment.

See different kinds of graphs and finally get your spending in control.

## Live

The web application can be tried through the browser from: https://cash-trail.vercel.app/

## Trying out Locally

### 1. Clone this git repo and navigate into it.

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies

Install the required dependencies:

```bash
npm install
```

### 3. Setup environment variables

The application uses environment variables for configuration. You need to create a .env file from the provided .env.template.

Run the following command to copy the template:

```bash
cp .env.template .env
```

Then, open the .env file in your editor and replace the placeholder values with your actual environment-specific values.

You will need a redis db to allow caching with the current implementation.


### 4. Run the development server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 5. Open the application

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


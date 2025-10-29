# Keep Alive: Render

[Keep Alive: Render](#) is a simple script to keep your [Render free tier](https://render.com/free) from [going to sleep](https://render.com/docs/free#spinning-down-on-idle) by sending a request to your service(s) at 5-minute intervals.

<details><summary>Something to note</summary>

\* Read about Render's Monthly usage limits [here](https://render.com/docs/free#exceeding-usage-limits)
</details>

## Installation

Using npm:

```sh
npm install
```

yarn:

```sh
yarn
```

## Usage

- Create a `.env` file in the root directory:

```sh
cp sample.env .env
```

- Replace the value of `URLS` in the `.env` with that of your service(s). For multiple services, separate them with a comma.

- To use these environment variables in GitHub Actions, register them as repository secrets:
  1. Go to your repository on GitHub
  2. Click Settings → Secrets and variables → Actions
  3. Under Repository secrets, click "New repository secret"
  4. Enter each variable name and value from your `.env` file
  5. These secrets will be available in your workflows as `${{ secrets.VARIABLE_NAME }}`
- Start the script with your favourite package manager.

With npm: 
```sh
npm run start
```

With yarn: 
```sh
yarn start
```

## License

ISC

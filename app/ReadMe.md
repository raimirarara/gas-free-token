# GasFree Token

## Pre-requisites

### Node.js

Firebase CLI v11.24.1 is incompatible with Node.js v16.0.0 Please upgrade Node.js to version ^14.18.0 || >=16.4.0

Node.js v18.0.0 で動作確認済み

### Firebase CLI

```
npm install -g firebase-tools
```

```
firebase login
```

## Local Development

### Install dependencies

```
cd functions
npm install
```

### Run the app

```
npm run serve
```

### Deploy the app

```
npm run deploy
```

### Run Local Blockchain

secrets_template.ts を secrets.ts にリネームして、中身を書き換える

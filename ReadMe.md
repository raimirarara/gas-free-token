# GasFree Token

## Pre-requisites

### Node.js

Firebase CLI v11.24.1 is incompatible with Node.js v16.0.0 Please upgrade Node.js to version ^14.18.0 || >=16.4.0

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

以下エラーが出ている

```
Error: HTTP Error: 403, <?xml version='1.0' encoding='UTF-8'?><Error><Code>AccessDenied</Code><Message>Access denied.</Message><Details>service-346545168958@gcf-admin-robot.iam.gserviceaccount.com does not have storage.objects.create access to the Google Cloud Storage object. Permission 'storage.objects.create' denied on resource (or it may not exist).</Details></Error>
```

### Run Local Blockchain

secrets_template.ts を secrets.ts にリネームして、中身を書き換える

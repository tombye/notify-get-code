# notify-get-code

Script to help you avoid having to check your email/phone when using Notify's Admin app

## Installation

Assumes this repository sits at the same level as a checkout of [notifications-functional-tests](https://github.com/alphagov/notifications-functional-tests) with an `ENVIRONMENT.SH` set up.

Run this command to install:
```bash
npm install
```

## Running the script

Run the script for an email token:
```bash
node get_code.js email
```

Run the script for an sms token:
```bash
node get_code.js sms
```

### Setting your domain and port

The script assumes you're on http://localhost:6012 by default. If you're not, you can set both using
the `--originandport` flag:
```bash
node get_code.js --originandport example.com:9090 email
```

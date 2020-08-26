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
node get-code.js email
```

Run the script for an sms token:
```bash
node get-code.js sms
```

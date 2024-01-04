const fs = require('fs')
const NotifyClient = require('notifications-node-client').NotifyClient;

// CHANGE THESE IF NOT USING https://github.com/alphagov/notifications-local to:
//
// const localApiProtocolAndOrigin = 'http://localhost';
// const localAdminProtocolAndOrigin = 'http://localhost';
const localApiProtocolAndOrigin = 'http://notify-api.localhost';
const localAdminProtocolAndOrigin = 'http://notify.localhost';

let notificationType;
let notifyClient;
let protocolAndOrigin;
let apiKey;

const args = process.argv.slice(2);

function noNotificationType () {
  console.log('No notification type given. Choose sms or email');
  process.exit(1);
};

if (!args.length) {
  noNotificationType();
}

if ((args[0] === '--help') || (args[0] === '-h')) {
  console.log('usage: get_code.js [options] notification_type');
  console.log('  options: --protocolandorigin: protocolandorigin to use, ie. https://foo.com');
  console.log('');
  console.log('notification_type must be one of [email|sms]');
}
else if (args[0] === '--protocolandorigin') {
  protocolAndOrigin = args[1];

  if (args.length < 3) {
    noNotificationType();
  }

  notificationType = args[2];
}
else { // 1st argument is notification_type
  notificationType = args[0];
}

function pbcopy(data) {
  var proc = require('child_process').spawn('pbcopy');
  proc.stdin.write(data);
  proc.stdin.end();
}

function getKeyFromNotification (content) {
  console.log(`getKeyFromNotification called`);
  if (notificationType === 'sms') {
    return content.match(/^\d+/)[0];
  }
  else { // email
    const url = content.match(new RegExp(`${localAdminProtocolAndOrigin}:6012/\[^\\s]\+`, 'g'))[0];

    if (protocolAndOrigin !== undefined) {
      return url.replace(new RegExp(`${localAdminProtocolAndOrigin}:6012`, 'g'), `${protocolAndOrigin}:6012`);
    }
    return url;
  }
};

function getNotification () {
  notifyClient
    .getNotifications(notificationType)
    .then(response => {
      const notification = response.body.notifications[0];
      const sentAt = new Date(notification.sent_at);
      const token = getKeyFromNotification(notification.body);

      console.log(`Current date and time: ${new Date()}`);
      console.log(`Date and time for notification checked ${sentAt}`);
      if (notificationType === 'sms') {
        console.log(`Key is ${token}`);
      }
      if (notificationType === 'email') {
        
        console.log(`Link is ${token}`);
      }
      pbcopy(token);
      console.log('copied to clipboard');
    })
    .catch(err => console.error(err.message))
};

fs.readFile('../notifications-functional-tests/environment_local.sh', 'utf8', (err, data) => {
  apiKey = '' + data.match(/export\sNOTIFY_SERVICE_API_KEY\='([^\n]+)'/)[1];
  notifyClient = new NotifyClient(`${localApiProtocolAndOrigin}:6011`, apiKey);

  console.log(`apiOrigin: ${localApiProtocolAndOrigin}:6011`);
  console.log(`apiKey: ${apiKey}`);
  console.log(`notificationType: ${notificationType}`)

  getNotification();
});

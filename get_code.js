const fs = require('fs')
const NotifyClient = require('notifications-node-client').NotifyClient;

const args = process.argv.slice(2);

if (!args.length) {
  console.log('No notification type given. Choose sms or email');
  process.exit(1);
}

const notificationType = args[0];
let notifyClient;
let apiKey;

function pbcopy(data) {
  var proc = require('child_process').spawn('pbcopy');
  proc.stdin.write(data);
  proc.stdin.end();
}

function getKeyFromNotification (content) {
  if (notificationType === 'sms') {
    return content.match(/^\d+/)[0];
  }
  else { // email
    return content.match(/http\:\/\/localhost\:6012\/[^\s]+/)[0];
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
  notifyClient = new NotifyClient('http://localhost:6011', apiKey);

  console.log(`apiKey: ${apiKey}`);
  console.log(`notificationType: ${notificationType}`)

  getNotification();
});

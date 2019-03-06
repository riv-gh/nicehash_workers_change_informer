const BTC_WALET = '';
const TELEGRAM_BOT_TOKEN = '';
const TELEGRAM_CHAT_ID = '';

const CHECK_INTERVAL = 10000;
const NICEHASH_API_LINK = 'https://api.nicehash.com/api?method=stats.provider.workers&addr='+BTC_WALET;
const TELEGRAM_MESSAGE_URL = 'https://api.telegram.org/bot'+TELEGRAM_BOT_TOKEN+'/sendMessage?chat_id='+TELEGRAM_CHAT_ID+'&text=';
const MAX_CHANGE_COUNT = 3;

let lastWorkersCount = 0;
let changeCount = 0; //if the worker changes the algorithm, you won’t get the message
let tlegramWindow = null;

"https://api.nicehash.com"!=document.location.origin&&(document.location.href=NICEHASH_API_LINK);

function getJSON(url, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    let status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};
function sendTelegramMessage(message) {
  let tMessage = message.replace(/\r\n/g, '%0d%0a');
  tlegramWindow = window.open(TELEGRAM_MESSAGE_URL+tMessage, "tlegramWindow", "width=200, height=100");
  setTimeout(function(){tlegramWindow.close();},5000);
}

function checkNicehash() {
getJSON(NICEHASH_API_LINK,
  function(err, data) {
    if (err !== null) {
      console.error('Something went wrong: ' + err);
    } else {
      console.info('Your workers count: ' + data.result.workers.length);
      let workersCount = data.result.workers.length;
      if (workersCount!=lastWorkersCount) {
        changeCount = 1;
      }
      if ((changeCount>0) && (workersCount==lastWorkersCount)) {
        changeCount++;
      }
      if (changeCount>=MAX_CHANGE_COUNT) {
        changeCount = 0;
        let message = "Workers count change!\r\n"+
                      (workersCount<lastWorkersCount?"Some workers are lost...":"Some workers are recovery")+
                      " \r\nActive workers:\r\n";
        for (let i=0; i<data.result.workers.length; i++) {
          message+=""+(i+1)+". "+(!data.result.workers[i][0].length?"[no name]":data.result.workers[i][0])+"\r\n";
        }
        console.info(message);
        sendTelegramMessage(message);
      }
      lastWorkersCount = workersCount;
    }
  });
  setTimeout(checkNicehash,CHECK_INTERVAL);
}

checkNicehash();

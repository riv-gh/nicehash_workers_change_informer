const BTC_WALET = '';
const TELEGRAM_MESSAGE_URL = '';
let lastWorkersCount = 0;

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
function sendTelegramMessage() {

}

getJSON('https://api.nicehash.com/api?method=stats.provider.workers&addr='+BTC_WALET,
function(err, data) {
  if (err !== null) {
    console.error('Something went wrong: ' + err);
  } else {
    console.info('Your workers count: ' + data.result.workers.length);
    let workersCount = data.result.workers.length;
    if (workersCount!=lastWorkersCount) {
      let message = "Workers count change!\r\n"+
                    (workersCount<lastWorkersCount?"Some workers are lost...":"Some workers are recovery")+
                    " \r\nActive workers:\r\n";
      for (let i=0; i<data.result.workers.length; i++) {
        message+=""+(i+1)+". "+(!data.result.workers[i][0].length?"[no nane]":data.result.workers[i][0])+"\r\n";
      }
      console.info(message);
      alert(message);
      lastWorkersCount = workersCount;
    }
  }
});

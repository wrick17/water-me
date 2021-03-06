// config
var show = 'drinkTimerShow';
var hide = 'drinkTimerHide';
// var timeoutMultiplier = 1000;
// var hideTimeoutMultiplier = 5000;
// chrome.storage.local.clear();
var timeoutMultiplier = 60*60*1000;
var hideTimeoutMultiplier = 60*1000;
var timeout = timeoutMultiplier*1;
var hideTimeout = hideTimeoutMultiplier*1;
var intervalTimeout = 1000;
var counterInterval;
var quotes = [
  "In wine there is wisdom, in beer there is freedom, in water there is bacteria.",
  "It seems difficult to drink 8 glasses of water a day but easy to drink 8 mugs of beer in 2 hours",
  "Water solves all your problems... Need to loose weight, drink water. Need to clear you mind, drink water. Tired of someone, drown him",
  "Pssst... Time to drink some water",
  "Millions have lived with love. Not one has lived without water",
  "Suprise your liver today.. Drink some water",
  "Drink plenty of water. Dehydration can get ugly",
  "Your body is more around 60% water. Be more than half full"
];
var buttonQuotes = [
  "I promise, I drank water",
  "Pinky swear, I drank water",
  "I know, just go now"
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function buildOverlay() {

  var overlay = document.createElement('div');
  overlay.id = 'water';
  overlay.style = 'display: none';

  var dialog = document.createElement('div');
  dialog.classList = 'water-dialog-box';
  dialog.style = 'background-image:url('+ chrome.extension.getURL('water.jpg')+')';

  var heading = document.createElement('div');
  var quoteIndex = getRandomInt(0, (quotes.length - 1));
  heading.innerHTML = quotes[quoteIndex];
  heading.id ='waterText';

  var button = document.createElement('button');
  button.id = 'okay';
  button.innerHTML = 'I promise, I drank water!';

  var timer = document.createElement('div');
  timer.id = 'timer';

  dialog.appendChild(heading);

  overlay.appendChild(dialog);
  overlay.appendChild(button);

  document.querySelector('body').appendChild(overlay);
}

function showOverlay() {
  document.getElementById('waterText').innerHTML = quotes[getRandomInt(0, (quotes.length - 1))];
  document.getElementById('water').style.display = 'flex';
}

function hideOverlay() {
  document.getElementById('water').style.display = 'none';
}

function zeroPad(val) {
  val = Number(val);
  return (val>9 ? val : '0'+val).toString();
}

function hideButton(time) {
  var temptime = (new Date(time)).getTime();
  counterInterval = setInterval(function() {
    var now = new Date();
    var timer = temptime-now;
    if (timer < 0) {
      clearInterval(counterInterval);
      return;
    }
    timer = parseInt(timer/1000);
    var minutes = parseInt(timer/60);
    var seconds = parseInt(timer%60);
    document.getElementById('okay').innerHTML = zeroPad(minutes)+':'+zeroPad(seconds);
  }, 10);
}

function showButton(callback) {
  clearInterval(counterInterval);
  if (!overlayShown) {
    callback();
  }

  function handler(e) {
    hideOverlay();
    callback();
  }
  var button = document.getElementById('okay');
  button.innerHTML = buttonQuotes[getRandomInt(0, buttonQuotes.length-1)];
  button.removeEventListener('click', handler);
  button.addEventListener('click', handler);
}

function setTime()  {
  var now = Date.now();
  intervalTimeout = Math.min(timeout, 1000);

  var storeShow = {};
  storeShow[show] = now + timeout;
  chrome.storage.local.set(storeShow);

  var storeHide = {};
  storeHide[hide] = now + timeout + hideTimeout
  chrome.storage.local.set(storeHide);

  init();
}

function setSettings(callback) {
  chrome.storage.local.get('settings', function(settingsObj) {
    if (settingsObj.hasOwnProperty('settings')) {
      timeout = Number(settingsObj.settings.triggerInterval) * timeoutMultiplier;
      hideTimeout = Number(settingsObj.settings.blockDuration) * hideTimeoutMultiplier;
      callback();
    } else {
      var settings = {
        triggerInterval: 1,
        blockDuration: 1
      }
      chrome.storage.local.set({'settings': settings}, callback);
    }
  });
}
var loop;

var overlayShown = false;

function init() {
  clearTimeout(loop);

  setSettings(function() {

    loop = setTimeout(function() {
      chrome.storage.local.get(show, function(showObj) {
        // console.log('i am running', new Date(showObj[show]));

        if (showObj.hasOwnProperty(show)) {
          var now = Date.now();

          if (showObj[show] < now) {
            chrome.storage.local.get(hide, function(hideObj) {

              if (hideObj[hide] > now) {
                if (!overlayShown) {
                  hideButton(hideObj[hide]);
                  showOverlay();
                  overlayShown = true;
                }
                intervalTimeout = 1000;
                return init();
              } else {
                return showButton(function() {
                  overlayShown = false;
                  setTime();
                });
              }

            })
          } else {
            intervalTimeout = Math.min((showObj[show] - now), 1000);
            showButton(function() {
              if (overlayShown) {
                  overlayShown = false;
                  return init();
              }
            });
          }
        } else {
          return setTime();
        }

      });

    }, intervalTimeout);

  });

}

buildOverlay();
init();

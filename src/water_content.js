// config
var show = 'drinkTimerShow';
var hide = 'drinkTimerHide';
var timeoutMultiplier = 60*60*1000;
var hideTimeoutMultiplier = 1000;
var timeout = timeoutMultiplier*1;
var hideTimeout = hideTimeoutMultiplier*1;
var intervalTimeout = 100;
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

  dialog.appendChild(heading);

  overlay.appendChild(dialog);

  document.querySelector('body').appendChild(overlay);
}

function showOverlay() {
  document.getElementById('waterText').innerHTML = quotes[getRandomInt(0, (quotes.length - 1))];
  document.getElementById('water').style.display = 'flex';
}

function hideOverlay() {
  document.getElementById('water').style.display = 'none';
}

function setTime()  {
  var now = Date.now();
  intervalTimeout = timeout;

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

      console.log('i am running');

      chrome.storage.local.get(show, function(showObj) {

        if (showObj.hasOwnProperty(show)) {

          var now = Date.now();

          if (showObj[show] < now) {
            chrome.storage.local.get(hide, function(hideObj) {

              if (hideObj[hide] > now) {
                if (!overlayShown) {
                  showOverlay();
                  overlayShown = true;
                }
                intervalTimeout = 100;
                return init();
              } else {
                if (overlayShown) {
                  hideOverlay();
                  overlayShown = false;
                }
                return setTime();
              }

            })
          } else {
            intervalTimeout = showObj[show] - now;
              if (overlayShown) {
                hideOverlay();
                overlayShown = false;
              }
            return init();
          }
        } else {
          return setTime();
        }

      });

    }, intervalTimeout);

  });

}
chrome.storage.local.clear();

buildOverlay();
init();

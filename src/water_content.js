function buildOverlay() {
  var quotes = ["In wine there is wisdom, in beer there is freedom, in water there is bacteria.",
                "It seems difficult to drink 8 glasses of water a day but easy to drink 8 mugs of beer in 2 hours",
                "Water solves all your problems... Need to loose weight, drink water. Need to clear you mind, drink water. Tired of someone, drown him",
                "Pssst... Time to drink some water",
                "Millions have lived with love. Not one has lived without water",
                "Suprise your liver today.. Drink some water",
                "Drink plenty of water. Dehydration can get ugly",
                "Your body is more around 60% water. Be more than half full"
              ]

  var overlay = document.createElement('div');
  overlay.id = 'water';
  overlay.style = 'display: none';

  var dialog = document.createElement('div');
  dialog.classList = 'water-dialog-box';
  dialog.style = 'background-image:url('+ chrome.extension.getURL('water.jpg')+')';

  var heading = document.createElement('div');
  heading.innerHTML = quotes[0];
  heading.id ='waterText';

  dialog.appendChild(heading);

  overlay.appendChild(dialog);

  document.querySelector('body').appendChild(overlay);
}

buildOverlay();

var show = 'drinkTimerShow';
var hide = 'drinkTimerHide';
var timeout = 10;
var hideTimeout = 1000*60;

function showOverlay() {
  document.getElementById('water').style.display = 'flex';
}

function hideOverlay() {
  document.getElementById('water').style.display = 'none';
}

function setTime()  {
  var now = Date.now();

  var storeShow = {};
  storeShow[show] = now + timeout;
  chrome.storage.local.set(storeShow);

  var storeHide = {};
  storeHide[hide] = now + timeout + hideTimeout
  chrome.storage.local.set(storeHide);
}


function init() {

  setInterval(function() {

    chrome.storage.local.get(show, function(showObj) {

      if (showObj.hasOwnProperty(show)) {

        var now = Date.now();

        if (showObj[show] < now) {
          chrome.storage.local.get(hide, function(hideObj) {

            if (hideObj[hide] > now) {
              showOverlay();
            } else {
              hideOverlay();
              setTime();
            }

          })
        } else {
          hideOverlay();
        }
      } else {
        setTime();
      }

    })

  }, 10);

}

init();

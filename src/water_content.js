function buildOverlay() {
  var overlay = document.createElement('div');
  overlay.id = 'water';
  overlay.style = 'display: none';

  var dialog = document.createElement('div');
  dialog.classList = 'water-dialog-box';

  var heading = document.createElement('h1');
  heading.innerHTML = 'Please Go drink water!';

  dialog.appendChild(heading);

  overlay.appendChild(dialog);

  document.querySelector('body').appendChild(overlay);
}

buildOverlay();

var show = 'drinkTimerShow';
var hide = 'drinkTimerHide';
var timeout = 1000*60*60;
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

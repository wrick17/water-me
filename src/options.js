window.onload = function(){

var defaultTriggerInterval = 1;
var defaultBlockDuration = 1;

function loadOptions() {
	 chrome.storage.local.get("settings", function(showObj){

    var triggerInterval = showObj.triggerInterval;
    if (!triggerInterval) {
      triggerInterval = defaultTriggerInterval;
    }

    var blockDuration = showObj.defaultBlockDuration;
    if (!blockDuration) {
      blockDuration = defaultBlockDuration;
    }

    var select = document.getElementById("triggerInterval");
    for (var i = 0; i < select.children.length; i++) {
      var child = select.children[i];
        if (child.value == triggerInterval) {
        child.selected = "true";
        break;
      }
    }

    var select = document.getElementById("blockDuration");
    for (var i = 0; i < select.children.length; i++) {
      var child = select.children[i];
        if (child.value == blockDuration) {
        child.selected = "true";
        break;
      }
    }

  })
}
loadOptions();
document.getElementById("saveButton").addEventListener("click",function() {

  var extensionStorageShow ={};

	var select1 = document.getElementById("triggerInterval");
	extensionStorageShow.triggerInterval = select1.children[select1.selectedIndex].value;

  var select2 = document.getElementById("blockDuration");
  extensionStorageShow.blockDuration = select2.children[select2.selectedIndex].value;


	var extensionStorage = {
    settings:extensionStorageShow
  }
  chrome.storage.local.set(extensionStorage);
  alert("Your changes are saved");

});

};

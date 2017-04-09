window.onload = function(){

	var defaultTriggerInterval = 1;
	var defaultBlockDuration = 1;

	function loadOptions() {
		 chrome.storage.local.get("settings", function(showObj){

			 console.log(showObj);

	    var triggerInterval = showObj.settings.triggerInterval;
	    if (!triggerInterval) {
	      triggerInterval = defaultTriggerInterval;
	    }

	    var blockDuration = showObj.settings.blockDuration;
	    if (!blockDuration) {
	      blockDuration = defaultBlockDuration;
	    }

			document.getElementById("triggerInterval").value = triggerInterval;

			document.getElementById("blockDuration").value = blockDuration;

	  })
	}
	loadOptions();
	document.getElementById("saveButton").addEventListener("click",function() {

	  var extensionStorageShow ={};

		var select1 = document.getElementById("triggerInterval");
		console.log(select1.value);
		extensionStorageShow.triggerInterval = select1.value;

	  var select2 = document.getElementById("blockDuration");
	  extensionStorageShow.blockDuration = select2.value;


		var extensionStorage = {
	    settings:extensionStorageShow
	  }
	  chrome.storage.local.set(extensionStorage);
	  alert("Your changes are saved");

	});

};

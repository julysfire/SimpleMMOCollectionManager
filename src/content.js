//Respond to report back messages from background
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'report_back') {
        sendResponse(document.all[0].outerHTML);
    }
});

function injectIcons(){
  var divs = document.getElementsByTagName("div");
  for(var i =0;i<divs.length;i++){
    if(divs[i].className == "flex items-center"){
      divs[i].id = "itemIcon"+[i];

      var nDiv = document.createElement("div");
      var img = document.createElement("img");
    }
  }
}

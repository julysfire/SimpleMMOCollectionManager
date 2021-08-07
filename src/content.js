//Respond to report back messages from background
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'report_back') {
        sendResponse(document.all[0].outerHTML);
    }
    if (msg.text === 'inject_icons'){
        injectIcons(msg.data);
        sendResponse();
    }
});

function injectIcons(inventoryItems){
  for(var i = 0;i<inventoryItems.length;i++){
    var spanElement = document.getElementById("item-id-"+inventoryItems[i][1]);
    var img = new Image();
    if(inventoryItems[i][2] == "need") img.src = chrome.runtime.getURL("newItem.png");
    else img.src = chrome.runtime.getURL("checkmark.png");
    if(spanElement != null) spanElement.appendChild(img);
  }
}

//Add new item to collection Listener
document.addEventListener('DOMNodeInserted', newNode);

//CHeck for the item and check to see if it was added
function newNode(data){
  if(data.relatedNode.type == "button" && data.relatedNode.className == "swal2-confirm"){
    var itemName = document.getElementById("swal2-title").textContent;
    chrome.runtime.sendMessage({text: "new_item", data: itemName},function(response){
      //nah
    });
  }
}

function noCallback(){
	//
}

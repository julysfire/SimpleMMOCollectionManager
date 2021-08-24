//
//
// Front End Content Functions
//
// Written by Julysfire
//
//https://github.com/julysfire/SimpleMMOCollectionManager
//
//

//Respond to messages from background
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'report_back') {
        sendResponse(document.all[0].outerHTML);
    }
    if (msg.text === 'inject_icons'){
        injectIcons(msg.data, msg.refreshFlag);
    }
    if (msg.text === 'block_list_added'){
        addToBlock();
    }
    if (msg.text === 'remove_icon'){
        removeCurrentIcons();
    }
});


//
//Used to inject the image next to the image names
//
function injectIcons(inventoryItems, refreshFlag){
  var counter = 0;
  for(var i = 0;i<inventoryItems.length;i++){
    var spanElement = document.getElementById("item-id-"+inventoryItems[i][1]);
    var img = new Image();
    img.id = "extensionIcon"+counter;
    if(inventoryItems[i][2] == "need") img.src = chrome.runtime.getURL("imgs/newItem.png");
    else if(inventoryItems[i][2] == "quicksell") img.src = chrome.runtime.getURL("imgs/quickSell.png");
    else img.src = chrome.runtime.getURL("imgs/checkmark.png");
    if(spanElement != null) spanElement.appendChild(img);
    counter++;
  }

  if(refreshFlag) removeCurrentIcons();
}


//
//Used to notify user that item has been added to block list
//
function addToBlock(){
  var parentElement = document.getElementsByClassName("text-sm font-medium text-red-800");
  parentElement = parentElement[0].parentElement;
  var newP = document.createElement("p");
  newP.innerHTML = "SMMO Collection Manager: Item has been added to uncollectable items list.  This will be visible upon page refresh.";
  newP.className = "text-sm font-medium text-red-800";
  parentElement.appendChild(newP);
}


//
//Add new item to collection Listener
//
document.addEventListener('DOMNodeInserted', newNode);


//
//Check for the item and check to see if it was added
//
function newNode(data){
  if(data.relatedNode.type == "button" && data.relatedNode.className == "swal2-confirm"){
    var itemName = document.getElementById("swal2-title").textContent;
    chrome.runtime.sendMessage({text: "new_item", data: itemName});
  }
}


//
//Removes the icons for when the page is "refreshing" icons
//
function removeCurrentIcons(){
  for(var i = 0;i<20;i++){
    var ico = document.getElementById('extensionIcon'+i);
    if(ico != null) ico.parentNode.removeChild(ico);
  }

  //Rebuild icon list
  chrome.runtime.sendMessage({text: "check_inv"});
}

//
//
// Front End Content Functions
//
// Written by Julysfire
//
//https://github.com/julysfire/SimpleMMOCollectionManager
//
//


//
//Respond to messages from background
//
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'report_back') {
        sendResponse(document.all[0].outerHTML);
    }
    if (msg.text === 'inject_icons'){
        injectIcons(msg.data, msg.refreshFlag);
    }
    if (msg.text === 'block_list_added'){
      includeMessage("text-sm font-medium text-red-800", "SMMO Collection Manager: Item has been added to uncollectable items list.  This will be visible upon page refresh.");
    }
    if (msg.text === 'new_collection_item'){
      includeMessage("text-sm font-medium text-green-800", "SMMO Collection Manager: Item has been added to the list of collected items.");
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
//Used to notify user that item has been added to block list or has been picked up by the extension
//
function includeMessage(className, newMessage){
  var parentElement = document.getElementsByClassName(className);
  parentElement = parentElement[0].parentElement;
  var newP = document.createElement("p");
  newP.innerHTML = newMessage;
  newP.className = className;
  parentElement.appendChild(newP);
}


//
//Add new item to collection Listener
//
document.addEventListener('DOMNodeInserted', newNode);


//
//Setup eventListeners up for the inventory buttons
//
var butts = document.getElementsByClassName("dark:text-white relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-green-400 text-sm font-medium text-white hover:bg-green-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500");
for(var i = 0;i<butts.length;i++){
  butts[i].addEventListener("click", function(e){
    //This is really bad code, don't try this at home
    //But it works so...
    var img = (e.target.parentNode.parentNode.parentNode.firstElementChild.firstElementChild.firstElementChild.firstElementChild).src;
    img = img.substring(26,img.length);

    chrome.runtime.sendMessage({text: "new_item", data: img});
  });
}


//
//Check for the item and check to see if it was added
//
function newNode(data){
  if(data.relatedNode.type == "button" && data.relatedNode.className == "swal2-confirm"){
    var itemName = document.getElementById("swal2-title").textContent;
    if(itemName != "Are you sure?") chrome.runtime.sendMessage({text: "new_item", data: itemName});
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

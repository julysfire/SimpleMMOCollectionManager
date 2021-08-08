//
//
// Front End Content Functions
//
// Written by Julysfire
//
//
// TODO: Test if jQuery can work on front end to get all the collectables without having to manually go to pages
// TODO: Inclusion of popup
//      TODO: Import/Export of lists in popup, maybe filter all into one and have logic on an input to break up to different lists
// TODO: Get on the Chrome Store
//

//Respond to messages from background
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'report_back') {
        sendResponse(document.all[0].outerHTML);
    }
    if (msg.text === 'inject_icons'){
        injectIcons(msg.data);
        sendResponse();
    }
    if (msg.text === 'block_list_added'){
        addToBlock();
        sendResponse();
    }
});


//
//Used to inject the image next to the image names
//
function injectIcons(inventoryItems){
  for(var i = 0;i<inventoryItems.length;i++){
    var spanElement = document.getElementById("item-id-"+inventoryItems[i][1]);
    var img = new Image();
    if(inventoryItems[i][2] == "need") img.src = chrome.runtime.getURL("imgs/newItem.png");
    else if(inventoryItems[i][2] == "quicksell") img.src = chrome.runtime.getURL("imgs/quickSell.png");
    else img.src = chrome.runtime.getURL("imgs/checkmark.png");
    if(spanElement != null) spanElement.appendChild(img);
  }
}


//
//Used to notify user that item has been added to block list
//
function addToBlock(){
  console.log("got here");
  var parentElement = document.getElementsByClassName("text-sm font-medium text-red-800");
  parentElement = parentElement[0].parentElement;
  console.log(parentElement);
  var newP = document.createElement("p");
  newP.innerHTML = "SMMO Collection Manager: Item has been added to uncollectable items list.  This will be visible upon page refresh.";
  newP.className = "text-sm font-medium text-red-800";
  parentElement.appendChild(newP);

  console.log(parentElement);
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
    chrome.runtime.sendMessage({text: "new_item", data: itemName},function(response){
      //nah
    });
  }
}



//
//Debug/Misc functions
//
function noCallback(){
	//
}

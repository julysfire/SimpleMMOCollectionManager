//Background working
var currentTabId;


//
//First time install, setup storage
//
chrome.runtime.onInstalled.addListener(function(details){
	if(details.reason == "install"){
		chrome.storage.local.set({items: ""}, function(){
		});
		chrome.storage.local.set({newItem: ""}, function(){
		});
	}
});


//
//Tab Listeners
//
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == "complete"){
		currentTabId = tabId;
		if(tab.url.indexOf("collection/collectables") != -1 || tab.url.indexOf("collection/items") != -1){
			chrome.tabs.sendMessage(currentTabId, {text: 'report_back'}, storeCollectionItems);
		}else if(tab.url.indexOf("inventory/items") != -1){
			chrome.tabs.sendMessage(currentTabId, {text: 'report_back'}, checkInventory);
		}
	}
});


//
//Message listener from content_scripts
//
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'new_item'){
        saveNewItem(msg.data);
        sendResponse();
    }
});


//
// Main storage update method
//
function storeCollectionItems(str){
	//Get all item names
	var items = [];
	while(str.search("retrieveItem") > -1){
		str = str.substring(str.search("retrieveItem"),str.length);
		items.push(str.substring(str.search(">")+1,str.search("<")));
		str = str.substring(1,str.length);
	}

	//Check if they are available in storage, if not, store them
	chrome.storage.local.get(["items"], function(data){
		var dataString = data.items+"";
		for(var i =0;i<items.length;i++){
			if(dataString.search(items[i]) == -1){
				dataString = dataString+";"+items[i];
			}
		}
		chrome.storage.local.set({items: dataString}, function(){
		});
	});
}


//
// Main inventory checking method
//
function checkInventory(str){
	var invItems = [];

	//Check if a new item was just added
	if(str.search('class="rounded-md bg-green-50 p-4 my-4"') > -1){
		newItemAdded();
	}

	while(str.search('id="item-id') > -1){
		str = str.substring(str.search('id="item-id'),str.length);

		//Don't worry about foods, i.e. uncollectable
		var subStr = str.substring(str.search('<button type="button"'),str.length);
		subStr = subStr.substring(subStr.search(">")+2,subStr.search("</b")-1);

		//Push to array
		if(subStr == "Collect" || subStr == "Equip") invItems.push([str.substring(str.search(">")+1,str.search("<")), str.substring(12,str.search(">")-1),""]);
		else invItems.push(["zzz","zzz","zzz"]);
		str = str.substring(1,str.length);
	}
	var dataString = "";

	//Check if items are already collected or not
	chrome.storage.local.get(["items"], function(data){
		dataString = data.items+"";
		for(var i =0;i<invItems.length;i++){
			if(dataString.search(invItems[i][0]) > 0){
				invItems[i][2] = "collected"
			}else if(invItems[i][0] == "zzz"){
				invItems[i][2] = "zzz"
			}else invItems[i][2] = "need"
		}
		//Send list over to content
		chrome.tabs.sendMessage(currentTabId, {text: "inject_icons", data: invItems}, noCallback);
	});
}


//
// For copying the new item into the local storage in case it is added to collection
//
function saveNewItem(data){
	chrome.storage.local.set({newItem: data}, function(){
	});
}


//
//For checking/adding new items to the items storage
//
function newItemAdded(){
	chrome.storage.local.get(["newItem","items"],function(data){
		var nItem = data.newItem+"";
		var itemList = data.items+"";

		if(itemList.search(nItem) == -1){
			itemList = itemList+";"+nItem;
			chrome.storage.local.set({items: itemList}, function(){
			});
		}
	});

	//Reset newItem storage
	chrome.storage.local.set({newItem: ""}, function(){
	});
}

function noCallback(){
	//
}

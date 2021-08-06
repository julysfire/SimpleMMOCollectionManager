//Background workings

//First time install, setup storage
chrome.runtime.onInstalled.addListener(function(details){
	if(details.reason == "install"){
		chrome.storage.local.set({items: ""}, function(){
		});
	}
});

//Tab Listeners
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == "complete"){
		if(tab.url.indexOf("collection/collectables") != -1 || tab.url.indexOf("collection/items") != -1){
			chrome.tabs.sendMessage(tabId, {text: 'report_back'}, storeCollectionItems);
		}else if(tab.url.indexOf("inventory/items") != -1){
			chrome.tabs.sendMessage(tabId, {text: 'report_back'}, checkInventory);
		}
	}
});

//
// Mainly storage update method
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
		console.log(dataString);
		chrome.storage.local.set({items: dataString}, function(){
		});
	});
}

//
// Mainly inventory checking method
//
function checkInventory(str){
	var invItems = [];
	while(str.search('id="item-id') > -1){
		str = str.substring(str.search('id="item-id'),str.length);
		//Don't worry about foods, i.e. uncollectable
		var subStr = str.substring(str.search('<button type="button"'),str.length);
		subStr = subStr.substring(subStr.search(">")+2,subStr.search("</b")-1);
		//Push to array
		if(subStr == "Collect" || subStr == "Equip") invItems.push(str.substring(str.search(">")+1,str.search("<")));
		str = str.substring(1,str.length);
	}
	console.log(invItems);
}

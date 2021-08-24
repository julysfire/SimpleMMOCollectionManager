//
//
// Background Functions
//
// Written by Julysfire
//
//https://github.com/julysfire/SimpleMMOCollectionManager
//
//

//Current tab global variable
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
		chrome.storage.local.set({blockList: ";Scalpel of Death;The Hamburger;Attuned Death;The Nokia;The Great Wall Of China;Hatreds Bite;Ivory Chestplate;Leather Armour;Weak Fishing Rod;Weak Shovel;Weak Axe;Weak Pickaxe;Fire Plate;Bootleg T-Shirt;Rusty Axe;Rusty Fishing Rod;Rusty Shovel;Rusty Pickaxe;Attuned Death;Sword for Sloths;Frozen;Simple Dagger;The Devils Right Hand;Rotten Pumpkin;Delicious Candy Cane;Some Geezers Bow;Generic Shirt;Rat;Generic Shirt;Strong Shovel;Strong Axe;Strong Pickaxe;String Fishing Rod;Boar;Zombie;"}, function(){
		});
		chrome.storage.local.set({quicksellThres: 0}, function(){
		});
	}
});


//
//Tab Listeners
//
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status == "complete"){
		currentTabId = tabId;
		if(tab.url.search("collection/collectables") != -1 || tab.url.search("collection/items") != -1){
			chrome.tabs.sendMessage(currentTabId, {text: 'report_back'}, storeCollectionItems);
		}else if(tab.url.search("inventory/items") != -1 || tab.url.search("market") != -1 || tab.url.search("armoury") != -1){
			chrome.tabs.sendMessage(currentTabId, {text: 'report_back'}, checkInventory);
		}else if(tab.url.search("collection/avatars")){
			chrome.tabs.sendMessage(currentTabId, {text: "report_back"}, storeCollectedAvatars);
		}else if(tab.url.search("collection/sprites")){
			chrome.tabs.sendMessage(currentTabId, {text: "report_back"}, storeCollectedSprites);
		}
	}
});


//
//Message listener from content_scripts
//
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'new_item'){
        saveNewItem(msg.data);
    }
		if (msg.text === 'check_inv'){
				chrome.tabs.sendMessage(currentTabId, {text: 'report_back'}, checkInventory);
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
//Logic for finding and storing avatars
//
function storeCollectedAvatars(str){
	console.log("todo");
}


//
//Logic for finding and storing avatars
//
function storeCollectedSprites(str){
	console.log("todo");
}


//
// Main inventory checking method
//
function checkInventory(str){
	var invItems = [];					//[Item Name, Item ID for injecting Icon, collected/have/quicksell]
	var newBlock = false;

	//Check if a new item was just added
	if(str != undefined){
		if(str.search('class="rounded-md bg-green-50 p-4 my-4"') > -1 && str.search('The item has been collected') > -1){
			newItemAdded();
		}
		if(str.search('class="text-sm font-medium text-red-800"') > -1 && str.search('You cannot collect') > -1 && str.search("SMMO Collection Manager: Item has been added to uncollectable items list.") < 0){
			newBlockedItem();
			newBlock = true;
			chrome.tabs.sendMessage(currentTabId, {text: "block_list_added", data: ""});
		}

		chrome.storage.local.get(["blockList","quicksellThres"], function(data){
			var blockListStr = data.blockList+"";
			while(str.search('id="item-id') > -1){
				//Find the item
				str = str.substring(str.search('id="item-id'),str.length);

				//Item Type
				var excludeList = ["Food","Potion","Book","Event Collectable","Material","Other"];
				var itemType = str.substring(str.search("-item border-0")+15,str.search("-item border-0")+50);
				for(var i = 0;i<excludeList.length;i++){
					if(itemType.search(excludeList[i]) > 0) itemType = "zzexcludezz";
				}

				//Quicksell amount
				var itemamount = str.substring(str.search('img src="/img/icons/I_GoldCoin.png')+35, str.length)
				itemamount = (itemamount.substring(itemamount.search(">"),itemamount.search("</div>"))).trim();
				itemamount = itemamount.substring(2,itemamount.length);
				itemamount = itemamount.replace(/,/g,"");
				itemamount  = parseInt(itemamount);

				//Item Name
				var itemName = str.substring(str.search(">")+1,str.search("<"));

				//Item ID
				var itemID = str.substring(12,str.search(">")-1);

				//Push to array
				if(itemType != "zzexcludezz") invItems.push([itemName, itemID,""]);
				else invItems.push(["zzz","zzz","zzz"]);

				//Item only block list, only good thing to do with this item is sell it
				if(blockListStr.search(itemName) > 0) invItems[invItems.length-1][2] = "quicksell";

				//Quicksell items threshold
				if(data.quicksellThres > 0 && itemamount > data.quicksellThres) invItems[invItems.length-1][2] = "quicksell";
				str = str.substring(1,str.length);
			}
		});
		var dataString = "";

		//Check if items are already collected or not
		chrome.storage.local.get(["items"], function(data){
			dataString = data.items+"";
			for(var i =0;i<invItems.length;i++){
				if(invItems[i][2] != "quicksell"){
					if(dataString.search(invItems[i][0]) > 0){
						invItems[i][2] = "collected"
					}else if(invItems[i][0] == "zzz"){
						invItems[i][2] = "zzz"
					}else invItems[i][2] = "need"
				}
			}
		//Send list over to content
		if(newBlock) chrome.tabs.sendMessage(currentTabId, {text: "inject_icons", data: invItems, refreshFlag: true});
		else chrome.tabs.sendMessage(currentTabId, {text: "inject_icons", data: invItems, refreshFlag: false});
		});
	}
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

		if(nItem != ""){
			if(itemList.search(nItem) == -1){
				itemList = itemList+";"+nItem;
				chrome.storage.local.set({items: itemList}, function(){
				});
			}
		}
	});

	//Reset newItem storage
	chrome.storage.local.set({newItem: ""}, function(){
	});
}


//
//Dynamically update the block list
//
function newBlockedItem(){
	chrome.storage.local.get(["newItem","blockList"], function(data){
		var nItem = data.newItem+"";
		var blockListStr = data.blockList+"";

		if(nItem != ""){
			if(blockListStr.search(nItem) == -1){
				blockListStr = blockListStr + ";" + nItem;
				chrome.storage.local.set({blockList: blockListStr},function(){
				});
			}
		}
	});
}



//
//Debug/Misc functions
//


//Console log the stored list
function getStorage(){
  chrome.storage.local.get(["newItem","items","blockList","quicksellThres"], function(data){
		console.log("New Item: " + data.newItem+"");
		console.log("Item List: " + data.items+"");
		console.log("Blocked List: " + data.blockList+"");
		console.log("Quicksell threshold: " + data.quicksellThres+"");
	});
}

//Complete override of a list's data
function setList(str, listName){
	if(listName == "items"){
		chrome.storage.local.set({items: str}, function(){
			console.log("Item storage updated.");
		});
	}else if(listName == "blockList"){
		chrome.storage.local.set({blockList: str}, function(){
			console.log("Block list updated.");
		});
	}else if(listName == "newItem"){
		chrome.storage.local.set({newItem: str}, function(){
			console.log("New Item updated.");
		});
	}else if(listName == "quicksellThres"){
		chrome.storage.local.set({quicksellThres: Number.parseInt(str,10)}, function(){
			console.log("Quicksell Threshold updated.");
		});
	}else console.log("List not found.");
}

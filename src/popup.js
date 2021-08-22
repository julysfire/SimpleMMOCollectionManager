//
//
// Background Functions
//
// Written by Julysfire
//
//https://github.com/julysfire/SimpleMMOCollectionManager
//
//


//
//Event listeners
//
document.addEventListener('DOMContentLoaded',function(){
	//Quick sell input box
	document.getElementById("qsellamt").addEventListener('change',function(){
		quicksellChange(true);
	},false);

	//Import lists button and handling
	document.getElementById("importbutt").addEventListener('change',function(event){
		var fullString = "";
		var finalMessage = "";

		console.log(event.target.files[0]);
		//Not text file
		var fileName = event.target.files[0].name+"";
		if(fileName.substring(fileName.length-4,fileName.length) != ".csv") finalMessage = "Incorrect file format.  Please select .csv files only.";

		if(finalMessage == ""){
			//File reader
			const reader = new FileReader();
			reader.addEventListener('load', function(readerEvent){
				fullString = readerEvent.target.result;

				//Break the list up and update storage items
				if(fullString != undefined && fullString != ""){
					var itemListString = fullString.substring(9,fullString.length);
					itemListString = itemListString.replace(/\n/g,";");
					console.log(itemListString);
					chrome.storage.local.set({items: itemListString}, function(){
					});

					finalMessage = "Item list updated!";
				} else finalMessage = "Selected text file was blank";

				document.getElementById('notifyarea').innerHTML = finalMessage;
			});
			reader.readAsText(event.target.files[0]);
		}

		document.getElementById('notifyarea').innerHTML = finalMessage;
	},false);

	//Export lists button
	document.getElementById("exportbutt").addEventListener('click',function(){
		var fullListString = "";

		//Get lists from storage
		chrome.storage.local.get(["items"], function(data){
			//fullListString = "ItemList; " + data.items;
			var workingArray = (data.items+"").split(";");
			fullListString = "ItemList\n" + workingArray.join("\n");

			//Create new txt file
			var file = new Blob([fullListString], {type: "text/csv"});

			//Create the link that will ultimately be clicked to download the file
			var dllink = document.createElement("a"), url = URL.createObjectURL(file);
			dllink.href = url;
			dllink.download = "SMMOColManFullList.csv";
			document.body.appendChild(dllink);
			dllink.click();

			document.getElementById('notifyarea').innerHTML = "Collection list exported successfully.";
		});
	},false);

	//On demand icon refresh
	document.getElementById("rebuildbutt").addEventListener('click',function(){
		quicksellChange(false);
	},false);

	//Load the quicksell amount to the input box
	if(document.getElementById("qsellamt").value == ""){
		chrome.storage.local.get(["quicksellThres"], function(data){
			document.getElementById("qsellamt").value = data.quicksellThres;
		});
	}
}, false);


//
//Quicksell Threshold amount changed
//
function quicksellChange(fullChange){
	if(fullChange){
		//Get the value, parse as int to be safe, probably can remove
		var quickSellIn = document.getElementById("qsellamt").value;
		quickSellIn = parseInt(quickSellIn, 10);

		//If less then 0, default to 0.  If blank, set to 0
		if(quickSellIn < 0){
			document.getElementById("qsellamt").value = 0;
			quickSellIn = 0;
		}else if(isNaN(quickSellIn)){
			document.getElementById("qsellamt").value = 0;
		}

		//Storage
		chrome.storage.local.set({quicksellThres: quickSellIn}, function(){
		});

		//Announce it has been updated on the popup
		document.getElementById('notifyarea').innerHTML = "Quicksell threshold updated!";
	}

	//Should call back and re-do icons in inventory
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, {text:"remove_icon"});
	});
}

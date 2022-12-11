# SimpleMMO Collection Manager

# As of late 2022, this feature has been integrated into the game and this will no longer be getting updates.  Thank you to all who used this tool.

#### Author: Julysfire
Discord: julysfire#9465

## Description
A Chrome (Chromium based) browser extension that helps determine if you have already collected an item or collectible.  This extension store a list of all the collectibles and equipment that you have added to your collection and when you go to your inventory, will display a green checkmark next to the item name if you have collected that item already.  If you have not collected the item, it will display a red exclamation mark next to the item name.


![Screnshot](https://i.imgur.com/HOJPQZZ.png)


## Installation

### Chrome Webstore
This package is now on the Chrome Webstore where you can download and install straight from there with a click of a button.  After following the link, you can select "Add To Chrome" and it will automatically install on Chrome.

[Link to item on Chrome Webstore](https://chrome.google.com/webstore/detail/simplemmo-collection-mana/ahbjmljpdknlfdgeaffcpdjeadofhplp)

Any updated published to the Chrome Webstore will save the internal memory of what you have stored.  If you are installing manually, updates will wipe the memory so I advise exporting/importing if you are choosing install manually.


### Manual Installation
If you would like to install manually, that can be done using the below steps.

1. Download the .zip from the above or via releases
2. Unzip to wherever you would like to save the extension
3. Navigate to "chrome://extensions"
4. At the top right of the page should  be "Developer mode" with a slide bar, click that slide.
5. You should now have a "Load Unpacked" button in the top right.  Select that and navigate to where the unzipped folder is located.


### Using/About the Extension
- ***Important for first time setup***: Any time you go to your collections page (items and collectibles), the extension will read the page for item names and add them to the internal storage for which items you have.  In this regard, I recommend going through all the pages on your collection tab (items and collectibles) after installing the extension to generate a list of what you already have.
- This extension works on any page that shows your inventory (i.e.  Market, Dumping Grounds, and of course inventory itself)
- Items you add to your collection will automatically be updated.
- There is a default list of items that are bought from the store.  If the extension ever finds an item that is store bought and can't be collected, it will add it to it's internal list and you won't see
- No icons will be displayed for items that have no collection status (i.e. materials, potions, food)

- In the popup (clicking on the extension icon on taskbar or in extension dropdown), you can set a quicksell threshold limit for all items.  Setting this will make any item that quick sells more then the entered amount show a yellow $ icon instead of the green/red icon.
- In the same popup, you can import and export your current lists.  Exported lists save as .csv files so you can easily use this in Excel.  For importing lists, you can select the .csv that was created by extension or you can make it yourself (start with "ItemList" in A1 and then each A row after that, add an item name).

### Current WIP
- Continue exploring options that would eliminate having to go to the collection to generate the list of already collected items the first time.  This would be handy but may be border line on the rules so...that may be a wash.
- Any bugs that may pop up.
- Other stuff that comes to mind.


### Bug Reports
Please contact me here by raising an issue or on Discord at julysfire#9465.

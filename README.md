# SimpleMMO Collection Manager

#### Author: Julysfire
Discord: julysfire#9465

#### Description
A Chrome (Chromium based) browser extension that helps determine if you have already collected an item or collectible.  This extension store a list of all the collectibles and equipment that you have added to your collection and when you go to your inventory, will display a green checkmark next to the item name if you have collected that item already.  If you have not collected the item, it will display a red exclamation mark next to the item name.


![Screnshot](https://i.imgur.com/HOJPQZZ.png)


### Installation
Currently, this is not on the chrome web store.  Once I do some more development on the extension, I will get it uploaded to the web store.

1. Download the .zip from the above or via releases
2. Unzip to wherever you would like to save the extension
3. Navigate to "chrome://extensions"
4. At the top right of the page should  be "Developer mode" with a slide bar, click that slide.
5. You should now have a "Load Unpacked" button in the top right.  Select that and navigate to where the unzipped folder is located.


### Using/About the Extension
- Any time you go to your collections page (items and collectibles), the extension will read the page for item names and add them to the internal storage for which items you have.  In this regard, I recommend going through all the pages on your collection tab (items and collectibles) after installing the extension to generate a list of what you already have.
- This extension works on any page that shows your inventory (i.e.  Market, Dumping Grounds, and of course inventory itself)
- Items you add to your collection will automatically be updated.
- There is a default list of items that are bought from the store.  If the extension ever finds an item that is store bought and can't be collected, it will add it to it's internal list and you won't see
- No icons will be displayed for items that have no collection status (i.e. materials, potions, food)
- It doesn't really work well super well with item sprites or avatars at the moment.  Looking to improve on that.  Unfortunately, these two pages don't list item names in the collection tab so I am unable to get a list of already owned items at the moment.
- In the popup (clicking on the extension icon on taskbar or in extension dropdown), you can set a quicksell threshold limit for all items.  Setting this will make any item that quick sells more then the entered amount show a yellow $ icon instead of the green/red icon.
- In the same popup, you can import and export your current lists.  Exported lists save as .csv files so you can easily use this in Excel.  For importing lists, you can select the .csv that was created by extension or you can make it yourself (start with "ItemList" in A1 and then each A row after that, add an item name).

### Current WIP
- Get extension on webstore
- Formatting on the popup to make it much less basic.
- Better integration with Item Sprites being added to the collected list from inventory.  This would prevent buying extra.  However, still cannot get a list of already owned sprites due to no names being generated on the pages.
- Continue exploring options that would eliminate having to go to the collection to generate the list of already collected items the first time.  This would be handy but may be border line on the rules so...that may be a wash.
- Any bugs that may pop up.
- Other stuff that comes to mind.

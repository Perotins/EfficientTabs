const tabLimit = 10; // Set the desired tab limit here

let tabAccessHistory = [];

chrome.tabs.onCreated.addListener(function (newTab) {
    chrome.tabs.query({}, function (tabs) {
        if (tabs.length > tabLimit) {
            const oldestTab = tabAccessHistory.shift();
            chrome.tabs.remove(oldestTab);
        }
    });
    mergeDuplicateTabs();
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    const tabIndex = tabAccessHistory.indexOf(activeInfo.tabId);
    if (tabIndex > -1) {
        tabAccessHistory.splice(tabIndex, 1);
    }
    tabAccessHistory.push(activeInfo.tabId);
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    const tabIndex = tabAccessHistory.indexOf(tabId);
    if (tabIndex > -1) {
        tabAccessHistory.splice(tabIndex, 1);
    }
});

function mergeDuplicateTabs() {
    chrome.tabs.query({}, function (tabs) {
        const urlMap = {};

        tabs.forEach((tab) => {
            if (urlMap[tab.url]) {
                chrome.tabs.remove(tab.id);
            } else {
                urlMap[tab.url] = true;
            }
        });
    });
}

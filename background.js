let addressFrom = "";
let addressTo = "";

const loadAddresses = () => {
    chrome.storage.local.get(["addressFrom", "addressTo"], function (result) {
        addressFrom = result.addressFrom || "";
        addressTo = result.addressTo || "";

        if (addressFrom && addressTo) {
            console.log("Addresses loaded:", { addressFrom, addressTo });
        }
    });
};

const checkAndRedirect = (currentUrl, tabId) => {
    if (currentUrl === addressFrom && addressTo) {
        tryUpdateTab(tabId, addressTo);
    }
};

const tryUpdateTab = (tabId, url, retries = 5) => {
    chrome.tabs.update(tabId, { url: url }, () => {
        if (chrome.runtime.lastError && retries > 0) {
            console.error(chrome.runtime.lastError.message);
            setTimeout(() => tryUpdateTab(tabId, url, retries - 1), 100);
        }
    });
};

loadAddresses();

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.addressFrom) {
        addressFrom = changes.addressFrom.newValue || "";
    }
    if (changes.addressTo) {
        addressTo = changes.addressTo.newValue || "";
    }
    console.log("Addresses updated:", { addressFrom, addressTo });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        checkAndRedirect(changeInfo.url, tabId);
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        checkAndRedirect(tab.url, activeInfo.tabId);
    });
});

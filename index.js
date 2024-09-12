document.addEventListener("DOMContentLoaded", function () {
    let addressFrom = "";
    let addressTo = "";

    const saveAddresses = () => {
        chrome.storage.local.set({ addressFrom, addressTo }, function () {
            console.log("Addresses saved:", { addressFrom, addressTo });
        });
    };

    const loadAddresses = () => {
        chrome.storage.local.get(["addressFrom", "addressTo"], function (result) {
            addressFrom = result.addressFrom || "";
            addressTo = result.addressTo || "";
            document.getElementById("inputAddress").value = addressFrom;
            document.getElementById("inputRedirect").value = addressTo;
            console.log("Addresses loaded:", { addressFrom, addressTo });
        });
    };

    loadAddresses();

    const inputAddress = document.getElementById("inputAddress");
    const inputRedirect = document.getElementById("inputRedirect");

    inputAddress.addEventListener("input", function () {
        addressFrom = inputAddress.value;
        console.log("Address from:", addressFrom);
        saveAddresses();
    });

    inputRedirect.addEventListener("input", function () {
        addressTo = inputRedirect.value;
        console.log("Address to:", addressTo);
        saveAddresses();
    });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setPopup({popup: "show.html"});
});

chrome.tabs.onCreated.addListener(() => {
  chrome.action.setPopup({popup: "show.html"});
});

chrome.tabs.onUpdated.addListener(() => {
  chrome.action.setPopup({popup: "show.html"});
});




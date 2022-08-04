chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setPopup({popup: "show.html"});


});


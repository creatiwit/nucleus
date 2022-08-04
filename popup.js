const windows = await chrome.windows.getAll({populate: true});


var dict = {}

for (const win of windows) {
  for (const tab of win.tabs) {
    const title = tab.title;
    const pathname = tab.url;
    const tld = new URL(tab.url).hostname;
    if (!tld) {
      continue;

    }

    if (dict[tld]) {
      dict[tld].push([title, pathname, tab.id])
    } else {
      dict[tld]= [[title, pathname, tab.id]]
    }
  }
}

let template = document.querySelector('#tabs')
let html = ''

html += `
  <details> 
    <summary>
    <strong>Total TLD ${Object.keys(dict).length}</strong>
    </summary>
    </details>
    `



for (const [key, value] of Object.entries(dict)) {
  html += `
    <details>
  <summary><h2> ${key} ${value.length} </h2> </summary>
    <ul>`;

  html += `<div id="tabs">`;
    
  for(const v of value) {
    html += `<li id="${v[2]}">
      <h3> <strong>Title:</strong> ${v[0]} </h3>
      <p><strong>Path:</strong> ${v[1]} </p>
      <button id="${v[2]}">Jump</button>
      <button id="${v[2]}">Remove</button>
      </li> 
    `
  }
  html += '</div> </ul>'

html += '</details>';
}


template.innerHTML = html;

const wrapper =  document.getElementById("tabs");
wrapper.addEventListener('click', (event) => {
   const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }
  const button_text = event.target.textContent;

  if (button_text == "Jump") {
    activateWindow(parseInt(event.target.id));
  }
  if (button_text == "Remove") {
    DropTab(parseInt(event.target.id));
  }


});

function activateWindow(tab_id) {
  chrome.tabs.get(tab_id, (tab) => { 
    const win_id = tab.windowId;
    console.log("Win ID: ", win_id);
    chrome.windows.update(win_id, {'focused':true}, (win) => { 
      chrome.tabs.update(parseInt(tab_id), {'highlighted': true}); 
    });
  })
}

function DropTab(tab_id) {
  chrome.tabs.remove(tab_id);
   var item = document.getElementById(tab_id);
   item.parentNode.removeChild(item);
}

function Refresh() {

}


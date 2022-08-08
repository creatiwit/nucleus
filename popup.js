const windows = await chrome.windows.getAll({populate: true});


var dict = {}
var tld_dup = {}
var dup = {}
var dup_total = 0

for (const win of windows) {
  for (const tab of win.tabs) {
    const title = tab.title;
    const pathname = tab.url;
    const tld = new URL(tab.url).hostname;
    if (!tld) {
      continue;

    }
    if (dup[pathname]) {
      dup_total +=1;
    } else {
      dup[pathname] = pathname;
    }


    if (dict[tld]) {
      dict[tld].push([title, pathname, tab.id])
    } else {
      dict[tld]= [[title, pathname, tab.id]]
    }
  }
}

for (const [key, value] of Object.entries(dict)) {
  var tab_dup = {};
  const tld = key;
  for (const v of value) {
    const pathname = v[1];
    if (tab_dup[pathname]) {
      console.log(pathname);
      tld_dup[tld] += 1;
    } else {
      tab_dup[pathname] = pathname;
      tld_dup[tld] = 0;
    }
  }
}


let template = document.querySelector('#tabs')
let html = ''

html += `
  <details> 
    <summary>
    <strong>Total TLD ${Object.keys(dict).length}</strong>
    <strong> Total Dups ${dup_total}</strong>
    </summary>
    </details>
    `

var keys = Object.keys(dict);
keys.sort();


for (const key of keys) {
  const value = dict[key];
  const dup_count = tld_dup[key];
  html += `
    <details>
      <summary><h2> ${key} ${value.length} ${dup_count} </h2> </summary>
    <ul>`;

  html += `<div id="tabs">`;
    
  for(const v of value) {
    html += `<li id="${v[2]}">
      <h3> <strong>Title:</strong> ${v[0]}</h3>
      <p><strong>Path:</strong> ${v[1]} </p>
      <button id="${v[2]}">Jump</button>
      <button id="${v[2]}">Remove</button>
      </li> 
    `
  }
  html += '</div> </ul>'

html += '</details>';
template.innerHTML += html;
html = '';
}



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


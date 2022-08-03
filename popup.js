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
      dict[tld].push([title, pathname])
    } else {
      dict[tld]= [[title, pathname]]
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
  <summary><strong> ${key} ${value.length} </strong> </summary>
    <ul>`;
    
  for(const v of value) {
    html += `<li>
      <p>
      <strong>Title:</strong> ${v[0]} </p>
      <p><strong>Path:</strong> ${v[1]} </p>
      </li> 
    `
  }
  html += '</ul>'
html += '</details>';
}


template.innerHTML = html;


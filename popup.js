// Load the list of blocked sites from localStorage
let blockedSites = JSON.parse(localStorage.getItem('blockedSites')) || [];

// Update the site list on the page
function updateSiteList() {
  const siteList = document.getElementById('siteList');
  siteList.innerHTML = '';
  blockedSites.forEach((site) => {
    const li = document.createElement('li');
    li.textContent = site;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      blockedSites = blockedSites.filter((s) => s !== site);
      localStorage.setItem('blockedSites', JSON.stringify(blockedSites));
      updateSiteList();
      // Notify the background script about the updated list
      chrome.runtime.sendMessage({ action: 'updateBlockedSites', sites: blockedSites });
    });
    li.appendChild(removeButton);
    siteList.appendChild(li);
  });
}

// Add a new site to the block list
document.getElementById('addSite').addEventListener('click', () => {
  const site = document.getElementById('siteInput').value.trim();
  if (site && !blockedSites.includes(site)) {
    blockedSites.push(site);
    localStorage.setItem('blockedSites', JSON.stringify(blockedSites));
    updateSiteList();
    // Notify the background script about the updated list
    chrome.runtime.sendMessage({ action: 'updateBlockedSites', sites: blockedSites });
  }
});

// Initialize the site list when the popup loads
updateSiteList();
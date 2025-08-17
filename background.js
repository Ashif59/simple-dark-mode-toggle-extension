// Set the initial state when the extension is installed.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ isEnabled: false });
});

// Apply dark mode to a tab when it's updated.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Ensure the page is fully loaded and has a URL that we can inject scripts into
  if (changeInfo.status === 'complete' && tab.url && (tab.url.startsWith('http') || tab.url.startsWith('file'))) {
    chrome.storage.sync.get('isEnabled', ({ isEnabled }) => {
      if (isEnabled) {
        chrome.scripting.insertCSS({
          target: { tabId: tabId },
          files: ['dark.css']
        }).catch(err => console.log('Error inserting CSS:', err));
      } else {
        chrome.scripting.removeCSS({
          target: { tabId: tabId },
          files: ['dark.css']
        }).catch(err => console.log('Error removing CSS:', err));
      }
    });
  }
});

const toggle = document.getElementById('darkModeToggle');
const cssFile = 'dark.css';

// Function to apply or remove CSS on all applicable tabs
async function updateAllTabs(isEnabled) {
    const tabs = await chrome.tabs.query({ url: ["http://*/*", "https://*/*"] });
    for (const tab of tabs) {
        try {
            if (isEnabled) {
                await chrome.scripting.insertCSS({
                    target: { tabId: tab.id },
                    files: [cssFile]
                });
            } else {
                await chrome.scripting.removeCSS({
                    target: { tabId: tab.id },
                    files: [cssFile]
                });
            }
        } catch (err) {
            console.error(`Failed to update tab ${tab.id}:`, err);
        }
    }
}

// Initialize the toggle state when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('isEnabled', ({ isEnabled }) => {
    toggle.checked = isEnabled;
  });
});

// Add listener for toggle changes
toggle.addEventListener('change', async (event) => {
  const isEnabled = event.target.checked;
  // Save the new state
  chrome.storage.sync.set({ isEnabled });
  // Update all tabs with the new state
  await updateAllTabs(isEnabled);
});

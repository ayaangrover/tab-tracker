let userId = null;
chrome.storage.local.get(['userId'], (result) => {
    if (result.userId) {
        userId = result.userId;
        startTrackingTabs();
    }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'login') {
        userId = request.userId;

        chrome.storage.local.set({ userId: userId }, () => {
            console.log('User ID saved in background script.');
        });

        startTrackingTabs();
        sendResponse({ status: 'Tracking started' });
    }
});

function startTrackingTabs() {
    setInterval(async () => {
        if (!userId) return; 

        const tabs = await chrome.tabs.query({});
        tabs.forEach(async (tab) => {
            const tabVisited = tab.url; 
            await trackActivity(userId, tabVisited);
        });
    }, 1000);
}

async function trackActivity(userId, tabVisited) {
    if (tabVisited) {
        await fetch('https://d1af270f-5b2a-4e81-97ef-1383b66ba676-00-1an6e8o4o3ogo.worf.replit.dev/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, tabVisited })
        });
    }
}

async function loadRules() {
    const response = await fetch(chrome.runtime.getURL('rules.json'));
    const rules = await response.json();

    const ruleIds = rules.map(rule => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds,
        addRules: rules
    }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error loading rules:", chrome.runtime.lastError);
        } else {
            console.log("Rules loaded successfully");
        }
    });
}

loadRules();

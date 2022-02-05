function getRandomArbitrary(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}

let currInterval;
let alarm_interval;

chrome.runtime.onInstalled.addListener(() => {
    alarm_interval = Math.ceil(getRandomArbitrary(5, 60));
    chrome.alarms.create("hotdog", { periodInMinutes: alarm_interval });
    console.log(`Current alarm interval: ${alarm_interval} minutes`);
    chrome.storage.local.set({ 'nextalarm': Date.now() + (alarm_interval * (1000 * 60)) }, function() {
        currInterval = setInterval(() => {
            chrome.storage.local.get('nextalarm', function(retrievedData) {
                console.log(`${((retrievedData.nextalarm - Date.now())/(1000*60)).toFixed(2)} minutes left until alarm goes off!`);
            })
        }, (15 * 1000));
    })

    chrome.alarms.onAlarm.addListener((alarmo) => {
        chrome.tabs.query({ active: true, currentWindow: true}, function(tabs) {
            openTab = tabs[0]
            if (alarmo.name == "hotdog") {
                chrome.tabs.create({
                    active: true,
                    index: 0,
                    pinned: true,
                    url: "https://www.pictureofhotdog.com/"
                }, function() { 
                    chrome.alarms.clear("hotdog", function() {
                        let alarm_interval = Math.ceil(getRandomArbitrary(5, 60));
                        chrome.alarms.create("hotdog", { periodInMinutes: alarm_interval });
                        console.log(`current alarm interval: ${alarm_interval} minutes`);
                        clearInterval(currInterval);
                        chrome.storage.local.set({ 'nextalarm': Date.now() + (alarm_interval * (1000 * 60)) }, function () {
                            currInterval = setInterval(() => {
                                chrome.storage.local.get('nextalarm', function(retrievedData) {
                                    console.log(`${((retrievedData.nextalarm - Date.now())/(1000 * 60)).toFixed(2)} minutes left until alarm goes off!`);
                                })
                            }, (15 * 1000));
                        })
                    });
                });
            }
        })
    })
    
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.greeting == "removeAlarm") { 
                clearInterval(currInterval);   
                chrome.alarms.clear("hotdog");
                sendResponse({ msg: "Alarm removed!" });
            }
        }
    );
});
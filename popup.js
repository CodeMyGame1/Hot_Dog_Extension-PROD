window.onload = function() {
    document.getElementById('removealarm').addEventListener("click", function() {
        chrome.runtime.sendMessage({ greeting: "removeAlarm" }, function handler(response) {
            alert(response.msg);
        })
    })
}
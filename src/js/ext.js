window.__NBD_EXTENSION__ = true;

$(document).ready(function () {

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        $('#uri').val(tabs[0].url);
    });
});

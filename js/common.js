let data = {};


function openResultsPage() {
  chrome.tabs.create({'url': chrome.extension.getURL('html/index.html')});
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.global_detailed_data) {
    data['global_detailed_data'] = request.global_detailed_data;
    data['global_data'] = request.global_data;
    openResultsPage();
    }

    if (request.requestData) {
    	sendResponse({data: data});
    }


});

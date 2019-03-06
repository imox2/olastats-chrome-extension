let data = {};


function openResultsPage() {
	console.log("openResultsPage");
  chrome.tabs.create({'url': chrome.extension.getURL('html/index.html')});
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(request);
  if (request.global_detailed_data) {
    data['global_detailed_data'] = request.global_detailed_data;
    data['global_data'] = request.global_data;
    openResultsPage();
    }

    if (request.requestData) {
    	console.log("request common:",request);
    	console.log("Data:",data);
    	sendResponse({data: data});
    }


});

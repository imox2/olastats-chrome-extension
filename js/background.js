chrome.browserAction.onClicked.addListener(function (tab) {
  console.log(tab);
  const url = new URL(tab.url);
  if (url.hostname.endsWith("olacabs.com")) {
    console.log("olacabs.com matched");
    chrome.tabs.executeScript({
        file: 'js/libs/jquery.js'
    }, function() {
        // Guaranteed to execute only after the previous script returns
        chrome.tabs.executeScript({
            file: 'ola_stats.js'
        });
    });
  } else {
    chrome.tabs.executeScript(null, {
      file: "js/libs/sweetalert2.all.min.js"
    }, _ => {
      chrome.tabs.executeScript(null, {
        file: "js/incorrect-site-error.js"
      });
    });
  }
});

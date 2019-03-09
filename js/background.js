chrome.browserAction.onClicked.addListener(function (tab) {
  console.log(tab);
  const url = new URL(tab.url);

  var kind_of_url_to_avoid_sweet_alert = ["extensions","newtab","chrome.google.com"];
  //alert(url.hostname.endsWith("olacabs.com"));
  
  console.log(url);
  if (url.hostname.endsWith("olacabs.com")) {
    console.log('olacabs.com');
    console.log("olacabs.com matched");
    chrome.tabs.executeScript({
        file: 'js/libs/jquery.js'
    }, function() {
        // Guaranteed to execute only after the previous script returns
        chrome.tabs.executeScript({
            file: 'ola_stats.js'
        });
    });
  } else if(kind_of_url_to_avoid_sweet_alert.indexOf(url.hostname)!=-1) {
    //if it is url to avoid it as sweet alet wont work as scripts dont have permisiion on these pages
    //lets avoid sweet alert and show simple
    console.log('not olacabs.com');
    run_new_tab_alert();
    
  }
  else {
    chrome.tabs.executeScript(null, {
      file: "js/libs/sweetalert2.all.min.js"
    }, _ => {
      chrome.tabs.executeScript(null, {
        file: "js/incorrect-site-error.js"
      });
    });
  }
});


  var run_new_tab_alert = async () => {
    console.log("swal");

  value = window.confirm("You are not on ola's website. Should We take you to ola?");
  console.log(value);
  if (value) {
      window.open("https://book.olacabs.com/", "_blank");
  }
};


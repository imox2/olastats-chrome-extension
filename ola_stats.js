// Make all global variables "var" so that they can be redeclared upon multiple executions of the script
var global = {};
global.trip_data = [];

global.trip_detailed_data = [];

global.total_trip_count = 0;
global.new_tab_opened = 0;
global.current_trip_count = 0;
global.send_to_new_tab_limit = 0;

//var ONE_TRIP_ENDPOINT = 'https://book.olacabs.com/web-api/v3/ride-details?bookingId=';
var TRIPS_ENDPOINT_PAGES = 'https://book.olacabs.com/pwa-api/rides?pageNumber=';
var TRIP_DETAIL_ENDPOINT= 'https://book.olacabs.com/web-api/v3/ride-details?bookingId=';

$(_ => {

  if (window.location.hostname === "book.olacabs.com") {
    startOlaRidesAnalysis();
    //console.log("SendDataToNewTab from start"); 
    //SendDataToNewTab();

  } else {
    if (confirm("You must be on https://book.olacabs.com to use this tool! Redirecting now.")) {
      window.location.href = "https://book.olacabs.com";
    }
  }
});

function calculate_ajax_request_stop_limit(total_rides) {
	if(total_rides<=30) {
		global.send_to_new_tab_limit = total_rides;
	}
	else if(total_rides>30 && total_rides<=70) {
		global.send_to_new_tab_limit = total_rides-4;
	}
	else if(total_rides>70 && total_rides<=150) {
		global.send_to_new_tab_limit = total_rides-8;
	}
	else if(total_rides>150 && total_rides<=250) {
		global.send_to_new_tab_limit = total_rides-12;
	}
	else {
		global.send_to_new_tab_limit = total_rides-12;
	}
}

function startOlaRidesAnalysis() {

  // Insert CSS for overlay
  $(document.head).append(`<style>
#overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 999;
  cursor: pointer;
}

#text{
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 50px;
  color: white;
  transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
  text-align: center;
}</style>`);

  // Set text to "Processing"
  $('body').prepend(`<div id="overlay"><div id="text">Processing API</div></div>`);
  requestDataFromOla(1,0);
}

function requestDataFromOla(pageNumber,prevPageKey) {
  console.log("pageNumber:",pageNumber);
  let url_end_point=""
  if(pageNumber == 1)
     url_end_point = TRIPS_ENDPOINT_PAGES+pageNumber;
  else
    url_end_point = TRIPS_ENDPOINT_PAGES+pageNumber+'&pageKey='+prevPageKey;

  $.ajax({
    method: 'GET',
    url: url_end_point,
    success(response, textStatus, jqXHR) {


      if (response && response.data) {

        let contents = response.data.rides;
        //global.trip_data.push(contents);
        global.trip_data = [...global.trip_data, ...contents];
        let trips_processed = pageNumber*10;
        if(response.data.hasNextPage) {
          // $("#text").html(`Processed ${trips_processed} Trips`);
          console.log("hasNextPage");
          pageNumber = pageNumber+1;
          requestDataFromOla(pageNumber,response.data.pageKey);
        }
        else {
          // $("#text").html(`Processed All ${trips_processed} Trips`);
          console.log("total:",global.trip_data);
          // setTimeout(function(){ 
          //   checkIfCompleteOriginalAPI(); }, 3000);
          findDetailOfEachBooking();
          
        }
      }
      else if(response.error.code = "NOT_LOGGED_IN") {

          $("#overlay").hide();
          alert("Please sign in and click ola stats icon again!");
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      // if (isFirstRun) {
      //     $("#overlay").hide();
      //     alert("Please sign in and click ola stats icon again!");
      //     return;
      //   }
    }
  });
}

function findDetailOfEachBooking() {
  //loop over each data and get each booking data
  global.total_trip_count = global.trip_data.length;
  calculate_ajax_request_stop_limit(global.total_trip_count);
  let bookingIds = {};

  for (var key in global.trip_data)
  {
    let bookingId = global.trip_data[key]['bookingId'];
    // if(typeof bookingIds[bookingId] == "undefined") {
    //   bookingIds[bookingId] = 1;
      requestDetailedDataFromOla(bookingId).then((data)=>{
      	console.log("success:",data);
      	console.log("count:",global.current_trip_count);
      	if(global.current_trip_count==global.total_trip_count) {
	        	if(global.new_tab_opened==0) {
	        		global.new_tab_opened=1;
	        		SendDataToNewTab();
	        	}
	          $("#overlay").hide();
	          console.log(global.trip_detailed_data);
	          
	        }
      });
    // }
    // else {
    //   console.log("duplicate booking id:",bookingId);
    // }
    // console.log("bookingId:",bookingId);
    // console.log("key:",key);
    

  }
}

function requestDetailedDataFromOla(bookingId) {
  // https://book.olacabs.com/web-api/v3/ride-details?bookingId=CRN2550040195
  return new Promise((resolve, reject) => {
	  $.ajax({
	    method: 'GET',
	    url: TRIP_DETAIL_ENDPOINT+bookingId,
	    success(response, textStatus, jqXHR) {
	      if (response && response.data) {
	        let content = {};
	        content['billingDetails'] = response.data.billingDetails;
	        content['carDetails'] = response.data.carDetails;
	        content['driverDetails'] = response.data.driverDetails;
	        content['rideDetails'] = response.data.rideDetails;


	        global.trip_detailed_data.push(content);
	       // console.log("before:",global.current_trip_count);
	        global.current_trip_count = global.current_trip_count +1;
	        //console.log("after:",global.current_trip_count);

	        $("#text").html(`Processing API <br>${global.current_trip_count} of ${global.total_trip_count}`);

	        // setTimeout(function(){ 
	          //   checkIfCompleteOriginalAPI(); }, 3000);
	          console.log("success");
	          resolve(1);
	        // if(global.current_trip_count>=global.send_to_new_tab_limit) {
	        // 	if(global.new_tab_opened==0) {
	        // 		global.new_tab_opened=1;
	        // 		SendDataToNewTab();
	        // 	}
	        //   $("#overlay").hide();
	        //   console.log(global.trip_detailed_data);
	          
	        // }
	      }
	      else {
	      	//{"data":null,"error":{"status":"FAILURE","message":"We were unable to process your request. Please try again."}}
	      		global.current_trip_count = global.current_trip_count +1;
	      		console.log("failure");
	      		$("#text").html(`Processing API <br>${global.current_trip_count} of ${global.total_trip_count}`);
	      		resolve(0);
	      }
	    },
	    error: function (xhr, ajaxOptions, thrownError) {

	        // if (isFirstRun) {
	        //   $("#overlay").hide();
	        //   alert("Please sign in and click UberStats icon again!");
	        //   return;
	        // }
	        global.current_trip_count = global.current_trip_count +1;
	        console.log("success");
	        resolve(0);
	        // if(global.current_trip_count==global.total_trip_count) {
	        //   $("#overlay").hide();
	        //   //console.log(global.trip_detailed_data);
	        //   SendDataToNewTab();
	        // }
	        // else if(global.current_trip_count>=global.send_to_new_tab_limit) {
	        // 	if(global.new_tab_opened==0) {
	        // 		global.new_tab_opened=1;
	        // 		SendDataToNewTab();
	        // 	}
	        //   $("#overlay").hide();        
	        // }
	        
	      //checkIfCompleteOriginalAPI();
	    }
	  });
	});
}

function SendDataToNewTab() {
    // Once all requests have completed, trigger a new tab and send the data
    // let serialized = {};
    // serialized.data = [...global.data];
    console.log("SendDataToNewTab:",global.trip_detailed_data); 
    chrome.runtime.sendMessage({global_detailed_data: global.trip_detailed_data,global_data:global.trip_data});
    $("#overlay").hide();
}





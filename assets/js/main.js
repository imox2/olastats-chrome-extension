let global = {};

$(_ => {
  chrome.runtime.sendMessage({requestData: true}, function (response) {
    console.log("main js:",response);
    global.trip_data = response.data['global_detailed_data'];
    global.trip_data_summary = response.data['global_data'];
    transform_single_object_to_multiple_specific_flat_objects();
    //$("#modal-notification").show();
    //$("#modal-notification").collapse('toggle');
    //registerClickHandlers();
    activate_click_handler();
  });
});

function activate_click_handler() {
  

  //$("#modal-notification").show();
  //  $("#modal-notification").collapse('toggle');
  $(".remove_modal").on('click', function(event){
    $("#modal-notification").hide();
    //(... rest of your JS code)
  });

  $("#share").click(e => {
    let completed = $("#all_stat_total_completed_rides").text();
    let money = $("#all_stat_total_fare_modal").text();
    let text = `I've taken ${completed} Ola Rides, and have spent Rs ${money} on Ola Rides! Check out your numbers using Ola Trip Stats on Chrome store `;
    window.open("https://twitter.com/share?url=https://chrome.google.com/webstore/detail/ola-trip-stats/aonoimokllfbaojdcaokdodpmpbgfhhk&text=" + encodeURIComponent(text), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    // window.open("https://twitter.com/share?url=https://chrome.google.com/webstore&text=" + encodeURIComponent(text), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    return false;
  });

}

function remove_modal() {
  
}

function get_trip_time_as_minutes(start_time,end_time) {

  var start_time =  moment(start_time, 'hh:mm A');
  var end_time = moment(end_time, 'hh:mm A');

  var duration = moment.duration(end_time.diff(start_time));

  return duration.asMinutes();

}

function drawChart() {
  

  var years = [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050];
// For drawing the lines
var africa = [86,114,106,106,107,111,133,221,783,2478];
var asia = [282,350,411,502,635,809,947,1402,3700,5267];
var europe = [168,170,178,190,203,276,408,547,675,734];
var latinAmerica = [40,20,10,16,24,38,74,167,508,784];
var northAmerica = [6,3,2,2,7,26,82,172,312,433];

var ctx = document.getElementById("chart-sales");
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: years,
    datasets: [
      { 
        data: africa
      }
    ]
  }
});
}

function sort_object(obj) {

  var sortable = [];
  for (var driver_url in obj) {
      sortable.push([driver_url, obj[driver_url]]);
  }

  sortable.sort(function(a, b) {
      return b[1] - a[1];
  });

  //{"a":90,"b":88,"c":909}
  //[[c,909],[a,90],[b,88]]
  return sortable;
}

function show_all_stats(trip_type_obj,total_fare,pick_up_address_obj,drop_address_obj,driver_photo_obj,driver_detail,car_ride_type_obj,car_type_obj,total_distance,coupon_applied,total_time,completed_ride_by_year_obj,completed_ride_by_month_obj,most_expensive_trip_value) {

  let canceled_trip = (typeof trip_type_obj["CANCELLED"] !="undefined")?trip_type_obj["CANCELLED"]:0;
  let completed_trip = (typeof trip_type_obj["COMPLETED"] !="undefined")?trip_type_obj["COMPLETED"]:0;
  let total_rides = canceled_trip+completed_trip

  $("#all_stat_total_rides").text(total_rides);
  $("#all_stat_total_canceled_rides").text(canceled_trip);
  $("#all_stat_total_completed_rides").text(completed_trip);

  $("#all_stat_total_fare").text(total_fare); 
  $("#all_stat_total_fare_modal").text(total_fare); 
  $("#all_stat_total_drop_location").text(Object.keys(drop_address_obj).length);
  $("#all_stat_total_pick_up_location").text(Object.keys(pick_up_address_obj).length);


  //find fav pick up spot
  if(Object.keys(pick_up_address_obj).length>0) {
    sorted_array = sort_object(pick_up_address_obj);
    if(sorted_array.length>0) {
      $("#all_stat_fav_pick_up").text(sorted_array[0][0]+" ( "+sorted_array[0][1]+" )");
    }
    else {
      $("#all_stat_fav_pick_up").text("No Pick Up Address Yet");
    }
  }
  else {
    $("#all_stat_fav_pick_up").text("No Pick Up Address Yet");
  }

  //find fav drop down  spot
  if(Object.keys(drop_address_obj).length>0) {
    sorted_array = sort_object(drop_address_obj);
    if(sorted_array.length>0) {
      $("#all_stat_fav_drop").text(sorted_array[0][0]+" ( "+sorted_array[0][1]+" )");
    }
    else {
      $("#all_stat_fav_drop").text("No Drop Address Yet");
    }
  }
  else{
    $("#all_stat_fav_drop").text("No Drop Address Yet");
  }

  //find fav driver
  if(Object.keys(driver_photo_obj).length>0) {
    sorted_array = sort_object(driver_photo_obj);
    if(sorted_array.length>0) {
      $("#all_stat_fav_driver").text(driver_detail[sorted_array[0][0]]['name']+" ( "+sorted_array[0][1]+" )");
    }
    else {
      $("#all_stat_fav_driver").text("No Favourite Driver Yet");
    }
  }
  else{
    $("#all_stat_fav_driver").text("No Favourite Driver Yet");
  }

  // find favourite vehicle
  if(Object.keys(car_ride_type_obj).length>0) {
    sorted_array = sort_object(car_ride_type_obj);
    if(sorted_array.length>0) {
      $("#all_stat_often_used").text(sorted_array[0][0]+" ( "+sorted_array[0][1]+" )");
    }
    else {
      $("#all_stat_often_used").text("No Often Used Vehicle Yet");
    }
  }
  else{
    $("#all_stat_often_used").text("No Often Used Vehicle Yet");
  }

  //find favourite vehicle type
  if(Object.keys(car_type_obj).length>0) {
    sorted_array = sort_object(car_type_obj);
    if(sorted_array.length>0) {
      $("#all_stat_fav_ride_type").text(sorted_array[0][0]+" ( "+sorted_array[0][1]+" )");
    }
    else {
      $("#all_stat_fav_ride_type").text("No Favourite Ride Type Yet");
    }
  }
  else{
    $("#all_stat_fav_ride_type").text("No Favourite Ride Type Yet");
  }

  //find of vehicle ridden on 
    $("#all_stat_unique_vehicle_used").text(Object.keys(car_ride_type_obj).length);

  //coupon applied

    $("#all_stat_coupon_applied").text(coupon_applied);

  //total distance travelled

    $("#all_stat_total_distance").text(total_distance+" km");

  //total_time
    $("#all_stat_total_time").text(total_time+" minutes");



    //highest completed ride of month
    if(Object.keys(completed_ride_by_year_obj).length>0) {
    sorted_array = sort_object(completed_ride_by_year_obj);
      if(sorted_array.length>0) {
        $("#all_stat_busiest_year").text(sorted_array[0][0]+" ( "+sorted_array[0][1]+" )");
      }
      else {
        $("#all_stat_busiest_year").text("No Busy Year Yet");
      }
    }
    else{
      $("#all_stat_busiest_year").text("No Busy Year Yet");
    }

    //busiest monyh
    let month_mapper = {"1":"January","2":"February","2":"March","4":"April","5":"May","6":"June","7":"July","8":"August","9":"September","10":"October","11":"November","12":"December"} //json

    if(Object.keys(completed_ride_by_month_obj).length>0) {
    sorted_array = sort_object(completed_ride_by_month_obj);
      if(sorted_array.length>0) {
        $("#all_stat_busiest_month").text(month_mapper[sorted_array[0][0]]+" ( "+sorted_array[0][1]+" )");
      }
      else {
        $("#all_stat_busiest_month").text("No Busy Month Yet");
      }
    }
    else{
      $("#all_stat_busiest_month").text("No Busy Month Yet");
    }

    $("#all_stat_expensive").text(most_expensive_trip_value);

}

function transform_single_object_to_multiple_specific_flat_objects() {
  //drawChart();
  let trip_data = global.trip_data;
  let trip_data_summary = global.trip_data_summary;
  let trip_type_obj = {};
  let pick_up_address_obj = {};
  let drop_address_obj = {};
  let car_ride_type_obj = {};
  let car_type_obj = {};
  let driver_photo_obj= {};
  let city_name_obj = {};
  let driver_detail = {};
  let fare_for_ride_type_obj = {};
  let completed_ride_by_year_obj = {};
  let completed_ride_by_month_obj = {};
  let total_time_minutes_by_ride_type = {};
  let fare_by_month_obj = {};
  let fare_by_year_obj = {};
  let distance_by_month_obj = {};
  let distance_by_year_obj = {};


  let total_distance = 0.0;
  let most_expensive_trip_value = 0;
  let total_time = 0;
  let total_time_minutes = 0;
  let coupon_applied = 0;
  let total_fare = 0.0;

  for(var key in trip_data_summary) {
    let data = trip_data_summary[key];



    if(data['status']=="COMPLETED") {
    let fare = 0.0;
    fare = (typeof data['totalFare']!="undefined" && data['totalFare'])?data['totalFare']:0.0;
    console.log("fare:",fare);
      if(fare!=0.0) {
        fare = fare.match(/\d+/)[0] // rs 67 to 67
        fare = parseFloat(fare);
        total_fare = total_fare + fare;

        if(fare>=most_expensive_trip_value) {
          most_expensive_trip_value = fare;
        }
      }

        //completed_ride_by_year_obj

        //find day month and year of trip
        if(typeof data['bookingTimestamp']!="undefined") {

          //timestamp is wrong so multiply by *1000
        date_data = convert_date_string_to_date_month_year(data['bookingTimestamp']*1000);

        if(typeof completed_ride_by_year_obj[date_data['year']] != "undefined") {
          completed_ride_by_year_obj[date_data['year']] = completed_ride_by_year_obj[date_data['year']]+1;
        }
        else {
          completed_ride_by_year_obj[date_data['year']] = 1;
        }


        //completed_ride_by_month_obj



        if(typeof completed_ride_by_month_obj[date_data['month']] != "undefined") {
          completed_ride_by_month_obj[date_data['month']] = completed_ride_by_month_obj[date_data['month']]+1;
        }
        else {
          completed_ride_by_month_obj[date_data['month']] = 1;
        }

        //fare_by_month_obj

        
        if(typeof fare_by_month_obj[date_data['month']] != "undefined") {
          fare_by_month_obj[date_data['month']] = fare_by_month_obj[date_data['month']]+fare;
        }
        else {
          fare_by_month_obj[date_data['month']] = fare;
        }

        //fare_by_year_obj

        
        if(typeof fare_by_year_obj[date_data['year']] != "undefined") {
          fare_by_year_obj[date_data['year']] = fare_by_year_obj[date_data['year']]+fare;
        }
        else {
          fare_by_year_obj[date_data['year']] = fare;
        }

        

        //fare type obj : s=for share you spent 5666 for mini 6788
        

        if(typeof fare_for_ride_type_obj[data['displayName']] != "undefined") {
          fare_for_ride_type_obj[data['displayName']] = fare_for_ride_type_obj[data['displayName']]+fare;
        }
        else {
          fare_for_ride_type_obj[data['displayName']] = fare;
        }
      }
    }
  }

  for(var key in trip_data) {
    //let data = trip_data[key]['data'];
    let data = trip_data[key];

    //trip_type : completed, cancelled etc
    if(typeof trip_type_obj[data['rideDetails']['status']] != "undefined") {
      trip_type_obj[data['rideDetails']['status']] = trip_type_obj[data['rideDetails']['status']]+1;
    }
    else {
      trip_type_obj[data['rideDetails']['status']] = 1;
    }

    //ride time and data


    



    // if status completed then check billing details along with fare convert_date_string_to_date_month_year(timestamp)

    //sometimes billingdetails is {} even when ride is complete so we will take out biling data plus pick up time data from trip_data_summary



    if(data['rideDetails']['status']=="COMPLETED") {
        

        let distance = 0.0;
        distance = (typeof data['billingDetails']['distance']!="undefined")?data['billingDetails']['distance']:0.0;
 
        if(distance!=0.0) {
          distance = distance.match(/[\d\.]+/g)[0]  // "67.87 km " => 67.87
          distance = parseFloat(distance);
          total_distance = total_distance + distance;
        }

        

        if(typeof data['rideDetails']['pickupTime']!="undefined" && typeof data['rideDetails']['dropTime']!="undefined") {
          total_time = total_time + get_trip_time_as_minutes(data['rideDetails']['pickupTime'],data['rideDetails']['dropTime'])
        }

        
        //city_name_obj jaipur, mumbai etc

        if(typeof city_name_obj[data['rideDetails']['city']] != "undefined") {
          city_name_obj[data['rideDetails']['city']] = city_name_obj[data['rideDetails']['city']]+1;
        }
        else {
          city_name_obj[data['rideDetails']['city']] = 1;
        }

        //pick_up_address : anfield road, ajay marg etc
        if(typeof pick_up_address_obj[data['rideDetails']['pickupAddress']] != "undefined") {
          pick_up_address_obj[data['rideDetails']['pickupAddress']] = pick_up_address_obj[data['rideDetails']['pickupAddress']]+1;
        }
        else {
          pick_up_address_obj[data['rideDetails']['pickupAddress']] = 1;
        }

        //car ride type: share, micro, mini
        if(data['carDetails']['carType']!="") {
          if(typeof car_ride_type_obj[data['carDetails']['carType']] != "undefined") {
          car_ride_type_obj[data['carDetails']['carType']] = car_ride_type_obj[data['carDetails']['carType']]+1;
          }
          else {
            car_ride_type_obj[data['carDetails']['carType']] = 1;
        }
        }

        //drop_address : anfield road, ajay marg etc

        if(typeof drop_address_obj[data['rideDetails']['dropAddress']] != "undefined") {
          drop_address_obj[data['rideDetails']['dropAddress']] = drop_address_obj[data['rideDetails']['dropAddress']]+1;
        }
        else {
          drop_address_obj[data['rideDetails']['dropAddress']] = 1;
        }

        // car type: white sift dzire
        if(typeof car_type_obj[data['carDetails']['categoryDisplayName']] != "undefined") {
          car_type_obj[data['carDetails']['categoryDisplayName']] = car_type_obj[data['carDetails']['categoryDisplayName']]+1;
        }
        else {
          car_type_obj[data['carDetails']['categoryDisplayName']] = 1;
        }

        

        //distance_by_year_obj
        if(typeof data['rideDetails']['pickupTimestamp']!="undefined") {
        date_data = convert_date_string_to_date_month_year(data['rideDetails']['pickupTimestamp']);
        
        if(typeof distance_by_year_obj[date_data['year']] != "undefined") {
          distance_by_year_obj[date_data['year']] = distance_by_year_obj[date_data['year']]+distance;
        }
        else {
          distance_by_year_obj[date_data['year']] = distance;
        }

        //distance_by_month_obj

        
        if(typeof distance_by_month_obj[date_data['year']] != "undefined") {
          distance_by_month_obj[date_data['year']] = distance_by_month_obj[date_data['year']]+distance;
        }
        else {
          distance_by_month_obj[date_data['year']] = distance;
        }

        
      }
    }

        

        

         // driver_photo because it is unique; can determine 
         if(typeof data['driverDetails']['photo']!="undefined" && data['driverDetails']['photo']!="") {
            driver_detail[data['driverDetails']['photo']] = data['driverDetails'];
            if(typeof driver_photo_obj[data['driverDetails']['photo']] != "undefined") {
              driver_photo_obj[data['driverDetails']['photo']] = driver_photo_obj[data['driverDetails']['photo']]+1;
            }
            else {
              driver_photo_obj[data['driverDetails']['photo']] = 1;
            }
        }

    



    if(data['rideDetails']['couponApplied']) {
      coupon_applied = coupon_applied+1;
    }

     
        

        
    }


  console.log("trip_type_obj:",trip_type_obj);
    console.log("pick_up_address_obj:",pick_up_address_obj);
    console.log("drop_address_obj:",drop_address_obj);
    console.log("car_ride_type_obj:",car_ride_type_obj);
    console.log("car_type_obj:",car_type_obj);
    console.log("driver_detail:",driver_detail);
    console.log("driver_photo_obj:",driver_photo_obj);
    console.log("fare_for_ride_type_obj:",fare_for_ride_type_obj);

    console.log("completed_ride_by_year_obj:",completed_ride_by_year_obj);
    console.log("completed_ride_by_month_obj:",completed_ride_by_month_obj);
    //console.log("total_time_minutes_by_ride_type:",total_time_minutes_by_ride_type);
    console.log("fare_by_month_obj:",fare_by_month_obj);
    console.log("fare_by_year_obj:",fare_by_year_obj);
    console.log("distance_by_month_obj:",distance_by_month_obj);
    console.log("distance_by_year_obj:",distance_by_year_obj);
    
    total_distance = parseFloat(Math.round(total_distance * 100) / 100).toFixed(2);

    console.log("total_distance:",total_distance);
    console.log("coupon_applied:",coupon_applied);
    console.log("total_fare:",total_fare);
    console.log("total_time:",total_time);



    show_all_stats(trip_type_obj,total_fare,pick_up_address_obj,drop_address_obj,driver_photo_obj,driver_detail,car_ride_type_obj,car_type_obj,total_distance,coupon_applied,total_time,completed_ride_by_year_obj,completed_ride_by_month_obj,most_expensive_trip_value);



}

function convert_date_string_to_date_month_year(timestamp) {
  var d = new Date(timestamp)
  var month = d.getUTCMonth() + 1; //months from 1-12
  var day = d.getUTCDate();
  var year = d.getUTCFullYear();

  return {"month":month,"day":day,"year":year};

}

function startStatistics() {
  console.log(global);

  findTotalRideByType();
  addTotalRidesStat();
  addTotalPaymentMethodsStat();

  calculateMoneySpent();
  calculateTripTypesStat();
  calculateTripCompletionStats();
  calculateTripLengthsStat();
  calculateDriverStats();
  calculateCityStats();
  calculatePickupAndDropoffStats();
  calculateMonthAndYearStats();
  calculateDistanceStats();
  calculateCarMakeStats();

  addNumTripsChart();
}

function addTotalRidesStat() {
  // Total # trips
  $("#total-rides").text(global.trips.size);
}

function addTotalPaymentMethodsStat() {
  // Total # payment methods
  $("#num-payment").text(global.payment.size);
}

function calculateMoneySpent() {
  let totalSpent = {};
  let totalAcrossAllCurrencies = 0;
  let completedTrips = 0;
  global.trips.forEach(t => {
    if (t.clientFare) {
      if (!totalSpent.hasOwnProperty(t.currencyCode)) {
        totalSpent[t.currencyCode] = 0;
      }
      totalSpent[t.currencyCode] += t.clientFare;

      totalAcrossAllCurrencies += getCurrencyConversionIfExists(t.currencyCode, t.clientFare);
    }
    if (t.status === "COMPLETED") {
      completedTrips++;
    }
  });

  // $ spent stats
  $("#total-payment").text("~$" + totalAcrossAllCurrencies.toFixed(2));
  let totalSpentText = "";
  let currencyKeys = getSortedKeysFromObject(totalSpent, true);
  for (const key of currencyKeys) {
    let currencySymbol = getSymbolFromCode(key);
    totalSpentText += `<span class="subheading">${key}</span><span class="stat"> ${currencySymbol + totalSpent[key].toFixed(2)}</span><br>`;
  }
  $("#total-spent").html(totalSpentText);
  $("#average-price").text("~$" + (totalAcrossAllCurrencies / completedTrips).toFixed(2));
  addPriceChart();
}

function calculateTripTypesStat() {
  let tripTypes = {};

  global.trips.forEach(t => {
    if (t.vehicleViewName) {
      let name = t.vehicleViewName;
      // Some have :MATCHED appended, randomly?
      name = name.split(":")[0];
      name = uppercaseFirst(name);
      if (!tripTypes.hasOwnProperty(name)) {
        tripTypes[name] = 0;
      }
      tripTypes[name]++;
    }
  });

  let rideTypesText = constructTextSpan(tripTypes, true);
  $("#rides-by-type").html(rideTypesText);
}

function calculateTripLengthsStat() {
  let tripLengths = [];
  global.trips.forEach(t => {
    if (t.status === "COMPLETED") {
      let requestTime = new Date(t.requestTime);
      let dropoffTime = new Date(t.dropoffTime);
      let lengthMs = dropoffTime.getTime() - requestTime.getTime();
      tripLengths.push(lengthMs);
    }
  });
  // Trip lengths
  tripLengths.sort((a, b) => a - b);
  $("#shortest-ride").text(Math.abs(Math.round(tripLengths[0] / (60 * 1000))) + " Minutes");
  $("#longest-ride").text(Math.abs(Math.round(tripLengths[tripLengths.length - 1] / (60 * 1000))) + " Minutes");
  let totalTimeText = "";
  let totalTime = tripLengths.reduce((a, b) => a + b, 0);
  totalTimeText += `<span class="subheading">Seconds</span><span class="stat"> ${Math.round(totalTime /= 1000)}</span><br>`;
  if (totalTime > 60) {
    totalTimeText += `<span class="subheading">Minutes</span><span id="minutes" class="stat"> ${Math.round(totalTime /= 60)}</span><br>`;
  }
  if (totalTime > 60) {
    totalTimeText += `<span class="subheading">Hours</span><span class="stat"> ${Math.round(totalTime /= 60)}</span><br>`;
  }
  if (totalTime > 24) {
    totalTimeText += `<span class="subheading">Days</span><span class="stat"> ${(totalTime /= 24).toFixed(2)}</span><br>`;
  }

  $("#total-time").html(totalTimeText);
}

function calculateTripCompletionStats() {
  let canceledTrips = 0;
  let completedTrips = 0;
  let driverCanceledTrips = 0;
  let surgeTrips = 0;

  global.trips.forEach(t => {
    if (t.isSurgeTrip) {
      surgeTrips++;
    }
    if (t.status === "COMPLETED") {
      completedTrips++;
    } else if (t.status === "CANCELED") {
      canceledTrips++;
    } else if (t.status === "DRIVER_CANCELED") {
      driverCanceledTrips++;
    }
  });

  // Completed and canceled rides
  $("#canceled-rides").text(canceledTrips);
  $("#completed-rides").text(completedTrips);
  $("#surge-rides").text(surgeTrips);
  $("#driver-canceled-rides").text(driverCanceledTrips);
}

function calculateDriverStats() {
  let driverCounts = {};

  global.trips.forEach(t => {
    if (t.driverUUID) {
      if (!driverCounts.hasOwnProperty(t.driverUUID)) {
        driverCounts[t.driverUUID] = 0;
      }
      driverCounts[t.driverUUID]++;
    }
  });
  let drivers = getSortedKeysFromObject(driverCounts, true);
  let iterNum = Math.min(5, drivers.length);
  let driverText = "";
  for (let i = 0; i < iterNum; i++) {
    const favoriteDriver = global.drivers.get(drivers[i]);
    const firstname = favoriteDriver.firstname || "";
    const lastname = favoriteDriver.lastname || "";
    driverText += `<span class="subheading">${firstname} ${lastname}</span><span class="stat"> ${driverCounts[favoriteDriver.uuid]} rides</span><br>`;
  }
  $("#same-driver").html(driverText);
}

function calculateCityStats() {
  let cityCounts = {};

  global.trips.forEach(t => {
    if (t.cityID) {
      if (!cityCounts.hasOwnProperty(t.cityID)) {
        cityCounts[t.cityID] = 0;
      }
      cityCounts[t.cityID]++;
    }
  });

  let cities = getSortedKeysFromObject(cityCounts, true);
  let cityCountsText = '';
  for (const key of cities) {
    cityCountsText += `<span class="subheading">${global.cities.get(parseInt(key)).name}</span><span class="stat"> ${cityCounts[key]}</span><br>`;
  }
  $("#rides-by-city").html(cityCountsText);
}

function calculatePickupAndDropoffStats() {
  let pickups = {};
  let dropoffs = {};
  global.trips.forEach(t => {
    if (t.dropoffFormattedAddress) {
      if (!dropoffs.hasOwnProperty(t.dropoffFormattedAddress)) {
        dropoffs[t.dropoffFormattedAddress] = 0;
      }
      dropoffs[t.dropoffFormattedAddress]++;
    }
    if (t.begintripFormattedAddress) {
      if (!pickups.hasOwnProperty(t.begintripFormattedAddress)) {
        pickups[t.begintripFormattedAddress] = 0;
      }
      pickups[t.begintripFormattedAddress]++;
    }
  });

  let pickupText = constructTextSpan(pickups, true, 3);
  $("#fave-pickup").html(pickupText);

  let dropoffText = constructTextSpan(dropoffs, true, 3);
  $("#fave-dropoff").html(dropoffText);
}

function calculateMonthAndYearStats() {
  let years = {};
  let months = {};
  global.trips.forEach(t => {
    let date = new Date(t.requestTime);
    let year = date.getFullYear();
    let month = date.toLocaleString("en-us", {
      month: "long"
    });
    if (!years.hasOwnProperty(year)) {
      years[year] = 0;
    }
    years[year]++;
    if (!months.hasOwnProperty(month)) {
      months[month] = 0;
    }
    months[month]++;
  });

  let yearKeys = Object.keys(years);
  yearKeys.sort((a, b) => {
    return yearKeys[a] - yearKeys[b];
  });
  let yearText = '';
  for (const key of yearKeys) {
    yearText += `<span class="subheading">${key}</span><span class="stat"> ${years[key]}</span><br>`;
  }
  $("#rides-by-year").html(yearText);
  // object which holds the order value of the month
  const monthNames = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
  };

  let monthKeys = Object.keys(months);
  monthKeys.sort((a, b) => {
    return monthNames[a] - monthNames[b];
  });
  let monthText = '';
  for (const key of monthKeys) {
    monthText += `<span class="subheading">${key}</span><span class="stat"> ${months[key]}</span><br>`;
  }
  $("#rides-by-month").html(monthText);
}

function calculateDistanceStats() {
  let distances = {};

  global.trips.forEach(t => {

    if (t.receipt) {
      let receipt = t.receipt;
      if (!distances.hasOwnProperty(receipt.distance_label)) {
        distances[receipt.distance_label] = 0;
      }
      distances[receipt.distance_label] += parseFloat(receipt.distance);
    }
  });

  let distanceKeys = getSortedKeysFromObject(distances, true);
  if (distanceKeys.length) {
    $(".hidden").removeClass("hidden");
    let distanceText = '';
    for (const key of distanceKeys) {
      distanceText += `<span class="subheading">${uppercaseFirst(key)}</span><span class="stat"> ${Math.round(distances[key])}</span><br>`;
    }
    $("#distances").html(distanceText);
    addDistanceChart();
  }
}

function calculateCarMakeStats() {
  let carMakes = {};

  global.trips.forEach(t => {
    if (t.receipt) {
      let receipt = t.receipt;
      if (!carMakes.hasOwnProperty(receipt.car_make)) {
        carMakes[receipt.car_make] = 0;
      }
      carMakes[receipt.car_make]++;
    }
  });

  if (Object.keys(carMakes).length) {
    $(".hidden").removeClass("hidden");
    let carText = constructTextSpan(carMakes, true, 3);
    $("#rides-by-car").html(carText);
  }
}

function addNumTripsChart() {
  const ctx = document.getElementById("rides-chart").getContext('2d');
  let data = {};
  global.trips.forEach(t => {
    let requestTime = new Date(t.requestTime);
    // Get date that is first of the month to provide lower bound
    let lowerBound = new Date(requestTime.getFullYear(), requestTime.getMonth(), 1);
    if (!data.hasOwnProperty(lowerBound.getTime())) {
      data[lowerBound.getTime()] = 0;
    }
    data[lowerBound.getTime()]++;
  });
  let times = Object.keys(data);
  times.sort((a, b) => a - b);
  // Fill in 0s for months with no rides
  if (times && times.length) {
    // Month of first uber ride ever
    let monthToCheck = new Date(parseInt(times[0]));
    let now = new Date();
    while (monthToCheck < now) {
      if (!data.hasOwnProperty((monthToCheck.getTime()))) {
        data[monthToCheck.getTime()] = 0;
      }
      monthToCheck = monthToCheck.next().month();
    }
  }
  // Get the keys again, as we might've just added some 0 months
  times = Object.keys(data);
  times.sort((a, b) => a - b);
  let finalCounts = [];
  for (const key of times) {
    finalCounts.push({
      x: new Date(parseInt(key)),
      y: data[key]
    });
  }

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: "Rides Taken",
        data: finalCounts,
        fill: false,
        borderColor: 'black'

      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: "Rides by Month"
      },
      scales: {
        xAxes: [{
          type: "time",
          time: {
            unit: 'month'
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'value'
          }
        }]
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          title: function (tooltipItem, data) {
            return tooltipItem[0].xLabel.replace("1, ", "");
          }
        }
      }
    }
  });
  $("#rides-chart").css('background-color', 'white');
  chart.render();

}

function addDistanceChart() {
  const ctx = document.getElementById("distance-chart").getContext('2d');
  let data = {};
  global.trips.forEach(t => {
    if (t && t.receipt) {
      let requestTime = new Date(t.requestTime);
      if (!data.hasOwnProperty(requestTime.getTime())) {
        let distance = parseFloat(t.receipt.distance);
        if (t.receipt.distance_label_short === "km") {
          distance *= 0.62137119; // convert km to miles
        }
        data[requestTime.getTime()] = distance;
      }
    }
  });
  const times = Object.keys(data);
  times.sort((a, b) => a - b);
  let finalCounts = [];
  let distanceTraveled = 0;
  for (const key of times) {
    distanceTraveled += data[key];
    finalCounts.push({
      x: new Date(parseInt(key)),
      y: distanceTraveled
    });
  }
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: "Total Traveled",
        data: finalCounts,
        fill: true,
        borderColor: 'black'

      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: "Total Distance Traveled (miles)"
      },
      scales: {
        xAxes: [{
          type: "time",
          time: {
            unit: 'month'
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'value'
          }
        }]
      }
    }
  });
  $("#distance-chart").css('background-color', 'white');
  chart.render();

}

function addPriceChart() {
  const ctx = document.getElementById("price-chart").getContext('2d');
  let data = {};
  global.trips.forEach(t => {
    if (t && t.clientFare) {
      let requestTime = new Date(t.requestTime);
      if (!data.hasOwnProperty(requestTime.getTime())) {
        data[requestTime.getTime()] = getCurrencyConversionIfExists(t.currencyCode, parseFloat(t.clientFare));
      }
    }
  });
  const times = Object.keys(data);
  times.sort((a, b) => a - b);
  let finalCounts = [];
  let totalSpent = 0;
  for (const key of times) {
    totalSpent += data[key];
    finalCounts.push({
      x: new Date(parseInt(key)),
      y: totalSpent
    });
  }
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: "Total Spent (Aggregate, no currency conversion)",
        data: finalCounts,
        fill: true,
        borderColor: 'black'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: "Total Spent"
      },
      scales: {
        xAxes: [{
          type: "time",
          time: {
            unit: 'month'
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'value'
          }
        }]
      }
    }
  });
  $("#price-chart").css('background-color', 'white');
  chart.render();

}

function registerClickHandlers() {
  $("#export").click(async e => {
    let trips = [...global.trips.values()];
    const {value} = await Swal.fire({
      title: 'CSV or JSON',
      input: 'radio',
      inputOptions: {
        csv: "CSV",
        json: "JSON"
      }
    });
    if (value) {
      if (value === 'csv') {
        let csv = convertArrayOfObjectsToCSV({
          data: trips
        });
        if (csv == null) {
          return;
        }
        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'trips.csv';
        hiddenElement.click();
        alert("Note: Fields that are JSON objects are base64 encoded");

      } else if (value === "json") {
        let json = JSON.stringify(trips);
        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/json;charset=utf-8,' + encodeURI(json);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'trips.json';
        hiddenElement.click();
      }
    }
  });

  $("#share").click(e => {
    let minutes = $("#minutes").text();
    if (minutes) {
      minutes = minutes.trim();
    }
    let numUbers = global.trips.size;
    let text = `I've taken ${numUbers} Ubers, and have spent ${minutes} minutes in Ubers! Check out your numbers using RideShareStats by @jonlucadecaro here: `;
    window.open("https://twitter.com/share?url=https://chrome.google.com/webstore/detail/uber-trip-stats/kddlnbejbpknoedebeojobofnbdfhpnm&text=" + encodeURIComponent(text), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    return false;
  });
  
  $("#export-image").click(e => {
    $(".should-hide-in-image").hide();
    let options = {backgroundColor: '#000'};
    html2canvas($('.container')[0], options).then(function (canvas) {
      console.log(canvas);
      let a = document.createElement('a');
      // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
      a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      a.download = 'stats.png';
      a.style.display = 'none';
      a.click();
      $(".should-hide-in-image").show();
    });
  });
}

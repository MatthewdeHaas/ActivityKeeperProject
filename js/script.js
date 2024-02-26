get_activities(200); // stores the activities in localStorage - TODO: modify so that is returns > 200 activities or if empty return all activities
//console.log(localStorage.getItem("activities"));
const activities_json = JSON.parse(localStorage.getItem("activities")); // 


//console.log(JSON.stringify(activities_json));

function partition_data(activity_data, number_of_weeks, data_type, sport_type=null) {
  var data_x = [];
  var data_y = [];
  let i, j = 0;
  var monday = getMonday(activity_data[j]);
  for (i = 0, j = 0; j < activity_data.length; j++) {
    if (new Date(activity_data[j]) < monday) {
      monday = getMonday(activity_data[j]);
      i++;
      if (i >= number_of_weeks) break;
    }
      var next_monday = getMonday(activity_data[j]);
      next_monday.setDate(next_monday.getDate() + 6);
      var date_string = String(monday).substring(4, 10).concat(" - ").concat(String(next_monday).substring(4, 10));
      //var date_string = String(monday).substring(4, 10); // just the first monday as the label
      var time = get_data_by_type(data_type, sport_type, j);
      if (data_x.length <= i || data_y.length <= i) {
        data_x.push(date_string);
        data_y.push(time);
      } else {
        data_y[i] += time;
      }
      
  }
  return [data_x.reverse(), data_y.map((x) => Math.round(x * 100) / 100).reverse()];
}

// Citation: https://stackoverflow.com/questions/4156434/javascript-get-the-first-day-of-the-week-from-current-date#:~:text=Using%20the%20getDay,one%2C%20for%20example%3A
// modified so that the monday date object being returned has a time of 00:00:00
function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  d = new Date(d.setDate(diff)); // original monday
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // monday with time 00:00:00
}

function get_data_by_type(data_type, sport_type, index) {
  var data = 0;
  switch(data_type) {
    case "time":
      data = parseInt(activities_json[index].moving_time) / 3600.0; // time in hr
      break;
    case "dist":
      data = parseInt(activities_json[index].distance) / 1000.0; // distance in km
      break;
    case "elev":
      data = parseInt(activities_json[index].total_elevation_gain); // elevation in m
      break;
    case "hr":
      if (activities_json[index].has_heartrate) {
        data = parseInt(activities_json[index].average_heartrate); // heart rate in bpm
      } else data = 0;
      break;
  }
  return (sport_type == null || activities_json[index].type.toLowerCase() == sport_type) ? data : 0;
}

function make_chart(chart_id, data, title, label_y) {
 return new Chart(chart_id, {
    type: "line",
    data: {
        labels: data[0],
        datasets: [{
          label: label_y,
            fill: false,
            lineTension: 0.3,
            backgroundColor: "rgba(244, 81, 30, 1.0)",
            borderColor: "rgba(244, 81, 30, 0.5)",
            data: data[1]
        }]
    },
    options: {
        title: {
          display: true,
          text: title,
          fontSize: 24,
          fontColor: "rgba(244, 81, 30, 1.0)"
        },
        legend: {display: false},
        scales: {
          xAxes: [
            {scaleLabel: {
              display: true,
              labelString: "Weeks",
              fontSize: 24,
              fontColor: "rgba(244, 81, 30, 1.0)"
            },
            gridLines: {
              display: false
            }
          }
          ],
          yAxes: [ 
            {ticks: {min: 0}},
            {scaleLabel: {
              display: true,
              labelString: label_y,
              fontSize: 24,
              fontColor: "rgba(244, 81, 30, 1.0)"
            },
            gridLines: {
              display: false
            }
          },
          ],
        }
    }
});
}

function adjust_graphs(volume_type) {
  let time_btn = document.getElementById("time-btn");
  let dist_btn = document.getElementById("dist-btn");
  let elev_btn = document.getElementById("elev-btn");
  switch(volume_type) {
    case "time":
      time_btn.style.backgroundColor = "#b26148"
      dist_btn.style.backgroundColor = "#f4511e"
      elev_btn.style.backgroundColor = "#f4511e"
      graph.destroy();
      graph = make_chart(document.getElementById("weekly-volume"), partition_data(times, number_of_weeks, "time"), "Weekly Time", "Time (hrs)");
      break;
    case "dist":
      time_btn.style.backgroundColor = "#f4511e"
      dist_btn.style.backgroundColor = "#b26148"
      elev_btn.style.backgroundColor = "#f4511e"
      graph.destroy();
      graph = make_chart(document.getElementById("weekly-volume"), partition_data(times, number_of_weeks, "dist", "run"), "Weekly Distance (run)", "Distance (km)");
      break;
    case "elev":
      time_btn.style.backgroundColor = "#f4511e"
      dist_btn.style.backgroundColor = "#f4511e"
      elev_btn.style.backgroundColor = "#b26148"
      graph.destroy();
      graph = make_chart(document.getElementById("weekly-volume"), partition_data(times, number_of_weeks, "elev"), "Weekly Elevation", "Elevation (m)");
      break;
  }
}



var times = [];
for (let i = 0; i < activities_json.length; i++) {times.push(activities_json[i].start_date)}
const number_of_weeks = 8;
let graph = make_chart(document.getElementById("weekly-volume"), partition_data(times, number_of_weeks, "dist", "run"), "Weekly Distance", "Distance (km)");


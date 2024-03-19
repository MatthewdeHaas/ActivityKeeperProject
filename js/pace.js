// input: an array of length three containing the hours, minutes, and seconds, in that order
// output: base ten equivalent of the given time in minutes
function time_to_decimal(time) {
    return (time[0] * 60) + time[1] + (time[2] / 60);
}

// input: base ten equivalent of the given time in minutes
// output: an array of length three containing the hours, minutes, and seconds, in that order
function decimal_to_time(n) {
    let hr = Math.floor(n / 60.0);
    n = n % 60;
    let min = Math.floor(n);
    return [hr, min, Math.round((n - min) * 60)];
}

function get_speed(distance, time) {
    return distance / (time_to_decimal(time) / 60);
}

// input: time is a array of 3 values: [hours, mins, secs] where each are within their respective domains, units ("km" or "mile"),
// and a range (boolean)
// output: a time array or an array of two values if range is true
function get_pace(time, units="km", speed="easy", range=false) {
    // bounds and validation checking
    for (let i = 0; i < time.length; i++) if (isNaN(time[i])) return [NaN];
    if (time[1] < 0 || time[1] > 60 || time[2] < 0 || time[2] > 60) return [NaN];
    
    // pace
    let conversion_factor = 1;
    if (units.trim().toLowerCase() == "mile") conversion_factor = 1.609; // mile conversion factor
    let pb_speed = get_speed(5, time); // speed in km/hr for a 5k

    switch (speed.toLowerCase()) {
        case "10k": // 5-6 seconds slower per lap (400m) than 5k
        return [decimal_to_time((time_to_decimal(time) * 0.08 + (5 / 60)) / 0.4 * conversion_factor), decimal_to_time((time_to_decimal(time) * 0.08 + (6 / 60)) / 0.4 * conversion_factor)];
        case "tempo": // 15-20 seconds slower per km than 5k
        return [decimal_to_time((time_to_decimal(time) / 5 + (15 / 60)) * conversion_factor), decimal_to_time((time_to_decimal(time) / 5 + (20 / 60)) * conversion_factor)];
        case "easy":
            return range ? [decimal_to_time((60 / (0.75 * pb_speed)) * conversion_factor), decimal_to_time((60 / (0.55 * pb_speed)) * conversion_factor)] : [decimal_to_time((60 / (0.65 * pb_speed)) * conversion_factor)];
    }
  }

// input: an array of length three containing the hours, minutes, and seconds, in that order
function format_time(time) {

    // adds a zero to any single digit number
    for (let i = 0; i < time.length; i++) {
        for (let j = 0; j < time[i].length; j++) {
            if (time[i][j] < 10) time[i][j] = "0".concat(time[i][j]);
            if (isNaN(time[i][j])) return NaN;
        }
    }
    // gets the times from the time array
    let s1 = String(time[0][0]) + ":" + String(time[0][1]) + ":" + String(time[0][2]);
    let s2 = "";
    // time array of length two -> range required
    if (time.length == 2) s2 = String(time[1][0]) + ":" + String(time[1][1]) + ":" + String(time[1][2]);
    // cut off the hours if not required
    if (s1.substring(0, 2) == "00") s1 = s1.substring(3);
    if (s2 != "") {
        if (s2.substring(0, 2) == "00") s2 = s2.substring(3);
        s2 = " - ".concat(s2);
    }
    return s1 + s2;
}

function submit_pb() {
    let time = [0, document.getElementById("min").value, document.getElementById("sec").value];
    for (let i = 0; i < time.length; i++) if (time[i] == "") time[i] = 0;
    time = time.map((x) => parseInt(x));

    let units;
    document.getElementById("km_btn").style.backgroundColor.toString() == "rgb(178, 97, 72)" ? units = "km" : units = "mile";


    let tenkm_pace_text = document.getElementById("10k-pace-label").innerText;
    let tempo_pace_text = document.getElementById("tempo-pace-label").innerText;
    let easy_pace_text = document.getElementById("easy-pace-label").innerText;
    //let easy_pace_range_text = document.getElementById("easy-pace-range-label").innerText;

    document.getElementById("10k-pace-label").innerText = tenkm_pace_text.substring(0, tenkm_pace_text.indexOf(":") + 1) + " " + format_time(get_pace(time, units, speed="10k", range=true)) + " min/" + units.toString();
    document.getElementById("tempo-pace-label").innerText = tempo_pace_text.substring(0, tempo_pace_text.indexOf(":") + 1) + " " + format_time(get_pace(time, units, speed="tempo", range=true)) +  " min/" + units.toString();
    document.getElementById("easy-pace-label").innerText = easy_pace_text.substring(0, easy_pace_text.indexOf(":") + 1) + " " + format_time(get_pace(time, units, speed="easy", range=false)) + " min/" + units.toString();
    //document.getElementById("easy-pace-range-label").innerText = easy_pace_range_text.substring(0, easy_pace_range_text.indexOf(":") + 1) + " " + format_time(get_pace(time, units, speed="easy", range=true)) + " min/" + units;
  }



  // TODO: make this change the actual units (use conversion factor parameter)
function adjust_units_buttons(units) {
    let km_btn = document.getElementById("km_btn");
    let miles_btn = document.getElementById("miles_btn");
    switch(units.toLowerCase()) {
        case "km":
            km_btn.style.backgroundColor = "#b26148";
            miles_btn.style.backgroundColor = "#f4511e";
            break;
        case "mile":
            km_btn.style.backgroundColor = "#f4511e";
            miles_btn.style.backgroundColor = "#b26148";
            break;
    }
}

function adjust_pace_buttons(conv_type) {
    // buttons
    let pace_btn = document.getElementById("pace_btn");
    let dist_btn = document.getElementById("dist_btn");
    let time_btn = document.getElementById("time_btn");

    // divs
    let pace_div = document.getElementById("pace_div");
    let dist_div = document.getElementById("dist_div");
    let time_div = document.getElementById("time_div");

    switch(conv_type.toLowerCase()) {
        case "pace":
            pace_btn.style.backgroundColor = "#b26148";
            dist_btn.style.backgroundColor = "#f4511e";
            time_btn.style.backgroundColor = "#f4511e";
            
            pace_div.setAttribute("hidden", "hidden");
            dist_div.removeAttribute("hidden");
            time_div.removeAttribute("hidden");
            break;
        case "dist":
            pace_btn.style.backgroundColor = "#f4511e";
            dist_btn.style.backgroundColor = "#b26148";
            time_btn.style.backgroundColor = "#f4511e";

            pace_div.removeAttribute("hidden");
            dist_div.setAttribute("hidden", "hidden");
            time_div.removeAttribute("hidden");
            break;
        case "time":
            pace_btn.style.backgroundColor = "#f4511e";
            dist_btn.style.backgroundColor = "#f4511e";
            time_btn.style.backgroundColor = "#b26148";

            pace_div.removeAttribute("hidden");
            dist_div.removeAttribute("hidden");
            time_div.setAttribute("hidden", "hidden");
            break;
    }
}


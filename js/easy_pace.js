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



// input: time is a array of 3 values: [hours, mins, secs] where each are within their respective domains, units ("km" or "mile"),
// and a range (boolean)
// output: a time array or an array of two values if range is true
function get_easy_pace(time, units="km", range=false) {
    // bounds and validation checking
    for (let i = 0; i < time.length; i++) if (isNaN(time[i])) return [NaN];
    if (time[1] < 0 || time[1] > 60 || time[2] < 0 || time[2] > 60) return [NaN];
    
    // pace
    let conversion_factor = 1;
    if (units.trim().toLowerCase() == "mile") conversion_factor = 1.609; // mile conversion factor
    let pb_speed = 5 / (time_to_decimal(time) / 60);
    return range ? [decimal_to_time((60 / (0.75 * pb_speed)) * conversion_factor), decimal_to_time((60 / (0.55 * pb_speed)) * conversion_factor)] : [decimal_to_time((60 / (0.65 * pb_speed)) * conversion_factor)];
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

    let units = "km"; // TODO: get this information from something in the document
    let easy_pace_text = document.getElementById("easy-pace-label").innerText;
    let easy_pace_range_text = document.getElementById("easy-pace-range-label").innerText;
    document.getElementById("easy-pace-label").innerText = easy_pace_text.substring(0, easy_pace_text.indexOf(":") + 1) + " " + format_time(get_easy_pace(time, units, false)) + " min/" + units;
    document.getElementById("easy-pace-range-label").innerText = easy_pace_range_text.substring(0, easy_pace_range_text.indexOf(":") + 1) + " " + format_time(get_easy_pace(time, units, true)) + " min/" + units;
  }




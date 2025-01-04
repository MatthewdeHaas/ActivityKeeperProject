
const date_options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
var calendar;
var selected_date = null;
document.addEventListener('DOMContentLoaded', function() {

    // reference to the calendar element in the html file
    var calendarEl = document.getElementById('calendar');

    // creates a calendar object that takes in the calendar
    // element as a parameter
    calendar = new FullCalendar.Calendar(calendarEl, {
        //themeSystem: 'bootstrap5',

        timeZone: 'local',
        firstDay: 1,
        editable: true,
        selectable: true,
        nowIndicator: true,

        headerToolbar: {
            left: 'prev,next,today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth',
          },
          footerToolbar: {
            right: 'addSessionBtn'
          },
        customButtons: {
          addSessionBtn: {
            text: 'Add session',
            click: function()  {
              document.getElementById("add-session-div").removeAttribute("hidden");
            },
          },
        },
          // example events 
          // auto-created schedules could be json files like this
          //events: 'https://fullcalendar.io/api/demo-feeds/events.json',

          // TODO: get from/add to localStorage so activities can be saved
          // between page loads

          // PLAY
          eventDrop: function(info) {
            alert(info.event.title + " was dropped on " + info.event.start.toISOString());
        
            if (!confirm("Are you sure about this change?")) {
              info.revert();
            }
            else {
                console.log(info.oldEvent.start);
                console.log("\n\n\n");
                console.log(info.event.start);
            }
          },
          dateClick: function(info) {
            selected_date = info.date;
            let schd_text_original = document.getElementById("schd-lbl").innerText;
            document.getElementById("schd-lbl").innerText = schd_text_original.substring(0, schd_text_original.indexOf(":") + 1) + " " + info.date.toLocaleDateString("en-CA", date_options);
          },   
    });
    
    // renders the calendar object that was created based on
    // the calendar element in the hmtl
    calendar.render();
  });



function schedule_session() {
  // TODO: 
  // - get data from the form and create new calendar event/session
  // set the date of the event based on which date is currently selected 
  // (show this during user input for the add session)
  // - clean up the form's css

  if (!selected_date) selected_date = Date.now();
  
  let duration = parseInt(document.getElementById("session-duration-input").value);
  console.log(duration);
  if (isNaN(duration) || duration <= 0) {
    document.getElementById("error-lbl").innerText = "Please enter a valid duration";
  } else {

  // TODO use this to set the start time of the activity and end with the duration field
  document.getElementById("time-of-day-input").value;

  // TODO add the selected time of day to the selected_date value


  calendar.addEvent({
    title: duration.toString() + " mins easy",
    start: selected_date,
    allDay: true // removes the time of day on an event (change later)
  });
  hide_form();
  }

}

function hide_form() {
  document.getElementById("add-session-div").setAttribute("hidden", "hidden");
  document.getElementById("add-session-form").reset();
  document.getElementById("schd-lbl").innerText = "Date of Session: today (click on a date)";
  document.getElementById("error-lbl").innerText = "";
  selected_date = null;
}
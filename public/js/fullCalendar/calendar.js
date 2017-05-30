
var classDays = [];
var courses = [];
var halls = [];
var rooms = [];

var courseEvents = [];

$(document).ready(function() {

// page is now ready, initialize the calendar...

$('#calendar').fullCalendar({
    weekends: false, // will hide Saturdays and Sundays
    editable: true,

    customButtons: {
      deleteSchedule: {
        text: 'Delete Schedule',
        click: function(){
          sessionStorage.clear();
          console.log("cleared");
          location.reload();
        }
      }
    },

    views:{
      weekly: {
        title: "Weekly Schedule",
        type: 'basicWeek',
        duration: { days: 5 },
        columnFormat: 'dddd',
        hiddendays:[0,6]
      }
    },

    header: {
      left: "",
      center: "title",
      right: "deleteSchedule"
    },

    defaultView: 'weekly',
});

createEvents();


});


var createEvents = function(){
  getEvents();

  if (classDays == null || halls == null){

  }

  else {

    for (var i = 1; i < classDays.length; i++){
      for (var j = 0; j < halls.length; j++){
        console.log(courses[j]);
        console.log(classDays[i]);
        courseEvents.push({
          title  : courses[j],
          start  : moment().day(classDays[i]),
          end: moment().day(classDays[i]),
          editable: true,
          durationEditable: true
        });
      }
    }

    $('#calendar').fullCalendar('addEventSource', courseEvents);
  }

}


var getEvents = function(){
  classDays = JSON.parse(sessionStorage.getItem("days"));
  courses = JSON.parse(sessionStorage.getItem("courses"));
  halls = JSON.parse(sessionStorage.getItem("halls"));
  rooms = JSON.parse(sessionStorage.getItem("rooms"));
}

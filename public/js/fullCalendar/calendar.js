
var classDays = [];
var courses = [];
var halls = [];
var rooms = [];

var courseEvents = [];

var colorsArray = ["#006A96", "#00465F","#747678", "#AFA9A0", "#747678", "#FFCD00", "#00C6D7"];

$(document).ready(function() {

// page is now ready, initialize the calendar...



$('#calendar').fullCalendar({
    header: {
        left: '',
        center: 'Title',
        right: "deleteSchedule",
    },

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
    weekends: false,
    editable: true,
    displayEventTime: false,
    views: {
        weekly: {
            type: 'basicWeek',
            title: 'Weekly Schedule',
            columnFormat: 'dddd',
            allDaySlot: false,
            minTime: "07:00:00",
            maxTime: "21:00:00",
            snapDuration: "0:01"


        }
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
        var color = colorsArray[j];
        courseEvents.push({
          title  : courses[j] + "\n" + halls[j].substr(0, halls[j].indexOf(',')) + "\n Room " + rooms[j],
          start  : moment().day(classDays[i]),
          end: moment().day(classDays[i]),
          editable: true,
          durationEditable: true,
          color: color
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

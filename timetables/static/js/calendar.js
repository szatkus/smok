var calendar = calendar || {};
var csrftoken = getCookie('csrftoken');
var allHours = [];

calendar.onInit = function(){

  calendar.createHeaders();
  calendar.createTable();
  calendar.addStyles();

  $('select').on('change', function() {
    fillCalendar(this.value);
  })

  $('#edit-modal').on('shown.bs.modal', function(e) {
    //debugger;
    var clickedItem = $(e.relatedTarget);
    calendar.calendarNode.row = clickedItem[0].parentElement.rowIndex - 1;
    calendar.calendarNode.column = clickedItem[0].cellIndex;

    var day = calendar.getDay(calendar.calendarNode.column);
    var node = day[calendar.calendarNode.row];
    $('#lessonName').val(rows[calendar.calendarNode.column][calendar.calendarNode.row].lesson);
    $('#teacher').val(rows[calendar.calendarNode.column][calendar.calendarNode.row].teacher);
    $('#class').val(rows[calendar.calendarNode.column][calendar.calendarNode.row].class);
    })

  $('#edit-modal').on('hide.bs.modal', function(e) {
    //debugger;
    var clickedButton = $(document.activeElement);
    if($(document.activeElement)[0].textContent === "Zapisz"){

      rows[calendar.calendarNode.column][calendar.calendarNode.row].lesson = $('#lessonName').val();
      rows[calendar.calendarNode.column][calendar.calendarNode.row].teacher = $('#teacher').val();
      rows[calendar.calendarNode.column][calendar.calendarNode.row].class = $('#class').val();

      addTimeTablePosition(calendar.convertToTimetablePosition($('#lessonName').val(), $('#teacher').val(), $('#class').val()));

      var cellNumber = calendar.calendarNode.column + (calendar.calendarNode.row) * 6;
      $('#calendar').find("td").eq(cellNumber)[0].innerText = $('#lessonName').val() + ' (s. ' + $('#class').val() + ')';
      }
      $('#lessonName').val('');
      $('#teacher').val('');
      $('#class').val('');
    }
  )};

//create headers
calendar.createHeaders = function(){
  var table = $('#calendar');
  var headers = scheduler.data.headers;
  var content = "";
  for(var i=0; i<headers.length; ++i){
    content += '<th>' + headers[i] + '</th>';
  }
  table.append('<thead><tr>' + content +'</tr></thead>');
};

var rows = [
  scheduler.data.hours,
  scheduler.data.monday,
  scheduler.data.tuesday,
  scheduler.data.wednesday,
  scheduler.data.thursday,
  scheduler.data.friday
];

var groupOptions = [];

calendar.convertToTimetablePosition = function(subject, teacher, classroom){
  var timetable = getTimetable();
  var teacherFirstName = teacher.split(' ')[0];
  var teacherLastName = teacher.split(' ')[1];
  var day = calendar.calendarNode.column;
  var hour = calendar.calendarNode.row + 1;
  var group = $('#groups').find(":selected").text();

  return {
    timetable,
    teacherFirstName,
    teacherLastName,
    subject,
    day,
    hour,
    classroom,
    group
  };
};

function getTimetable(){
  var url = window.location.pathname.split('/');
  return url[url.length - 2];
}

function addTimeTablePosition(position){
  $.post(addTimetablePositionURL, 
    {
      timetable: position.timetable,
      group: position.group,
      hour: position.hour,
      day: position.day,
      teacherFirstName: position.teacherFirstName,
      teacherLastName: position.teacherLastName,
      subject: position.subject,
      classroom: position.classroom,
      csrfmiddlewaretoken: csrftoken
    }, function(msg){
    console.log('added');
  });
};
//'hour': {order: position.hour.order, hourFrom: position.hour.hour_from, hourTo: position.hour.hour_to},

//create table
calendar.createTable = function(){
  var table = $('#calendar');

  var bodyContent = "<tbody>";
  for(var i=0; i<rows[0].length; ++i){
    let content = "<tr>";
    for(var k=0; k<rows.length; ++k){
      if(k !== 0) {
        content += '<td data-toggle="modal" data-id="2" data-target="#edit-modal">' + rows[k][i].lesson + '</td>';
      }
      else {
        // content += '<td>' + rows[k][i] + '</td>';
        content += '<td>' + ' ' + '</td>';
      }
    }    
    content += "</tr>";
    // table.append('<tr>' + content + '</tr>');
    bodyContent += content;
  } 
  bodyContent += "</tbody>";
  table.append(bodyContent);


  var positions = [];
  $.get(getTimetablePositionURL,
    {timetableId: getTimetable()},
    function(data){
      console.log(data);
      if(data.length > 0){
        allHours = prepareHours(data[0].ordersArray, data[0].fromArray, data[0].toArray);
        groupOptions = data[0].allGroupNamesArray;
      }
      //debugger;
      for(var k=0; k<data.length; ++k){
        allPositions.push({
          day: data[k].day,
          hour: data[k].hour,
          teacher: data[k].teacher,
          subject: data[k].subject,
          classroom: data[k].classroom,
          building: data[k].building,
          group: data[k].group
        });
        // if(groupOptions.indexOf(data[k].group) == -1){
        //   groupOptions.push(data[k].group);
        // }
        // if(allHours.indexOf(data[k].hour) == -1){
        //   allHours.push({order: data[k].hour, fromTo: data[k].from + " - " + data[k].to})
        // }
      }
      $.each(groupOptions, function (x, item) {
        $('#groups').append($('<option>', { 
            value: item,
            text : item
        }));
      });

      fillCalendar(groupOptions[0]);
      // for(var i=0; i<data.length; ++i) {
      //   if(data[i].day && data[i].hour && data[i].group === groupOptions[0]){
      //     rows[data[i].day][data[i].hour - 1].teacher = data[i].teacher;
      //     rows[data[i].day][data[i].hour - 1].lesson = data[i].subject;
      //     rows[data[i].day][data[i].hour - 1].class = data[i].classroom;
      //     var cellNumber = data[i].day + (data[i].hour - 1) * 6;
      //     $('#calendar').find("td").eq(cellNumber)[0].innerText = data[i].subject;
      //   }
      // }
  });
};

function prepareHours(allHoursOrders, allHoursFrom, allHoursTo){
  var hours = [];
  var noDuplicatesIndexes = [];
  for(var i=0; i<allHoursOrders.length; ++i){
    if(noDuplicatesIndexes.indexOf(allHoursOrders[i]) == -1){
      noDuplicatesIndexes.push(i);
    }
  }

  noDuplicatesIndexes.forEach(function(element) {
    hours.push({
      order: allHoursOrders[element],
      from: allHoursFrom[element],
      to: allHoursTo[element]
    });
  }, this);
  hours.sort(compareHour);

  return hours;
}

function compareHour(a,b) {
  if (a.order < b.order)
    return -1;
  if (a.order > b.order)
    return 1;
  return 0;
}

function fillCalendar(group){
  for(var p=0; p<rows.length; ++p){
    for(var k=0; k<allHours.length; ++k){
      rows[p][k].teacher = "";
      rows[p][k].lesson = null;
      rows[p][k].class = null;
    }
  }
  var numOfCells = 6 * allHours.length;
  var hoursCounter = 0;
  for(var j=0; j<numOfCells; ++j){
    if(j%6!==0){
      $('#calendar').find("td").eq(j)[0].innerText = '';
    }
    else{
      $('#calendar').find("td").eq(j)[0].innerText = allHours[hoursCounter].from + " - " + allHours[hoursCounter].to;
      hoursCounter++; 
    }
  }
//array.findIndex(x => x.prop2=="yutu");
  for(var i=0; i<allPositions.length; ++i){
    if(allPositions[i].day && allPositions[i].hour && allPositions[i].group === group){
      var mappedHour = allHours.findIndex(x => x.order == allPositions[i].hour);
      rows[allPositions[i].day][mappedHour].teacher = allPositions[i].teacher;
      rows[allPositions[i].day][mappedHour].lesson = allPositions[i].subject;
      rows[allPositions[i].day][mappedHour].class = allPositions[i].classroom + allPositions[i].building;
      rows[allPositions[i].day][mappedHour].building = allPositions[i].building;
      var cellNumber = allPositions[i].day + (mappedHour) * 6;
      $('#calendar').find("td").eq(cellNumber)[0].innerText = allPositions[i].subject + ' (s. ' + allPositions[i].classroom + allPositions[i].building + ')';
    }
  }
}

var allPositions = [];

calendar.calendarNode = {
  row: null,
  column: null,
}

function removeDuplicates( arr, prop ) {
  let obj = {};
  return Object.keys(arr.reduce((prev, next) => {
    if(!obj[next[prop]]) obj[next[prop]] = next; 
    return obj;
  }, obj)).map((i) => obj[i]);
}

calendar.getDay = function(column){
  if(column === 1) {
    return scheduler.data.monday;
  }
  else if(column === 2) {
    return scheduler.data.tuesday;
  }
  else if(column === 3) {
    return scheduler.data.wednesday;
  }
  else if(column === 4) {
    return scheduler.data.thursday;
  }
  else if(column === 5) {
    return scheduler.data.friday;
  }
}

calendar.addStyles = function(){
  $('#calendar').addClass("table table-bordered");
};

$(calendar.onInit)
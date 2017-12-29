var calendar = calendar || {};

calendar.onInit = function(){
  calendar.createHeaders();
  calendar.createTable();
  calendar.addStyles();

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

      var cellNumber = calendar.calendarNode.column + (calendar.calendarNode.row) * 6;
      $('#calendar').find("td").eq(cellNumber)[0].innerText = $('#lessonName').val();
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


//create table
calendar.createTable = function(){
  var table = $('#calendar');
  // var rows = [
  //   scheduler.data.hours,
  //   scheduler.data.monday,
  //   scheduler.data.tuesday,
  //   scheduler.data.wednesday,
  //   scheduler.data.thursday,
  //   scheduler.data.friday
  // ];

  var bodyContent = "<tbody>";
  for(var i=0; i<rows[0].length; ++i){
    let content = "<tr>";
    for(var k=0; k<rows.length; ++k){
      if(k !== 0) {
        content += '<td data-toggle="modal" data-id="2" data-target="#edit-modal">' + rows[k][i].lesson + '</td>';
      }
      else {
        content += '<td>' + rows[k][i] + '</td>';
      }
    }    
    content += "</tr>";
    // table.append('<tr>' + content + '</tr>');
    bodyContent += content;
  } 
  bodyContent += "</tbody>";
  table.append(bodyContent);
};

calendar.calendarNode = {
  row: null,
  column: null,
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
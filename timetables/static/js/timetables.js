
var csrftoken = getCookie('csrftoken');

// generowanie formularza do edytowania profilow na podstawie modelu
function edit_item(id){
    $.get(editURL, {id: id}, function(data){
        var dataHTML = jQuery.parseHTML(data);
        $("#editForm").append('<div class="inner"></div>');
        $.each( dataHTML, function( i, val ) {
            if (val.name == "name") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>'); // kazdy atrybut formularza w osobnym divie dla wygodniejszego konfigurowania css w przyszlosci
                $("#formE"+i).append('<label for="id_name">Nazwa:</label>').append(val);
                $('.timetableName').text(val.value);
            } else {
                $(".inner").append(val);
            }
        });
        $(".inner").append('<input type="hidden" name="id" value="'+id+'" />'); // potrzebny dla POST request w form.edit_profile
    });
    $('#editModal').css('display', 'block');
}

function delete_item(id, name){
    $('.timetableName').text(name);
    $("#deleteModalBody").append('<div class="inner"><button class="confirm" onClick="deleteTimetable('+id+');">Tak</button></div>');
    $('#deleteModal').css('display', 'block');
}

function deleteTimetable(id){
    closeDeleteModal();
    $.post(deleteURL, 
        {
            id: id,
            csrfmiddlewaretoken: csrftoken
        }, function(){
            $('#'+id).remove();
            if ($('#list li').length == 0) {
                $("#list").append('<p id="noResources">Brak zapisanych planów zajęć.</p>');
            }
        });
}


$(document).ready(function() {
    // generowanie formularza do dodawania profilow na podstawie modelu
    // moglby byc tworzony od razu podczas renderowania class-profiles.html z  {%for field in form %}, jesli zostawimy 2 osobne modale dla dodawania i usuwania profilow,
    // zamiast polaczyc je w jeden
    $("span#newItem").click(function(){
        $.get(addURL, function(data){
            var dataHTML = jQuery.parseHTML(data);
            $("#addForm").append('<div class="inner"></div>');
            $.each( dataHTML, function( i, val ) {
                if (val.name == "name") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_name">Nazwa:</label>').append(val);
                } else {
                    $(".inner").append(val);
                }
            });
        });
        $('#addModal').css('display', 'block');
    });

    // obsluga formularza do dodawania profilow
    $("form.add_timetable").submit(function(event) {
        $.post(addURL, $(this).serialize(), function(data){
            if (data === 'FAILED') {
                $('#successModal').css('display', 'block').delay(3000).fadeOut('slow');
            } else {
                var newTimetable = jQuery.parseJSON(data)[0];
                var newLi = $('<li id ="'+newTimetable.pk+'"><a class="no-format" href="/timetables/'+ newTimetable.pk +'/"><span class="row-content"> <span id ="resource-name-'+newTimetable.pk+'" class="list-element">' + newTimetable.fields.name +'</span></span></a><span class="row-content"> <span id="resource-lut-'+newTimetable.pk+'" class="list-element">'+moment(newTimetable.fields.last_updated_timestamp).locale('pl').format('LLL')+'</span> </span><span class="edit" onclick="edit_item('+newTimetable.pk+');">&#x1f589;</span><span id ="resource-delete-'+newTimetable.pk+'" class="close" onclick="delete_item('+newTimetable.pk+', \''+newTimetable.fields.name+'\');">&#x232b;</span></li>').hide();

                //TODO: sort() nie dziala, nowe elementy sa dodawane na koncu ul#list
                $("#list").add(newLi.fadeIn(800)).sort(asc_sort).appendTo('#list');
                //$("#list").add(newLi.fadeIn(800)).sort(sortAlpha).appendTo('#list');

                if ($('#list li').length != 0) {
                    $('p#noResources').remove();
                }
            }
        });
        event.preventDefault();
        $('#addModal').css('display', 'none');
        $('.inner').remove();
    });

    // obsluga formularza do edytowania profilow
    $("form.edit_timetable").submit(function(event) {
        $.post(editURL, $(this).serialize(), function(data){
            var newTimetable = jQuery.parseJSON(data)[0];
            if (newTimetable.error === "UNIQUE_NAME_VIOLATED") {
                $('#successModal').css('display', 'block').delay(3000).fadeOut('slow');
            } else if (newTimetable.hasOwnProperty('fields')) {
                $('span#resource-name-'+newTimetable.pk).text(newTimetable.fields.name);
                $('span#resource-lut-'+newTimetable.pk).text(moment(newTimetable.fields.last_updated_timestamp).locale('pl').format('LLL'));
                $('span#resource-delete-'+newTimetable.pk).attr("onclick",'delete_item('+newTimetable.pk+', \''+newTimetable.fields.name+'\');');
            }
        });
        event.preventDefault();
        $('#editModal').css('display', 'none');
        $('.inner').remove();
    });

});

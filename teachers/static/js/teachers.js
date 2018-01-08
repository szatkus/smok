
var csrftoken = getCookie('csrftoken');

// generowanie formularza do edytowania profilow na podstawie modelu
function edit_item(id){
    $.get(editURL, {id: id}, function(data){
        var dataHTML = jQuery.parseHTML(data);
        $("#editForm").append('<div class="inner"></div>');
        $.each( dataHTML, function( i, val ) {
            if (val.name == "first_name") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>'); // kazdy atrybut formularza w osobnym divie dla wygodniejszego konfigurowania css w przyszlosci
                $("#formE"+i).append('<label for="id_first_name">Imię:</label>').append(val);
                $('.profileName').text(val.value);
            } else if (val.name == "last_name") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>');
                $("#formE"+i).append('<label for="id_last_name">Nazwisko:</label>').append(val);
            } else {
                $(".inner").append(val);
            }
        });
        $(".inner").append('<input type="hidden" name="id" value="'+id+'" />'); // potrzebny dla POST request w form.edit_profile
    });
    $('#editModal').css('display', 'block');
}

function delete_item(id, name){
    $('.teacherName').text(name);
    $("#deleteModalBody").append('<div class="inner"><button class="confirm" onClick="deleteTeacher('+id+');">Tak</button></div>');
    $('#deleteModal').css('display', 'block');
}

function delete_assignment(assignmentId, teacherId, assignmentName){
    $('.assignmentName').text(assignmentName);
    $('.teacherName').text($("#resource-firstName-"+teacherId)[0].innerText+' '+$("#resource-lastName-"+teacherId)[0].innerText);
    $("#deleteAssignmentModalBody").append('<div class="inner"><button class="confirm" onClick="deleteAssignmentFromTeacher('+assignmentId+', '+ teacherId +');">Tak</button></div>');
    $('#deleteAssignmentModal').css('display', 'block');
}

function deleteTeacher(id){
    closeDeleteModal();
    $.post(deleteURL,
        {
            id: id,
            csrfmiddlewaretoken: csrftoken
        }, function(){
            $('#'+id).remove();
            if ($('#list li').length == 0) {
                $("#list").append('<p id="noResources">Brak zapisanych profilów.</p>');
            }
        });
}

function closeDeleteAssignmentModal(){
    $('#deleteAssignmentModal').css('display', 'none');
    $('.assignmentName').text('');
    $('.teacherName').text('');
    $('.inner').remove();
}

function addAssignmentToTeacher(id){
    $.get(addAssignmentURL, {'teacher-id': id}, function(data){
        var dataJSON = jQuery.parseJSON(data);

        $("#addAssignmentForm").append('<div class="inner"></div>');
        $(".inner").append('<div class="form-group" id="formE1"><label for="id_subject">Przedmiot:</label><select required name="subject" id="id_subject"></select></br></div>');
            $.each( dataJSON.subjects, function( i, val ) {
                $("#id_subject").append('<option value="'+ val.id +'">'+ val.name + ' (' + val.code +' )' +'</option>');
            });
        $(".inner").append('<div class="form-group" id="formE2"><label for="id_group">Grupa:</label><select required name="group" id="id_group"></select></br></div>');
            $.each( dataJSON.groups, function( i, val ) {
                $("#id_group").append('<option value="'+ val.id +'">'+ val.name + '</option>');
            });

        $(".inner").append('<input type="hidden" name="teacher-id" value="'+id+'" />'); // potrzebny dla POST request
        $('.teacherName').text(dataJSON.teacher);
    });

    $('#addAssignmentModal').css('display', 'block');
}

function deleteAssignmentFromTeacher(assignmentId, teacherId){
    closeDeleteAssignmentModal();
    $.post(deleteAssignmentURL,
        {
            assignmentId: assignmentId,
            teacherId: teacherId,
            csrfmiddlewaretoken: csrftoken
        }, function(data){
            var dataJSON = jQuery.parseJSON(data);
            $('span#teacher-'+teacherId+'-assignment-'+assignmentId).fadeOut(300, function() {
                $(this).remove();
            });
            $("span#resource-hours-"+teacherId).fadeOut(function() {
                      $(this).text(dataJSON.hours_total).fadeIn();
                });
        });
}

$(document).ready(function() {
    $("#closeAddAssignmentModal").click(function(){
        $('#addAssignmentModal').css('display', 'none');
        $('.inner').remove();
    });

    // generowanie formularza do dodawania profilow na podstawie modelu
    // moglby byc tworzony od razu podczas renderowania class-profiles.html z  {%for field in form %}, jesli zostawimy 2 osobne modale dla dodawania i usuwania profilow,
    // zamiast polaczyc je w jeden
    $("span#newItem").click(function(){
        $.get(addURL, function(data){
            var dataHTML = jQuery.parseHTML(data);
            $("#addForm").append('<div class="inner"></div>');
            $.each( dataHTML, function( i, val ) {
                if (val.name == "first_name") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_first_name">Imię:</label>').append(val);
                } else if (val.name == "last_name") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_last_name">Nazwisko:</label>').append(val);
                } else {
                    $(".inner").append(val);
                }
            });
        });
        $('#addModal').css('display', 'block');
    });

    // obsluga formularza do dodawania profilow
    $("form.add_teacher").submit(function(event) {
        $.post(addURL, $(this).serialize(), function(data){
            if (data === 'FAILED') {
                $('#successModal').css('display', 'block').delay(3000).fadeOut('slow');
            } else {
                var newTeacher = jQuery.parseJSON(data)[0];

                var newLi = $('<li id="'+newTeacher.pk+'"><span class="row-content" style="width:200px;"><span id="resource-lastName-'+newTeacher.pk+'" class="list-element">'+newTeacher.fields.last_name+'</span></span><span class="row-content" style="width:200px;"><span id="resource-firstName-'+newTeacher.pk+'" class="list-element">'+newTeacher.fields.first_name+'</span></span><span class="row-content" style="width:200px;"><span id="resource-hours-'+newTeacher.pk+'" class="list-element">0</span></span><span class="row-content-longer"><span class="list-element"><div id="assignments-container-teacher-'+newTeacher.pk+'"></div></br><span onClick="addAssignmentToTeacher('+newTeacher.pk+')" class="button-secondary">&#43; nowy przydział</span></span></span><span><a href="/availability/'+ newTeacher.pk +'/" class="calendar">&#128197;</a></span><span class="edit" onClick="edit_item('+newTeacher.pk+');">&#x1f589;</span><span id="resource-delete-'+newTeacher.pk+'" class="close" onclick="delete_item('+newTeacher.pk+', \''+newTeacher.fields.first_name+' '+newTeacher.fields.last_name+'\');">&#x232b;</span></li>').hide();

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
    $("form.edit_teacher").submit(function(event) {
        $.post(editURL, $(this).serialize(), function(data){
            var newTeacher = jQuery.parseJSON(data)[0];
            if (newTeacher.error === "UNIQUE_NAME_VIOLATED") {
                $('#successModal').css('display', 'block').delay(3000).fadeOut('slow');
            } else if (newTeacher.hasOwnProperty('fields')) {
                $('span#resource-lastName-'+newTeacher.pk).text(newTeacher.fields.last_name);
                $('span#resource-firstName-'+newTeacher.pk).text(newTeacher.fields.first_name);
                $('span#resource-delete-'+newTeacher.pk).attr("onclick",'delete_item('+newTeacher.pk+', \''+newTeacher.fields.first_name+ ' ' +newTeacher.fields.last_name+'\');');
            }
        });
        event.preventDefault();
        $('#editModal').css('display', 'none');
        $('.inner').remove();
    });

    $("form.add_assignment").submit(function(event) {
        $.post(addAssignmentURL, $(this).serialize(), function(data){
            var newAssignment = jQuery.parseJSON(data);
            if (newAssignment.error === "UNIQUE_CONSTRAINT_VIOLATED") {
                $('#infoORAModal').css('display', 'block').delay(3000).fadeOut('slow');
            } else {
                if (newAssignment.assignment_hours === "MISSING") {
                    var hours = '<span class="discraparency-warning">brak przedmiotu w profilu grupy</span>'
                } else {
                    var hours = newAssignment.assignment_hours+' godz. w tyg.'
                }

                var newAssignSpan = $('<span id="teacher-'+ newAssignment.teacher_id +'-assignment-'+ newAssignment.new_tcs +'" class="list-element">● <a class="no-format" href="/subjects/">'+ newAssignment.subject +'</a> w grupie <a class="no-format" href="/groups/">'+ newAssignment.group +'</a> (<a class="no-format" href="/profiles/'+ newAssignment.group_profile_id +'/">'+ hours +'</a>) <span id="resource-delete-assignment-'+ newAssignment.new_tcs +'" class="close-secondary" onclick="delete_assignment('+ newAssignment.new_tcs +','+ newAssignment.teacher_id +', \''+ newAssignment.subject +' - '+ newAssignment.group +'\');">✗</span></span>').hide();
                $("#assignments-container-teacher-"+newAssignment.teacher_id).add(newAssignSpan.fadeIn(800)).appendTo("#assignments-container-teacher-"+newAssignment.teacher_id);

                $("span#resource-hours-"+newAssignment.teacher_id).fadeOut(function() {
                      $(this).text(newAssignment.total_hours).fadeIn();
                });
            }
        });

        event.preventDefault();
        $('#addAssignmentModal').css('display', 'none');
        $('.inner').remove();
    });


});

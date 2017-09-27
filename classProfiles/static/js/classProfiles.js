
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
                $('.profileName').text(val.value);
            } else if (val.name == "description") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>');
                $("#formE"+i).append('<label for="id_description">Opis:</label>').append(val);
            } else {
                $(".inner").append(val);
            }
        });
        $(".inner").append('<input type="hidden" name="id" value="'+id+'" />'); // potrzebny dla POST request w form.edit_profile
    });
    $('#editModal').css('display', 'block');
}

function delete_item(id, name){
    $('.profileName').text(name);
    $("#deleteModalBody").append('<div class="inner"><button class="confirm" onClick="deleteProfile('+id+');">Tak</button></div>');
    $('#deleteModal').css('display', 'block');
}

function deleteProfile(id){
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
                } else if (val.name == "description") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_description">Opis:</label>').append(val);
                } else {
                    $(".inner").append(val);
                }
            });
        });
        $('#addModal').css('display', 'block');
    });

    // obsluga formularza do dodawania profilow
    $("form.add_profile").submit(function(event) {
        $.post(addURL, $(this).serialize(), function(data){
            var newProfile = jQuery.parseJSON(data)[0];
            var newLi = $('<li id ="'+newProfile.pk+'"><span id ="resource-name-'+newProfile.pk+'">' +newProfile.fields.name +'</span><span class="edit" onclick="edit_item('+newProfile.pk+');">&#x2702;</span><span id ="resource-delete-'+newProfile.pk+'" class="close" onclick="delete_item('+newProfile.pk+', \''+newProfile.fields.name+'\');">×</span></li>').hide();
            
            //TODO: sort() nie dziala, nowe elementy sa dodawane na koncu ul#list
            $("#list").add(newLi.fadeIn(800)).sort(asc_sort).appendTo('#list');
            //$("#list").add(newLi.fadeIn(800)).sort(sortAlpha).appendTo('#list');

            if ($('#list li').length != 0) {
                $('p#noResources').remove();
            }
        });
        event.preventDefault();
        $('#addModal').css('display', 'none');
        $('.inner').remove();
    });

    // obsluga formularza do edytowania profilow
    $("form.edit_profile").submit(function(event) {
        $.post(editURL, $(this).serialize(), function(data){
            var newProfile = jQuery.parseJSON(data)[0];
            $('span#resource-name-'+newProfile.pk).text(newProfile.fields.name);
            $('span#resource-delete-'+newProfile.pk).attr("onclick",'delete_item('+newProfile.pk+', \''+newProfile.fields.name+'\');');
        });
        event.preventDefault();
        $('#editModal').css('display', 'none');
        $('.inner').remove();
    });

});

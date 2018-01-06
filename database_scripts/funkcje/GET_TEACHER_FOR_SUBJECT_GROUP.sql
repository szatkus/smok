CREATE OR REPLACE function DJANGO.get_teacher_for_subject_group(
    p_subject_id subjects_subject.id%type,
    p_group_id groups_group.id%type,
    p_timetable_id timetables_timetable.id%type
) return teachers_teacher.id%type is
	v_result teachers_teacher.id%type; 
begin
	begin
    
        select distinct teacher_id
        into v_result
        from timetables_timetableposition
        where
            timetable_id=p_timetable_id
            and subject_id=p_subject_id
            and group_id=p_group_id;
            
    exception
    	when no_data_found then
            begin
                select teacher_id
                into v_result
                from (
                    select
                        teacher_id,
                        group_id,
                        subject_id
                    from
                        teachers_teacher_groups ttg
                        join teachers_teacher_subjects tts using (teacher_id)
                    where
                        subject_id=p_subject_id
                        and group_id=p_group_id
                )
                where rownum = 1;
            exception
                when no_data_found then
                	throw('Nie znaleziono nauczyciela dla grupy {} i przedmiotu {}',p_group_id,p_subject_id);
            end;
        when too_many_rows then
        	throw('W planie {} dla grupy {} i przedmiotu {} przypisano wiecej niz jednego nauczyciela',p_timetable_id,p_group_id,p_subject_id);
    end;
    
    return v_result;
    
end;
/

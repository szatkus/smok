create or replace view v_timetable_data as select
    ttp.timetable_id,
    format('{} - {}',hour_from,hour_to) as hour_name,
    cd.name as day_name,
    ss.name as subject_name,
    cc.name as classroom_name,
    format('{} {}',tt.first_name,tt.last_name) as teacher_name,
    gg.name as group_name
from
    timetables_timetableposition ttp
    join commons_hours ch on (ttp.hour_id=ch.id)
    join commons_days cd on (ttp.day_id=cd.id)
    join subjects_subject ss on (ss.id=ttp.subject_id)
    join classrooms_classroom cc on (cc.id=ttp.classroom_id)
    join teachers_teacher tt on (tt.id=ttp.teacher_id)
    join groups_group gg on (gg.id=ttp.group_id)
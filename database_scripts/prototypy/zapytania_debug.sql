/* Podglad planu lakcji */
select
*
from
v_timetable_preview
where
1=1
and group_name=:p_group_name
and timetable_id=:p_timetable_id

----------------------------------------

/* Podglad brakujacych godzin */
select
*
from
v_groups_subjects
where
timetable_id=:p_timetable_id
and to_assign>0

-----------------------------------------

/* Porównanie iloœci godzin potrzebnych od nauczycieli do iloœci godzin dostêpnych */

with teachers_required as (
select
    timetable_id,
    teacher_id,
    sum(to_assign) needed
from (
    select
        vgs.*,
        get_teacher_for_subject_group(subject_id,group_id,null) teacher_id
    from
    v_groups_subjects vgs
)
group by
    timetable_id,
    teacher_id
)
, teachers_available as (
select
    vta.timetable_id,
    teacher_id,
    sum(assignable) as available
from
	v_teachers_availability vta
group by
    vta.timetable_id,
    teacher_id
)
select
	tr.timetable_id,
    tr.teacher_id,
    tr.needed,
    ta.available,
    least(needed,available) as could_be_planned,
    sum(least(needed,available)) over () as could_be_planned_global
from
    teachers_required tr
    join teachers_available ta on  (tr.teacher_id=ta.teacher_id and tr.timetable_id=ta.timetable_id)
where
	needed>0

----------------------------------------

exec generator_pcg.generate(138);

select * from timetables_timetable

select * from timetables_timetablelog order by 2

select * from v_groups_subjects

select * from v_teachers_availability

select teacher_id, count(1) from timetables_timetableposition group by teacher_id

select * from timetables_timetable
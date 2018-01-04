create or replace view v_subjects_availability as
with all_days_hours_subjects as (
    select
        ch.id as hour_id,
        cd.id as day_id,
        ss.id as subject_id
    from
        commons_hours ch
        cross join commons_days cd
        cross join subjects_subject ss
),
subquery as (
    select
        tt.id as timetable_id,
        sq.hour_id,
        sq.day_id,
        sq.subject_id,
        nvl(sum(vta.available),0) as available,
        nvl(sum(vta.used),0) as used
    from
        all_days_hours_subjects sq
        cross join timetables_timetable tt
        left outer join teachers_teacher_subjects tts on (tts.subject_id=sq.subject_id)
        left outer join v_teachers_availability vta on (
            vta.teacher_id=tts.teacher_id
            and vta.hour_id=sq.hour_id
            and vta.day_id=sq.day_id
            and vta.timetable_id=tt.id
        )
    group by
        tt.id,
        sq.hour_id,
        sq.day_id,
        sq.subject_id
)
select
    timetable_id,
    hour_id,
    day_id,
    subject_id,
    available,
    used,
    available-used as assignable
from
	subquery
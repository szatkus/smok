create or replace view v_groups_subjects as 
with all_timetables_subjects_groups as ( 
    select
        tt.id as timetable_id,
        ss.id as subject_id,
        gg.id as group_id
    from
    	subjects_subject ss
        cross join groups_group gg
        cross join timetables_timetable tt
),
hours_expected as (
    select
        sq.timetable_id,
        sq.subject_id,
        sq.group_id,
        nvl(sum(cph.hoursno),0) as expected
    from
        all_timetables_subjects_groups sq
        join groups_group gg on (gg.id=sq.group_id)
        left outer join classprofiles_hoursamount cph on (
            cph.profile_id=gg.group_profile_id
            and sq.subject_id=cph.subject_id
        )
    group by
        sq.timetable_id,
        sq.subject_id,
        sq.group_id
),
hours_in_timetables as (
    select
        ttp.timetable_id,
        subject_id,
        group_id,
        count(1) as used
    from
        timetables_timetableposition ttp
    group by
        ttp.timetable_id,
        subject_id,
        group_id
)
select
    timetable_id,
    subject_id,
    group_id,
    expected,
    nvl(used,0) as assigned,
    expected - nvl(used,0) as to_assign
from
    hours_expected he
    left outer join hours_in_timetables hit using (
        timetable_id,
        subject_id,
        group_id
    ) 
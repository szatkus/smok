create or replace view v_tmp_groups_subjects as 
with all_subjects_groups as (  
    select
        ss.id as subject_id,
        gg.id as group_id
    from
    	subjects_subject ss
        cross join groups_group gg
),
hours_expected as (
    select
        sq.subject_id,
        sq.group_id,
        nvl(sum(cph.hoursno),0) as expected
    from
        all_subjects_groups sq
        join groups_group gg on (gg.id=sq.group_id)
        left outer join classprofiles_hoursamount cph on (
            cph.profile_id=gg.group_profile_id
            and sq.subject_id=cph.subject_id
        )
    group by
        sq.subject_id,
        sq.group_id
)
select
    subject_id,
    group_id,
    expected
from
    hours_expected he
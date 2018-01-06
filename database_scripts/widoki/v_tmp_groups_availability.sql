create or replace view v_tmp_groups_availability as 
select
    vadh.hour_id,
    vadh.day_id,
    gg.id as group_id,
    nvl2(ttp.rowid,0,1) as available
from
    v_all_days_hours vadh
    cross join groups_group gg
    left outer join tmp_timetableposition ttp on (
    	ttp.day_id=vadh.day_id
        and ttp.hour_id=vadh.hour_id
        and ttp.group_id=gg.id
    );
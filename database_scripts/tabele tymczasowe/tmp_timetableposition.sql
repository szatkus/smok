create global temporary table tmp_timetableposition(
	tmp_id integer,
    classroom_id integer,
    day_id integer,
    group_id integer,
    hour_id integer,
    subject_id integer,
    teacher_id integer
);

/*select
    classroom_id,
    day_id,
    group_id,
    hour_id,
    subject_id,
    teacher_id
from
	timetables_timetableposition
where
	1=0;*/
 

drop table tmp_timetableposition;
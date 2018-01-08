create or replace view v_timetable_preview as select
	timetable_id,
    group_name,
	hour_name,
    poniedzialek,
    wtorek,
    sroda,
    czwartek,
    piatek
from
	v_timetable_data
    pivot(
    	max(format('{} [{}: {}]',subject_name,teacher_name,classroom_name)) for day_name in (
        	'Poniedzialek' as PONIEDZIALEK,
            'Wtorek' as WTOREK,
            'Sroda' as SRODA,
            'Czwartek' as CZWARTEK,
            'Piatek' as PIATEK
        )
    );
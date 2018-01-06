create or replace view v_tmp_teachers_availability as
with all_days_hours_teachers as (
    select
        ch.id as hour_id,
        cd.id as day_id,
        tt.id as teacher_id
    from
        commons_hours ch
        cross join commons_days cd
        cross join teachers_teacher tt
),
sq_teachers_availability as (
    select
        day_id,
        hour_id,
        teacher_id,
        max(available) as available /* Zabezpieczenie przed dublami */
    from
        availability_teachersavail162e 
    group by
        day_id,
        hour_id,
        teacher_id
)
select
    dht.hour_id,
    dht.day_id,
    dht.teacher_id,
    nvl(ta.available,0) as available,
    nvl2(ttp.teacher_id,1,0) as used,
    greatest(nvl(ta.available,0)-nvl2(ttp.teacher_id,1,0),0) as assignable
from
    all_days_hours_teachers dht
    left outer join sq_teachers_availability ta on (
        ta.day_id=dht.day_id
        and ta.hour_id=dht.hour_id
        and ta.teacher_id=dht.teacher_id
    )
    left outer join tmp_timetableposition ttp on (
        ttp.day_id=dht.day_id
        and ttp.hour_id=dht.hour_id
        and ttp.teacher_id=dht.teacher_id
    );
    
--comment on table v_teachers_availability is 'Widok zawiera wiersze dla wszystkich kombinacji timetable, godzina, gdzien, nauczyciel z wpisami czy dostepny i czy juz przydzielono do zajec'
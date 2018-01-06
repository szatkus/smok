create or replace view v_all_days_hours as select
    ch.id as hour_id,
    cd.id as day_id
from
    commons_hours ch
    cross join commons_days cd;
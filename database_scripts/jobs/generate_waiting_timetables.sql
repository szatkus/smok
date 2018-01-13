begin
DBMS_SCHEDULER.create_job (
    job_name        => 'generate_waiting_timetables',
    job_type        => 'PLSQL_BLOCK',
    job_action      => 'BEGIN generator_pcg.generate_all(); END;',
    start_date      => SYSTIMESTAMP,
    repeat_interval => 'freq=minutely; bysecond=0,30',
    end_date        => NULL,
    enabled         => TRUE,
    comments        => 'Job generuje wszystkie plany zajêæ oczekujace na wygenerowanie.');
end;

exec DBMS_SCHEDULER.drop_job (job_name => 'generate_waiting_timetables');

select * from ALL_SCHEDULER_JOBS
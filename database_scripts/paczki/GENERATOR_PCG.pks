create or replace package generator_pcg is
    pragma SERIALLY_REUSABLE;
    procedure generate (p_timetable_id integer);
    procedure generate_all;
end; 
create or replace function format(
    p_format varchar2,
    p_1 varchar2 default null,
    p_2 varchar2 default null,
    p_3 varchar2 default null,
    p_4 varchar2 default null,
    p_5 varchar2 default null,
    p_6 varchar2 default null,
    p_7 varchar2 default null,
    p_8 varchar2 default null,
    p_9 varchar2 default null,
    p_10 varchar2 default null
) return varchar2 is
    type ta_varchar_tab is table of varchar2(32000);
    va_parameters ta_varchar_tab := ta_varchar_tab(p_1, p_2, p_3, p_4, p_5, p_6, p_7, p_8, p_9, p_10);
    v_result varchar2(32000) := p_format;
begin
    for i in nvl(va_parameters.first,1) .. nvl(va_parameters.last,0) loop
        v_result := regexp_replace(v_result,'\{\}',va_parameters(i),1,1);
    end loop;
    return v_result ;
end;
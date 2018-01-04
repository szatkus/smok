create or replace procedure throw(
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
) is
begin
    raise_application_error(
        -20000,
        format(
            p_format,
            nvl(p_1,'(null)'),
            nvl(p_2,'(null)'),
            nvl(p_3,'(null)'),
            nvl(p_4,'(null)'),
            nvl(p_5,'(null)'),
            nvl(p_6,'(null)'),
            nvl(p_7,'(null)'),
            nvl(p_8,'(null)'),
            nvl(p_9,'(null)'),
            nvl(p_10,'(null)')
        )
    );
end;
create or replace package body generator_pcg is

    /* - - - C U R S O R S - - - */
    
    /* Zajecia do zaplanowania uszeregowane od zajec,
    gdzie jest najmniejsza dostepnsc nauczycieli */
    cursor cur_classes_to_plan is
        select
            ttp.tmp_id,
            ttp.group_id,
            ttp.subject_id,
            ttp.teacher_id,
            ta.assignable_sum
        from
            tmp_timetableposition ttp
            join (
                select
                    teacher_id,
                    sum(assignable) as assignable_sum
                from v_tmp_teachers_availability
                group by teacher_id
            )ta on (ta.teacher_id=ttp.teacher_id) 
        where
            day_id is null
            and hour_id is null
        order by
            ta.assignable_sum asc; /* Od najmniejszej ilosci godzin nauczycieli */
                
    cursor cur_day_hour_for_group_teacher (p_group_id integer, p_teacher_id integer) is
        with hours_available_for_class as (
            select
                vtga.hour_id,
                vtga.day_id,
                to_number(cd."ORDER") as day_order,
                to_number(ch."ORDER") as hour_order,
                vtga.available
            from
                v_tmp_groups_availability vtga
                join commons_days cd on (cd.id=vtga.day_id)
                join commons_hours ch on (ch.id=vtga.hour_id)
            where
                group_id=p_group_id
        ),
        hours_available_for_class_2 as (
            select
                ha.day_id,
                ha.hour_id,
                ha.day_order,
                ha.hour_order,
                ha.available,
                sum(ha.available) over (partition by ha.day_id) hours_available_on_day,
                count(1) over (partition by ha.day_id) hours_on_day,
                nvl(lag(available) over (partition by ha.day_id order by day_order, hour_order),-1) as previous_hour_available,
                nvl(lead(available) over (partition by ha.day_id order by day_order, hour_order),-1) as following_hour_available
            from
                hours_available_for_class  ha
        ),
        hours_avail_for_class_teacher as  (
            select
                    sq.*,
                    vtta.available as teacher_available
            from
                hours_available_for_class_2 sq
                join v_tmp_teachers_availability vtta on (
                    vtta.hour_id=sq.hour_id
                    and vtta.day_id=sq.day_id
                    and vtta.teacher_id=p_teacher_id
                )
            where
                (sq.hours_available_on_day=sq.hours_on_day or sq.previous_hour_available=0 or sq.following_hour_available=0)
                and sq.available=1
                and vtta.available=1
            order by
                day_order,
                hour_order
        )
        select
            day_id,
            hour_id
        from hours_avail_for_class_teacher
        where rownum=1;
                
    
    /* - - - B O D Y - - - **/
    
    procedure log_error(p_text varchar2) is
    begin
        null;
    end;
    
    procedure prepare_temporary_table is
    begin
        /* Czyszcze tabelke tymczasowa z planem */
        delete from tmp_timetableposition;

        /* Laduje tabelke tymczasowa godzinami do zaplanowania (nie wypelnione kto i gdzie) */
        insert into tmp_timetableposition (
            group_id,
            subject_id,
            teacher_id,
            tmp_id
        )
        select
            group_id,
            subject_id,
            get_teacher_for_subject_group(subject_id,group_id,null) as teacher_id,
            rownum
        from
            v_groups_subjects vgs
        join (
            select level lp
            from dual
            connect by level <= (select max(expected) from v_groups_subjects)
        ) sq on (sq.lp<=vgs.expected);
    end;
    
    function find_hour_for_group_teacher (
        p_group_id integer,
        p_teacher_id integer
    ) return cur_day_hour_for_group_teacher%rowtype is
        vr_result cur_day_hour_for_group_teacher%rowtype;
        v_was_found boolean;
    begin
        open cur_day_hour_for_group_teacher(p_group_id,p_teacher_id);
        fetch cur_day_hour_for_group_teacher into vr_result;
        v_was_found := cur_day_hour_for_group_teacher%found ;
        close cur_day_hour_for_group_teacher;
        
        if not v_was_found then
            throw('Nie znaleziono godziny gdzie dla grupy {} mog³yby sie odbyc zajecia z nauczycielem {}',p_group_id,p_teacher_id);
        end if;
        
        return vr_result; 
        
    end;

    procedure generate (p_timetable_id integer) is
    begin
    
        /* Laduje tabelke tymczasowa godzinami do zaplanowania (nie wypelnione kto i gdzie) */
        prepare_temporary_table();
        
        /* Planuje godzine o ktorej odbeda sie zajecia */      
        begin
            for ctp in cur_classes_to_plan loop
                declare
                    vr_hour_for_group_teacher cur_day_hour_for_group_teacher%rowtype;
                begin
                    begin
                    vr_hour_for_group_teacher := find_hour_for_group_teacher (ctp.group_id,ctp.teacher_id);
                    exception
                        when others then continue;
                    end;
                    
                    /* Dla danej lekcji ustawiam godzine */
                    update
                        tmp_timetableposition
                    set
                        day_id=vr_hour_for_group_teacher.day_id,
                        hour_id=vr_hour_for_group_teacher.hour_id
                    where
                        tmp_id=ctp.tmp_id;
                        
                end;
            end loop;
        end;
        
    end;

end;
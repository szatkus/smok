create or replace package body generator_pcg is

    pragma SERIALLY_REUSABLE;

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
                
    cursor cur_day_hour_for_group_teacher (
        p_group_id integer,
        p_teacher_id integer,
        p_ignore_group_availability integer default 0
    ) is
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
        hours_avail_for_class_teacher as  ( /* Godziny w ktorych da sie przypisac */
            select
                    sq.day_id,
                    sq.hour_id,
                    sq.hour_order,
                    sq.available as group_available,
                    vtta.available as teacher_available,
                    sq.hours_available_on_day,
                    case
                        when sq.hours_available_on_day=sq.hours_on_day then 1
                        else 0
                    end as day_not_planned_yet
            from
                hours_available_for_class_2 sq
                join v_tmp_teachers_availability vtta on (
                    vtta.hour_id=sq.hour_id
                    and vtta.day_id=sq.day_id
                    and vtta.teacher_id=p_teacher_id
                )
            where
                (sq.hours_available_on_day=sq.hours_on_day or sq.previous_hour_available=0 or sq.following_hour_available=0)
                and (sq.available=1 or p_ignore_group_availability=1)
                and vtta.assignable=1
        ),
        result as ( /* Uporzadkowanie godzin tak, aby na poczatku byla najbardziej optymalna */
            select
                v.day_id,
                v.hour_id,
                v.group_available
            from
            	hours_avail_for_class_teacher v
            order by
            	day_not_planned_yet desc,
                hours_available_on_day desc,
                hour_order asc
                
        )
        select
            day_id,
            hour_id,
            group_available
        from result
        where
        	1=1
            and rownum=1;
        
    /* - - - V A R I A B L E S - - - */
    v_timetable_id_for_log integer;
    
    /* - - - B O D Y - - - **/
    
    procedure set_timetable_for_log(p_timetable_id integer) is
    begin
        v_timetable_id_for_log := p_timetable_id;
    end;
    
    procedure log(p_text varchar2) is
        pragma autonomous_transaction;
    begin        
        insert into timetables_timetablelog (
            timetable_id,
            text
        )
        values (
            v_timetable_id_for_log,
            format('{}: {}',systimestamp,p_text)
        );
        commit;
    end;
    
    procedure prepare_permanent_tables (p_timetable_id integer) is
    begin
        delete from timetables_timetableposition where timetable_id=p_timetable_id;
        delete from timetables_timetablelog where timetable_id=p_timetable_id;
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
            v_tmp_groups_subjects vgs
        join (
            select level lp
            from dual
            connect by level <= (select max(expected) from v_groups_subjects)
        ) sq on (sq.lp<=vgs.expected);
    end;
    
    function decode_bool(p_bool boolean) return integer is
    begin
    	return case p_bool
            when true then 1
            when false then 0
            else null
        end;
    end;
    
    function find_hour_for_group_teacher (
        p_group_id integer,
        p_teacher_id integer,
        p_ignore_group_availability boolean
    ) return cur_day_hour_for_group_teacher%rowtype is
        vr_result cur_day_hour_for_group_teacher%rowtype;
        v_was_found boolean;
    begin
        open cur_day_hour_for_group_teacher(
            p_group_id,
            p_teacher_id,
            decode_bool(p_ignore_group_availability)
        );
        fetch cur_day_hour_for_group_teacher into vr_result;
        v_was_found := cur_day_hour_for_group_teacher%found ;
        close cur_day_hour_for_group_teacher;
        
        if not v_was_found then
            raise no_data_found;
        end if;
        
        return vr_result; 
        
    end;
    
    procedure make_timetable_permanent (p_timetable_id integer) is
    begin
        /* Przenosze tabele tymczasowa do tabelek produkcyjnych */
        insert into timetables_timetableposition (
            timetable_id,
            classroom_id,
            day_id,
            group_id,
            hour_id,
            subject_id,
            teacher_id
        )
        select
            p_timetable_id,
            classroom_id,
            day_id,
            group_id,
            hour_id,
            subject_id,
            teacher_id
        from tmp_timetableposition
        where
            classroom_id is not null
            and day_id is not null
            and group_id is not null
            and hour_id is not null
            and subject_id is not null
            and teacher_id is not null;
    end;

    procedure generate (p_timetable_id integer) is
    begin
        set_timetable_for_log(p_timetable_id);
        
        log('Przygotowuje tabelke docelowa.');
        
        prepare_permanent_tables(p_timetable_id);
    
        log('Rozpoczynam przeliczenie dla planu.');
    
        /* Laduje tabelke tymczasowa godzinami do zaplanowania (nie wypelnione kto i gdzie) */
        log('Przygotowujê tabelkê tymczasow¹.');
        prepare_temporary_table();
        log('Tabelka tymczasowa przygotowana');
        
        /* Planuje godzine o ktorej odbeda sie zajecia */      
        begin
            log('Rozpoczynam planowanie godzin i dni poszczególnych zajêc.');
            for ctp in cur_classes_to_plan loop
                declare
                    vr_hour_for_group_teacher cur_day_hour_for_group_teacher%rowtype;
                begin
                    begin
                        vr_hour_for_group_teacher := find_hour_for_group_teacher (ctp.group_id,ctp.teacher_id,false);
                    exception
                        when no_data_found then
                            log(format('Nie znaleziono godziny gdzie dla grupy {} mog³yby sie odbyc zajecia z nauczycielem {}',ctp.group_id,ctp.teacher_id));
                            continue;
                    end;
                    
                    if vr_hour_for_group_teacher.group_available!=1 then
                    	throw('Na tym etapie generacji powótrne przydzielanie godzin nie jest dopuszczalne!');
                    end if;
                    
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
            log('Zakonczono planowanie godzin i dni poszczególnych zajêc.');
        end;
        
        /* Tasuje godzinami w taki sposób, aby udoskonalic plan
        szukam godzin niezaplanowanych, znajduje mozliwa dla niej godzine po czym
        wycofuje te godzine z planu i podstawiam za nia brakujaca*/
        declare
        	v_not_found_count integer := 0;
        begin
        	for i in 1..300 loop
            	declare
                	vr_ctp cur_classes_to_plan%rowtype;
                    v_exists boolean;
                    vr_hour_found cur_day_hour_for_group_teacher%rowtype;
                begin
                	open cur_classes_to_plan;
                    
                    for ii in 0..v_not_found_count loop
                    	/* Je¿eli dla jakichs zajec nie znalazlem zajec
                        to bez tej petli przy kazdej kolejnej iteracji duzej petli
                        szukalbym dla tej samej godziny */
                    	fetch cur_classes_to_plan into vr_ctp;
                    	v_exists := nvl(cur_classes_to_plan%found,false);
                    end loop;
                    
                    close cur_classes_to_plan;
                    
                    if v_exists then
                    	begin
                        	vr_hour_found := find_hour_for_group_teacher (vr_ctp.group_id,vr_ctp.teacher_id,true);
                        exception
                        	when no_data_found then
                            	v_not_found_count:=v_not_found_count+1;
                                log(format('Nie znaleziono godziny dla nauczyciela {} i grupy {}; to taki przypadke numer {}',vr_ctp.teacher_id,vr_ctp.group_id,v_not_found_count));
                                continue;
                        end;
                        
                        /* Wycofuje zaplanowane dla poprzedniej godziny */
                        if vr_hour_found.group_available=0 then
                        	update tmp_timetableposition
                            set
                            	day_id=null,
                                hour_id=null
                            where
                            	group_id=vr_ctp.group_id
                                and day_id=vr_hour_found.day_id
                                and hour_id=vr_hour_found.hour_id;
                        end if;
                        
                        /* Oznaczam interesujaca mnie godzine */
                        update
                            tmp_timetableposition
                        set
                            day_id=vr_hour_found.day_id,
                            hour_id=vr_hour_found.hour_id
                        where
                            tmp_id=vr_ctp.tmp_id;
                            
                        /* Odznaczona godzina pozostaje odznaczona;
                        zostanie obs³u¿ona w kolejnej iteracji */
                        
                    end if;
                    
                end;
            end loop;
        end;
        
        log('Dla potrzeb debuga przypisuje wszystkie zajecia do jednej klasy');    
        for v in (select * from tmp_timetableposition ) loop
            for vv  in (
                select max(id) x from classrooms_classroom cc where not exists(
                    select null from tmp_timetableposition
                    where
                        day_id=v.day_id
                        and hour_id = v.hour_id
                        and classroom_id=cc.id
                    )
            ) loop
                update tmp_timetableposition set classroom_id=vv.x where tmp_id=v.tmp_id;
                exit;
            end loop;
        end loop;
        
        log('Przenosze dane to tabeli docelowej.');  
        make_timetable_permanent (p_timetable_id);
        
    end;

end;
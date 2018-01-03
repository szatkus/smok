 declare
 	v_timetable_id integer;
    
    /* Przedmioty od przedmiotów gdzie najmniej dostêpnych godzin */
    cursor cur_subjects_ord_by_avail (p_timetable_id integer) is select
        subject_id,
        sum(assignable) as assignable
    from v_subjects_availability
    where timetable_id=p_timetable_id
    group by subject_id
    order by 2 asc;
    
    /* Lista nauczycieli ze wspolczynnikami jaki procent godzin powinien byc im przydzielony */
    cursor cur_teachers_to_assign (p_timetable_id integer, p_subject_id integer) is with teacher_hours as (
        select
            teacher_id,
            sum(assignable) as assignable
        from v_teachers_availability
        where
            timetable_id=p_timetable_id
            and teacher_id in (
                select teacher_id
                from teachers_teacher_subjects
                where subject_id=p_subject_id
            )
        group by teacher_id
    )
    select
        teacher_id,
        assignable,
        factor,
        sum(factor) over (order by assignable asc,teacher_id) as cum_factor,
        sum(factor) over (order by assignable asc,teacher_id rows between unbounded preceding and 1 preceding) as lag_cum_factor,
        sum(factor) over (order by assignable asc,teacher_id rows between unbounded preceding and 1 following) as lead_cum_factor
    from (
        select
            teacher_id,
            assignable,
            assignable/sum(assignable) over () as factor
        from teacher_hours
        order by
            assignable asc,
            teacher_id
    );
    
    /* Jakie przedmioty przypisac danemu nauczycielowi? */
    cursor cur_groups_for_teacher (
    	p_timetable_id integer,
        p_subject_id integer,
        p_lag_cum_teacher_factor number,
        p_lead_cum_teacher_factor number
    )
    is
    select
        group_id,
        expected,
        cum_factor
    from (
        select
            group_id,
            expected,
            sum(expected) over (order by group_id)/sum(expected) over () as cum_factor
        from v_groups_subjects
        where
            timetable_id=p_timetable_id
            and subject_id=p_subject_id
    )
    where
        cum_factor>=nvl(p_lag_cum_teacher_factor,0)
        and cum_factor <nvl(p_lead_cum_teacher_factor,2);
    
 begin
 
 	/* Rozpoznaje plan wygenerowany dla danych testowych */
 	select id
    into v_timetable_id
    from timetables_timetable
    where name='Plan testowy';
    
    /* Pêtla po przedmiotach od przedmiotu gdzie najmniej dostêpnych godzin */
    for subject in cur_subjects_ord_by_avail (v_timetable_id) loop
    	declare
        	v_hours_required integer := 0;
        begin
        	/* Pobieram liczbê godzin, które musz¹ byc rozplanowane */
            select sum(to_assign)
            into v_hours_required
            from v_groups_subjects
            where
                timetable_id=v_timetable_id
                and subject_id=subject.subject_id;
                
            for subjects_teacher in cur_teachers_to_assign(v_timetable_id,subject.subject_id) loop
            	
            	for group_ in cur_groups_for_teacher(
                    v_timetable_id,
                    subject.subject_id,
                    subjects_teacher.lag_cum_factor,
                    subjects_teacher.lead_cum_factor
                ) loop
                	begin
                        insert into teachers_teacher_groups (
                            teacher_id,
                            group_id
                        )
                        values (
                            subjects_teacher.teacher_id,
                            group_.group_id
                        );
                    exception
                    	when dup_val_on_index then null;
                    end;
                end loop;
            
            end loop;
    
        end;
    end loop;
 
 end;
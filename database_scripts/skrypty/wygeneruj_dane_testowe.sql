/* Usuwam stare */

delete from teachers_teacherclasssubject;

delete from GROUPS_GROUP;

delete from CLASSPROFILES_HOURSAMOUNT;

delete from CLASSPROFILES_CLASS_PROFILE;

delete from CLASSPROFILES_GRADE;

delete from AVAILABILITY_TEACHERSAVAIL162E;

--delete from TEACHERS_TEACHER_SUBJECTS;

delete from TEACHERS_TEACHER;

delete from CLASSROOMS_CLASSROOM_AVAILDDA3; 

delete from CLASSROOMS_CLASSROOM;

delete from SUBJECTS_SUBJECT;

update users_user set school_id_id=null;

delete from SCHOOL_SCHOOL;

delete from SCHOOL_SCHOOL_TYPE;

delete from COMMONS_HOURS;
 
delete from COMMONS_DAYS;

delete from timetables_timetableposition;

delete from timetables_timetablelog;

delete from timetables_timetable;

commit;

/* Dni */
insert into commons_days
   (id, name, "ORDER")
 values
   (1, 'Poniedzialek', 1);
insert into commons_days
   (id, name, "ORDER")
 values
   (2, 'Wtorek', 2);
insert into commons_days
   (id, name, "ORDER")
 values
   (3, 'Sroda', 3);
insert into commons_days
   (id, name, "ORDER")
 values
   (4, 'Czwartek', 4);
insert into commons_days
   (id, name, "ORDER")
 values
   (5, 'Piatek', 5);
   
commit;
   
Insert into SCHOOL_SCHOOL_TYPE
   (ID, TYPE_NAME)
 Values
   (1, 'Szkoła podstawowa');

commit;

/* Szkoła i typ szkoły */
insert into school_school
   (id, school_name, school_address, school_type_id, school_type_name)
 values
   (100, 'Szkola Podstawowa nr 1 w Lesznie', 'Leszno, ul. Szkolna', 1, null);

commit;

/* Godziny lekcyjne */

insert into commons_hours (
    "ORDER",
    hour_from,
    hour_to
)
select
    lp*10 as "order",
    lpad(floor(poczatek_lekcji/60),2,'0')||':'||lpad(mod(poczatek_lekcji,60),2,'0') as godzina_od,
    lpad(floor(koniec_lekcji/60),2,'0')||':'||lpad(mod(koniec_lekcji,60),2,'0') as godzina_do
from(
    select
        lp,
        init+czas_trwania_wczesn_lekcji+czas_trwania_wczesn_przerw as poczatek_lekcji,
        init+czas_trwania_wczesn_lekcji+czas_trwania_wczesn_przerw+45 as koniec_lekcji,
        czas_trwania_wczesn_lekcji,
        czas_trwania_wczesn_przerw,
        czas_trwania_przerwy,
        czas_trwania_lekcji
    from (
        select
            lp,
            init,
            nvl(sum(czas_trwania_lekcji) over (order by lp rows between unbounded preceding and 1 preceding),0) as czas_trwania_wczesn_lekcji,
            nvl(sum(czas_trwania_przerwy) over (order by lp rows between unbounded preceding and 1 preceding),0) as czas_trwania_wczesn_przerw,
            czas_trwania_przerwy,
            czas_trwania_lekcji
        from (
            select
                lp,
                init,
                45 as czas_trwania_lekcji,
                5+5*mod(lp,3) as czas_trwania_przerwy
            from
            ( select level lp, (7*60) init from dual connect by level<nvl(:ilosc_godzin_lekcyjnych,11) ) sq
        )
    )
);

commit;

/* Przedmioty */

declare
	przedmioty varchar2(4000) := 'polski, matematyka, historia, wos, biologia, chemia, geografia, informatyka, technika, wf, muzyka, religia, edukacja europejska, angielski, fizyka, francuski, niemiecki';
begin
	declare
    	v_value varchar2(100);
        i integer := 1;
    begin
    	loop
        	v_value := trim(initcap(regexp_substr(przedmioty,'[^,]+',1,i)));
            if v_value is not null then
            	insert into subjects_subject (
            	name,
            	description,
            	last_updated_timestamp,
            	code,
            	special_classroom_req
            	) values (
            	v_value,
            	v_value,
            	systimestamp,
            	upper(substr(v_value,1,3)),
            	case
                    when v_value in ('Wf','Chemia') then 1
                    else 0
            	end
            	);
            end if;
            i:=i+1;
            exit when v_value is null;
        end loop;
    end;
end;

commit;

/* Sale */

insert into classrooms_classroom (
    name,
    building,
    seats,
    school_id
)
select
    pietro.lp*100+sala.lp as numer_sali,
    'glowny' as budynek,
    14*(mod(sala.lp,3)+1) as miejsc,
    100 as school_id
from
    (select level as lp from dual connect by level<= nvl(:ilosc_klas_na_pietrze,10)) sala
    cross join (select level as lp from dual connect by level<= nvl(:ilosc_pieter,5)) pietro;
    
commit;

insert into CLASSROOMS_CLASSROOM_AVAILDDA3 (subject_id, classroom_id)
select
    sq.id as subject_id,
    cr.id as classroom_id
from (
    SELECT
        id,
        greatest(mod(id, nvl(:ilosc_pieter,5)), 1) * 100 + greatest(mod(id, nvl(:ilosc_klas_na_pietrze,10)), 1) AS sala,
        name
    FROM
        subjects_subject
    WHERE
        trunc(last_updated_timestamp) >= DATE '2017-12-01'
) sq
join CLASSROOMS_CLASSROOM cr on (cr.name=sq.sala);

commit;

declare
    type tab is table of varchar2(100);
    fnames tab:= tab(
        'Anna',
        'Maria',
        'Katarzyna',
        'Małgorzata',
        'Agnieszka',
        'Krystyna',
        'Barbara',
        'Ewa',
        'Elżbieta',
        'Zofia',
        'Jan',
        'Andrzej',
        'Piotr',
        'Krzysztof',
        'Stanisław',
        'Tomasz',
        'Paweł',
        'Józef',
        'Marcin',
        'Marek',
        'Krystyna',
        'Barbara',
        'Ewa',
        'Elżbieta',
        'Zofia',
        'Jan',
        'Andrzej',
        'Piotr',
        'Krzysztof',
        'Stanisław',
        'Krystyna',
        'Barbara',
        'Ewa',
        'Elżbieta',
        'Zofia',
        'Jan',
        'Andrzej',
        'Piotr',
        'Krzysztof',
        'Stanisław'
    );
    lnames tab := tab(
        'Nowak',
        'Kowalski',
        'Wiśniewski',
        'Dąbrowski',
        'Lewandowski',
        'Wójcik',
        'Kamiński',
        'Kowalczyk',
        'Zieliński',
        'Szymański',
        'Woźniak',
        'Kozłowski',
        'Jankowski',
        'Wojciechowski',
        'Kwiatkowski',
        'Kaczmarek',
        'Mazur',
        'Krawczyk',
        'Piotrowski',
        'Grabowski',
        'Lewandowski',
        'Wójcik',
        'Kamiński',
        'Kowalczyk',
        'Zieliński',
        'Szymański',
        'Woźniak',
        'Kozłowski',
        'Jankowski',
        'Wojciechowski',
         'Woźniak',
        'Kozłowski',
        'Jankowski',
        'Wojciechowski',
        'Kwiatkowski',
        'Kaczmarek',
        'Mazur',
        'Krawczyk',
        'Piotrowski',
        'Grabowski'
    );
begin
    for i in 1..40 loop
        insert into TEACHERS_TEACHER (first_name,last_name) values (fnames(i),lnames(i));
    end loop;
end;

commit;

--insert into TEACHERS_TEACHER_SUBJECTS (
--TEACHER_ID,
--SUBJECT_ID
--)
--select
--    tt.id,
--    sq.id
--from (
--    SELECT
--        id,
--        rownum x
--    FROM
--        SUBJECTS_SUBJECT
--) sq
--join teachers_teacher tt on (mod(tt.id,10)=mod(sq.x,10));
--
--commit;

--insert into AVAILABILITY_TEACHERSAVAIL162E (
--    day_id,
--    hour_id,
--    teacher_id,
--    AVAILABLE
--)
--select
--    day_id,
--    hour_id,
--    teacher_id,
--    1
--from (
--    SELECT
--        d.id AS day_id,
--        h.id AS hour_id,
--        t.id AS teacher_id,
--        CASE
--        WHEN dbms_random.value() < 0.8
--            THEN 'T'
--        ELSE 'N'
--        END  AS czy_dostepny
--    FROM
--        commons_hours h
--        CROSS JOIN COMMONS_DAYS d
--        CROSS JOIN TEACHERS_TEACHER t
--)
--WHERE
--    czy_dostepny='T';

insert into AVAILABILITY_TEACHERSAVAIL162E (
    day_id,
    hour_id,
    teacher_id,
    AVAILABLE
)
SELECT
    d.id AS day_id,
    h.id AS hour_id,
    t.id AS teacher_id,
    CASE
    WHEN dbms_random.value() < 0.8
        THEN 1
    ELSE 0
    END  AS czy_dostepny
FROM
    commons_hours h
    CROSS JOIN COMMONS_DAYS d
    CROSS JOIN TEACHERS_TEACHER t;

delete from AVAILABILITY_TEACHERSAVAIL162E  where available=0;

commit;

/* Profile klas */

merge into classprofiles_grade cg using (
    select
        level lp
    from
        dual
    connect by
        level<=8
) sq on (sq.lp=cg.grade)
when not matched then insert(id,grade) values (sq.lp,sq.lp);

commit;

declare
	type t_tab is table of varchar2(1000);
    v_tab t_tab := t_tab(
        'BIOLOGIA-CHEMIA',
        'MATEMTYKA-INFORMATYKA',
        'HISTORIA-WOS',
        'POLSKI'
    );
begin
	for v in (select id from classprofiles_grade) loop
    	forall i in 1..v_tab.count
        insert into CLASSPROFILES_CLASS_PROFILE (
        	name,
            grade_id,
            last_updated_timestamp
        )
        values(
        	v_tab(i),
            v.id,
            systimestamp
        );
    end loop;
end;

commit;

insert into CLASSPROFILES_HOURSAMOUNT (
    profile_id,
    subject_id,
    hoursno
)
select
    profile_id,
    subject_id,
    greatest(round((grade_id/4)*wspolczynnik_rozszerzenia),1) as hours_no
from (
    select
        ccp.id as profile_id,
        ss.id as subject_id,
        grade_id,
        case
            when lower(ccp.name) like lower('%'||ss.name||'%') then 1.5
            else 1
        end as wspolczynnik_rozszerzenia
    from
        CLASSPROFILES_CLASS_PROFILE ccp
        cross join subjects_subject ss
);

commit;
 
insert into groups_group (
    name,
    group_profile_id,
    school_id
)   
select
	*
from(
    select
        cg.grade||chr(96+dense_rank() over (partition by cg.grade order by ccp.name)) symbol_klasy,
        ccp.id as group_profile_id,
        (select max(id) from school_school) as school_id
    from
        CLASSPROFILES_CLASS_PROFILE ccp
        join classprofiles_grade cg on (cg.id=ccp.grade_id)
)
where
    symbol_klasy not in (select name from groups_group)
order by
1;

commit;

insert into timetables_timetable (
    school_id,
    name,
    is_processed,
    last_updated_timestamp
)
values
(
    (select max(id) from school_school),
    'Plan testowy',
    0,
    systimestamp
);

commit;

/* przydział nauczycieli do grup */

declare
 	v_timetable_id integer;
    
    /* Przedmioty od przedmiotów gdzie najmniej dostępnych godzin */
    cursor cur_subjects_ord_by_avail (p_timetable_id integer) is select
        subject_id,
        sum(assignable) as assignable
    from (
        with all_days_hours_subjects as (
            select
                ch.id as hour_id,
                cd.id as day_id,
                ss.id as subject_id
            from
                commons_hours ch
                cross join commons_days cd
                cross join subjects_subject ss
        ),
        subquery as (
            select
                tt.id as timetable_id,
                sq.hour_id,
                sq.day_id,
                sq.subject_id,
                nvl(sum(vta.available),0) as available,
                nvl(sum(vta.used),0) as used
            from
                all_days_hours_subjects sq
                cross join timetables_timetable tt
                left outer join (
                    /* Obejscie */
                    select
                        tt.id as teacher_id,
                        sq.id as subject_id
                    from (
                        SELECT
                            id,
                            rownum x
                        FROM
                            SUBJECTS_SUBJECT
                    ) sq
                    join teachers_teacher tt on (mod(tt.id,10)=mod(sq.x,10))
                ) tts on (tts.subject_id=sq.subject_id)
                left outer join v_teachers_availability vta on (
                    vta.teacher_id=tts.teacher_id
                    and vta.hour_id=sq.hour_id
                    and vta.day_id=sq.day_id
                    and vta.timetable_id=tt.id
                )
            group by
                tt.id,
                sq.hour_id,
                sq.day_id,
                sq.subject_id
        )
        select
            timetable_id,
            hour_id,
            day_id,
            subject_id,
            available,
            used,
            available-used as assignable
        from
            subquery
    )
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
                from (
                    select
                        tt.id teacher_id,
                        sq.id subject_id
                    from (
                        SELECT
                            id,
                            rownum x
                        FROM
                            SUBJECTS_SUBJECT
                    ) sq
                    join teachers_teacher tt on (mod(tt.id,10)=mod(sq.x,10))
                )
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
        case
            when lead(factor) over (order by assignable asc,teacher_id) is null then 2
            else sum(factor) over (order by assignable asc,teacher_id rows between unbounded preceding and 1 following)
        end as lead_cum_factor
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
        and cum_factor <=nvl(p_lead_cum_teacher_factor,1);
    
 begin
 
 	/* Rozpoznaje plan wygenerowany dla danych testowych */
 	select id
    into v_timetable_id
    from timetables_timetable
    where name='Plan testowy';
    
    /* Pętla po przedmiotach od przedmiotu gdzie najmniej dostępnych godzin */
    for subject in cur_subjects_ord_by_avail (v_timetable_id) loop
    	declare
        	v_hours_required integer := 0;
        begin
        	/* Pobieram liczbę godzin, które muszą byc rozplanowane */
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
                    subjects_teacher.cum_factor
                ) loop
                	begin
                        insert into teachers_teacherclasssubject (
                            teacher_id,
                            group_id,
                            subject_id
                        )
                        values (
                            subjects_teacher.teacher_id,
                            group_.group_id,
                            subject.subject_id
                        );
                    exception
                    	when dup_val_on_index then null;
                    end;
                end loop;
            
            end loop;
    
        end;
    end loop;
 
 end;
 
 commit;

/* Fix ad hoc do brakujacego przydzialu nauczycieli */

--begin
--    for v in (
--        select distinct
--            (select max(teacher_id) from teachers_teacher_subjects where subject_id=vgs.subject_id) as teacher_id,
--            vgs.group_id
--        from
--            v_groups_subjects vgs
--        where
--            get_teacher_for_subject_group(subject_id,group_id, null) is null
--    ) loop
--        begin
--        insert into teachers_teacher_groups (
--            teacher_id,
--            group_id
--        ) values (
--            v.teacher_id,
--            v.group_id
--        );
--        exception when others then
--            throw('teacher_id: {}, group_id: {}',v.teacher_id,v.group_id);
--        end;
--    end loop;
--end;
--
--commit;
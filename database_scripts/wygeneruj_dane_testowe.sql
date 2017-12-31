/* Usuwam stare */

delete from GROUPS_GROUP;

delete from CLASSPROFILES_HOURSAMOUNT;

delete from CLASSPROFILES_CLASS_PROFILE;

delete from CLASSPROFILES_GRADE;

delete from AVAILABILITY_TEACHERSAVAIL162E;

delete from TEACHERS_TEACHER_SUBJECTS;

delete from TEACHERS_TEACHER;

delete from CLASSROOMS_CLASSROOM_AVAILDDA3; 

delete from CLASSROOMS_CLASSROOM;

delete from SUBJECTS_SUBJECT;

update users_user set school_id_id=null;

delete from SCHOOL_SCHOOL;

delete from SCHOOL_SCHOOL_TYPE;

delete from COMMONS_HOURS;
 
delete from COMMONS_DAYS;

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
        'Marek'
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
        'Grabowski'
    );
begin
    for i in 1..20 loop
        insert into TEACHERS_TEACHER (first_name,last_name) values (fnames(i),lnames(i));
    end loop;
end;

commit;

insert into TEACHERS_TEACHER_SUBJECTS (
TEACHER_ID,
SUBJECT_ID
)
select
    tt.id,
    sq.id
from (
    SELECT
        id,
        rownum x
    FROM
        SUBJECTS_SUBJECT
) sq
join teachers_teacher tt on (mod(tt.id,10)=mod(sq.x,10));

commit;

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
    greatest(round(grade_id/3),1)*wspolczynnik_rozszerzenia as hours_no
from (
    select
        ccp.id as profile_id,
        ss.id as subject_id,
        grade_id,
        case
            when lower(ccp.name) like lower('%'||ss.name||'%') then 2
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

/* Todo: przydział nauczycieli do grup */

select
*
from
TEACHERS_TEACHER_GROUPS
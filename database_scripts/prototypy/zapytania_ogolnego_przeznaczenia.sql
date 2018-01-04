--CLASSPROFILES_GRADE
--DJANGO_MIGRATIONS
--SCHOOL_SCHOOL
--SCHOOL_SCHOOL_TYPE
--DJANGO_CONTENT_TYPE
--AUTH_PERMISSION
--AUTH_GROUP
--AUTH_GROUP_PERMISSIONS
--USERS_USER
--USERS_USER_GROUPS
--USERS_USER_USER_PERMISSIONS
--DJANGO_ADMIN_LOG
--SUBJECTS_SUBJECT
--TEACHERS_TEACHER
--TEACHERS_TEACHER_SUBJECTS
--COMMONS_DAYS
--COMMONS_HOURS
--AVAILABILITY_TEACHERSAVAIL162E
--CLASSPROFILES_CLASS_PROFILE
--CLASSPROFILES_HOURSAMOUNT
--CLASSROOMS_CLASSROOM
--GROUPS_GROUP
--DJANGO_SESSION
--TIMETABLES_TIMETABLE
--TIMETABLES_TIMETABLEPOSITION
--CLASSROOMS_CLASSROOM_AVAILDDA3

select *
from user_tables
where table_name not in (
    'CLASSPROFILES_GRADE',
    'DJANGO_MIGRATIONS',
    'SCHOOL_SCHOOL',
    'SCHOOL_SCHOOL_TYPE',
    'DJANGO_CONTENT_TYPE',
    'AUTH_PERMISSION',
    'AUTH_GROUP',
    'AUTH_GROUP_PERMISSIONS',
    'USERS_USER',
    'USERS_USER_GROUPS',
    'USERS_USER_USER_PERMISSIONS',
    'DJANGO_ADMIN_LOG',
    'SUBJECTS_SUBJECT',
    'TEACHERS_TEACHER',
    'TEACHERS_TEACHER_SUBJECTS',
    'COMMONS_DAYS',
    'COMMONS_HOURS',
    'AVAILABILITY_TEACHERSAVAIL162E',
    'CLASSPROFILES_CLASS_PROFILE',
    'CLASSPROFILES_HOURSAMOUNT',
    'CLASSROOMS_CLASSROOM',
    'GROUPS_GROUP',
    'DJANGO_SESSION',
    'TIMETABLES_TIMETABLE',
    'TIMETABLES_TIMETABLEPOSITION',
    'CLASSROOMS_CLASSROOM_AVAILDDA3'
)

/* £aczna ilosc godzin potrzbna dla wszystkich klas */

select
    ss.name,
    sum(ch.hoursno)
from
    groups_group gg
    join classprofiles_class_profile ccp on (gg.group_profile_id=ccp.id)
    join classprofiles_hoursamount ch on (ch.profile_id=ccp.id)
    join subjects_subject ss on (ss.id=ch.subject_id)
group by rollup(
    ss.name)
    
/* Dostêpne godziny nauczyciela */

select
    tt.id as teacher_id,
    ss.id as subject_id,
    count(tav.id)
from
    teachers_teacher tt
    join teachers_teacher_subjects tts on (tts.teacher_id=tt.id)
    join subjects_subject ss on (ss.id=tts.subject_id)
    join availability_teachersavail162e tav on (tav.teacher_id=tt.id)
where
    tav.available=1
group by
    tt.id,
    ss.id

with sq_available as (
    select
        tt.id as teacher_id,
        count(tav.id) cnt
    from
        teachers_teacher tt
        join teachers_teacher_subjects tts on (tts.teacher_id=tt.id)
        join subjects_subject ss on (ss.id=tts.subject_id)
        join availability_teachersavail162e tav on (tav.teacher_id=tt.id)
    where
        tav.available=1
    group by
        tt.id
),
sq_used as (
        select
            teacher_id,
            count(1) as cnt
        from timetables_timetableposition ttp
        where timetable_id=:p_timetable_id
        group by teacher_id
)
select
    teacher_id,
from
    sq_available sqa
    left outer join sq_used squ on (squ.teacher_id=sqa.teacher_id)
    
select
    teacher_id,
    count(1) as cnt
from timetables_timetableposition ttp
where timetable_id=:p_timetable_id
group by teacher_id

select
tt.id as timetable_id,
ta.day_id,
ta.hour_id,
ta.teacher_id,
ta.available as teacher_available,
nvl2(ttp.id,1,0) as used,
ta.available-nvl2(ttp.id,1,0) as available
from
availability_teachersavail162e ta
cross join timetables_timetable tt
left outer join timetables_timetableposition ttp on (
ttp.day_id=ta.day_id
and ttp.hour_id=ta.hour_id
and ttp.teacher_id=ta.hour_id
and tt.id=ttp.timetable_id
)

with all_days_hours_teachers as (
    select
        ch.id as hour_id,
        cd.id as day_id,
        tt.id as teacher_id
    from
        commons_hours ch
        cross join commons_days cd
        cross join teachers_teacher tt
),
sq_teachers_availability as (
    select
        day_id,
        hour_id,
        teacher_id,
        max(available) as available /* Zabezpieczenie przed dublami */
    from
        availability_teachersavail162e 
    group by
        day_id,
        hour_id,
        teacher_id
)
select
    tt.id as timetable_id,
    dht.hour_id,
    dht.day_id,
    dht.teacher_id,
    nvl(ta.available,0) as available,
    nvl2(ttp.id,1,0) as used,
    greatest(nvl(ta.available,0)-nvl2(ttp.id,1,0),0) as assignable
from
    all_days_hours_teachers dht
    cross join timetables_timetable tt
    left outer join sq_teachers_availability ta on (
        ta.day_id=dht.day_id
        and ta.hour_id=dht.hour_id
        and ta.teacher_id=dht.teacher_id
    )
    left outer join timetables_timetableposition ttp on (
        ttp.day_id=dht.day_id
        and ttp.hour_id=dht.hour_id
        and ttp.teacher_id=dht.teacher_id
        and tt.id=ttp.timetable_id
    );

select
    day_id,
    hour_id,
    teacher_id,
    max(available) as available
from
    availability_teachersavail162e 
group by
    day_id,
    hour_id,
    teacher_id

select
*
from
v_teachers_availability
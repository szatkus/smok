var scheduler = scheduler || {};

scheduler.data = {};

scheduler.data.headers = ["Godzina", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
// scheduler.data.monday = [{lesson: "j. polski", teacher: "Kowalski", class: "1"}, {lesson: "j. angielski", teacher: "", class: "1"}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "W-f", teacher: "Kowalski", class: "1"}];
// scheduler.data.tuesday = [{lesson: "j. polski", teacher: "Kowalski", class: "1"}, {lesson: "j. angielski", teacher: "", class: "1"}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "W-f", teacher: "Kowalski", class: "1"}];
// scheduler.data.wednesday = [{lesson: "j. polski", teacher: "Kowalski", class: "1"}, {lesson: "j. angielski", teacher: "", class: "1"}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "W-f", teacher: "Kowalski", class: "1"}];
// scheduler.data.thursday = [{lesson: "j. polski", teacher: "Kowalski", class: "1"}, {lesson: "j. angielski", teacher: "", class: "1"}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "W-f", teacher: "Kowalski", class: "1"}];
// scheduler.data.friday = [{lesson: "j. polski", teacher: "Kowalski", class: "1"}, {lesson: "j. angielski", teacher: "", class: "1"}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "W-f", teacher: "Kowalski", class: "1"}];

scheduler.data.monday = [{lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null},{lesson: "", teacher: null, class: null, group: null},{lesson: "", teacher: null, class: null, group: null},{lesson: "", teacher: null, class: null, group: null},{lesson: "", teacher: null, class: null, group: null}];
scheduler.data.tuesday = [{lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null},{lesson: "", teacher: null, class: null, group: null},{lesson: "", teacher: null, class: null, group: null},{lesson: "", teacher: null, class: null, group: null},{lesson: "", teacher: null, class: null, group: null}];
scheduler.data.wednesday = [{lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null},{lesson: "", teacher: null, class: null, group: null}];
scheduler.data.thursday = [{lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}];
scheduler.data.friday = [{lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}, {lesson: "", teacher: null, class: null, group: null}];

scheduler.data.hours = ['8:15 - 9:00', '9:15 - 10:00', '10:15 - 11:00', '11:15 - 12:00', '12:15 - 13:00', '13:15 - 14:00', '14:15 - 15:00', '15:15-16:00', '16:15-17:00', '17:15-18:00'];

scheduler.data.timeTable = [
  scheduler.data.monday,
  scheduler.data.tuesday,
  scheduler.data.wednesday,
  scheduler.data.thursday,
  scheduler.data.friday
];
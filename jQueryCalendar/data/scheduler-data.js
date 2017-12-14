var scheduler = scheduler || {};

scheduler.data = {};

scheduler.data.headers = ["Hours", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
scheduler.data.monday = [{lesson: "Polski", teacher: "Kowalski", class: "1"}, {lesson: "Angielski", teacher: "", class: "1"}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "W-f", teacher: "Kowalski", class: "1"}];
scheduler.data.tuesday = [{lesson: "Polski", teacher: "Kowalski", class: "1"}, {lesson: "Angielski", teacher: "", class: "1"}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "W-f", teacher: "Kowalski", class: "1"}];
scheduler.data.wednesday = [{lesson: "Polski", teacher: "Kowalski", class: "1"}, {lesson: "Angielski", teacher: "", class: "1"}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "W-f", teacher: "Kowalski", class: "1"}];
scheduler.data.thursday = [{lesson: "Polski", teacher: "Kowalski", class: "1"}, {lesson: "Angielski", teacher: "", class: "1"}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "W-f", teacher: "Kowalski", class: "1"}];
scheduler.data.friday = [{lesson: "Polski", teacher: "Kowalski", class: "1"}, {lesson: "Angielski", teacher: "", class: "1"}, {lesson: "", teacher: null, class: null}, {lesson: "", teacher: null, class: null}, {lesson: "W-f", teacher: "Kowalski", class: "1"}];

scheduler.data.hours = [7, 8, 9, 10, 11];

scheduler.data.timeTable = [
  scheduler.data.monday,
  scheduler.data.tuesday,
  scheduler.data.wednesday,
  scheduler.data.thursday,
  scheduler.data.friday
];
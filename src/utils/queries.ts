export class VolunteerAssignmentQueries {
  static pastEventsInfoForOrganiserVolunteerCard = "\
  SELECT va.userId, et.taskId, et.eventId, e.title AS eventTitle, e.startOn, t.name AS taskName, va.organiserRating \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  WHERE ADDTIME(e.startOn, e.duration) < NOW() \
   AND va.userId = ?; \
  "
  static ratingsForEvent = "\
  SELECT va.userId, et.taskId, et.eventId, va.organiserRating, e.title AS eventTitle, e.startOn, e.duration, e.picture, e.type, r.name, t.name AS taskName  \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  LEFT JOIN room AS r ON r.id = e.roomId\
  WHERE eventId = ?; \
  "
  static commentsForEvent = "\
  SELECT va.userId, et.taskId, et.eventId, va.volunteerComment, e.title AS eventTitle, e.startOn, e.duration, e.picture, e.type, r.name, t.name AS taskName  \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  LEFT JOIN room AS r ON r.id = e.roomId\
  WHERE eventId = ?; \
  "
  static updateRatingsForEvent = "\
  SELECT va.userId, et.taskId, et.eventId, va.organiserRating, e.title AS eventTitle, e.startOn, e.duration, e.picture, e.type, r.name, t.name AS taskName  \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  LEFT JOIN room AS r ON r.id = e.roomId\
  WHERE eventId = ? ANd taskId = ? AND userId = ?; \
  "
  static updateStatusForEvent = "\
  SELECT va.userId, et.taskId, et.eventId, va.status, e.title AS eventTitle, e.startOn, e.duration, e.picture, e.type, r.name, t.name AS taskName  \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  LEFT JOIN room AS r ON r.id = e.roomId\
  WHERE eventId = ? ANd taskId = ? AND userId = ?; \
  "
}

export class EventTaskQueries {
  static pastEventsInfoForOrganiserVolunteerCard = "\
  SELECT va.userId, et.taskId, et.eventId, e.title AS eventTitle, e.startOn, t.name AS taskName, va.organiserRating \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  WHERE ADDTIME(e.startOn, e.duration) < NOW() \
   AND va.userId = ?; \
  "
  
}
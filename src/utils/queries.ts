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
}
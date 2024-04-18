export class VolunteerAssignmentQueries {
  static pastEventsInfoForOrganiserVolunteerCard = "\
  SELECT va.userId, et.taskId, et.eventId, e.title AS eventTitle, e.startOn, t.name AS taskName, va.organiserRating \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  WHERE ADDTIME(e.startOn, e.duration) < NOW() \
  AND va.userId = ? \
  ;"


  static allPrimaryFields = "\
  SELECT va.*  \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  WHERE va.userId = ? AND et.eventId = ? AND et.taskId = ? \
  ;"


  static ratingsForEvent = "\
  SELECT va.userId, et.taskId, et.eventId, va.organiserRating, e.title AS eventTitle, e.startOn, e.duration, e.picture, e.type, r.name, t.name AS taskName  \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  LEFT JOIN room AS r ON r.id = e.roomId\
  WHERE eventId = ?; \
  "


  static associatedEventDateAndDuration = "\
  SELECT va.id, va.userId, et.eventId, et.taskId, e.startOn, e.duration, va.organiserRating  \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  WHERE va.userId = ? AND et.eventId = ? AND et.taskId = ? \
  ;"

  static commentsForEvent = "\
  SELECT va.userId, et.taskId, et.eventId, va.volunteerComment, e.title AS eventTitle, e.startOn, e.duration, e.picture, e.type, r.name, t.name AS taskName  \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  LEFT JOIN room AS r ON r.id = e.roomId\
  WHERE eventId = ?; \
  "


  //status 2 = accepted
  static finishedAssignmentsInfo = "\
  SELECT va.id, va.userId, va.status, et.eventId, et.taskId, e.title, e.description, e.startOn, e.duration, e.type, e.picture, t.name as taskName, va.volunteerComment, r.name AS roomName  \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  LEFT JOIN room AS r ON e.roomId = r.id \
  WHERE ADDTIME(e.startOn, e.duration) < NOW() \
  AND va.status = ? \
  AND va.userId = ? \
  ;"

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



  static assignmentForCommentUpdate = "\
  SELECT va.id, e.startOn, e.duration, va.status, va.volunteerComment \
  FROM volunteer_assignment AS va \
  LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  WHERE va.userId = ? AND et.eventId = ? AND et.taskId = ? \
  ;"

}

export class EventTaskQueries {
  static upcomingEventInfosForTaskApply = "\
  SELECT va.userId, et.taskId, et.eventId, \
    t.name AS taskName, va.id AS volunteerAssignmentId, et.nbVolunteersRequired, \
    va.status AS volunteerAssignmentStatus, e.startOn AS eventStartOn, \
    sub.countValidatedAssignment \
  FROM event_task AS et \
  LEFT JOIN volunteer_assignment AS va ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  LEFT JOIN (\
      SELECT et.taskId, et.eventId, COUNT(va.status) AS countValidatedAssignment \
      FROM volunteer_assignment AS va \
      LEFT JOIN event_task AS et ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
      WHERE va.status = ? \
      GROUP BY et.taskId, et.eventId\
  ) AS sub ON sub.taskId = et.taskId AND sub.eventId = et.eventId \
  WHERE et.eventId = ?  \
  ;"

  static upcomingEventInfosForTaskApplyV2 = "\
  SELECT va.userId, et.taskId, et.eventId, \
    t.name AS taskName, va.id AS volunteerAssignmentId, et.nbVolunteersRequired, \
    va.status AS volunteerAssignmentStatus, e.startOn AS eventStartOn, \
    sub.countValidatedAssignment \
  FROM event_task AS et \
  LEFT JOIN volunteer_assignment AS va ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  LEFT JOIN (\
    SELECT et.taskId, et.eventId, \
    COUNT(CASE va.status WHEN ? THEN 1 ELSE NULL END) AS countValidatedAssignment \
    FROM event_task AS et \
    LEFT JOIN volunteer_assignment AS va ON et.taskId = va.eventTaskTaskId AND et.eventId = va.eventTaskEventId \
    GROUP BY et.taskId, et.eventId;\
  ) AS sub ON sub.taskId = et.taskId AND sub.eventId = et.eventId \
  WHERE et.eventId = ?  \
  ;"


  static taskFromEvent = "\
  SELECT et.taskId, et.eventId, e.title AS eventTitle, e.description AS eventDescription, e.startOn, e.duration, e.picture, r.name, t.name AS taskName, et.progression, et.nbVolunteersRequired \
  FROM event_task AS et \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  LEFT JOIN room AS r ON r.id = e.roomId\
  WHERE eventId = ? ANd taskId = ?  ; \
  "

  static taskProgressionFromEvent = "\
  SELECT et.taskId, et.eventId, e.title AS eventTitle, e.description AS eventDescription, e.startOn, e.duration, e.picture, r.name, t.name AS taskName, et.progression \
  FROM event_task AS et \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  LEFT JOIN room AS r ON r.id = e.roomId\
  WHERE eventId = ? ANd taskId = ?  ; \
  "

  static taskRequiredVolunteersFromEvent = "\
  SELECT et.taskId, et.eventId, e.title AS eventTitle, e.description AS eventDescription, e.startOn, e.duration, e.picture, r.name, t.name AS taskName, et.nbVolunteersRequired \
  FROM event_task AS et \
  LEFT JOIN event AS e ON e.id = et.eventId \
  LEFT JOIN task AS t ON t.id = et.taskId \
  LEFT JOIN room AS r ON r.id = e.roomId\
  WHERE eventId = ? ANd taskId = ?  ; \
  "

}
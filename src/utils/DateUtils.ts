import { addHour, addMinute, addSecond } from "@formkit/tempo"

export class DateUtils {

  // duration is in format "hh:mm:ss"
  static addToDate(date: Date, duration: string) {
    const durationHoursMinsSecs = duration.split(':').map((str) => +str)
    date = addHour(date, durationHoursMinsSecs[0])
    date = addMinute(date, durationHoursMinsSecs[1])
    date = addSecond(date, durationHoursMinsSecs[2])
    return date
  }

  // format strDatetime: "2024-03-20T17:02:32.000Z"
  static getDateAndTime(strDatetime: string): { date: string, time: string } {
    const dateTimeSplit = strDatetime.split(/[T.]/)
    return { date: dateTimeSplit[0], time: dateTimeSplit[1] }
  }
}


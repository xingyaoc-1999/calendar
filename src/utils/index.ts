export function getAllDates(startDate: Date, endDate: Date) {
  let dates = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

export function getFullYearMonthAndDate(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate()
  }
}

class DateUtils {
  static formatDateToDayMonthYearTime(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be displayed as 12

    return `${day} ${month} ${year}, ${hours}:${minutes < 10 ? "0" : ""}${minutes}${ampm}`;
  }
}

export default DateUtils;

class StringUtils {
  static truncate(text: string, maxLength: number, ellipsis: string = '...'): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength - ellipsis.length) + ellipsis;
  }

  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  static isEmptyOrWhitespace(text: string): boolean {
    return !text || !text.trim();
  }
}

export default StringUtils;

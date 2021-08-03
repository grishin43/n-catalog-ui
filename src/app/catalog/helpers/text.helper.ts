export class TextHelper {

  public static declOfNum(count: number, words: string[]): string {
    count = Math.abs(count) % 100;
    const n1 = count % 10;
    if (count > 10 && count < 20) {
      return words[2];
    }
    if (n1 > 1 && n1 < 5) {
      return words[1];
    }
    if (n1 === 1) {
      return words[0];
    }
    return words[2];
  }

}

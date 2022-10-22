export class SizeTest {
  name: string;
  value: string;
  size: number;
  time?: number;
  scale5MB(): number {
    return Math.round(this.size / 1024 / 1024 / 5 * 10000) / 100;
  }
  private getMemorySize = (_string: string) => {
    var codePoint, accum = 0;

    for (var stringIndex = 0, endOfString = _string.length; stringIndex < endOfString; stringIndex++) {
      codePoint = _string.charCodeAt(stringIndex);

      if (codePoint < 0x100) {
        accum += 1;
        continue;
      }

      if (codePoint < 0x10000) {
        accum += 2;
        continue;
      }

      if (codePoint < 0x1000000) {
        accum += 3;
      } else {
        accum += 4;
      }
    }

    return accum;
  }
  log = () => {

    console.log(`${this.name}`, +Math.round(this.size / 1024).toString().padStart(5, ' '), `kb (${this.scale5MB().toString().padStart(3, ' ')}%) -`, Math.round(this.time), 'ms')
  }
  constructor(name: string, value: string, time?: number) {
    this.name = name;
    this.value = value;
    this.size = this.getMemorySize(value)
    this.time = time;
  }
}

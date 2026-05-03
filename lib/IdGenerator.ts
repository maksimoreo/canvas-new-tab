export default class IdGenerator {
  public current = 0

  public constructor(initial: number = 0) {
    this.current = initial
  }

  public next() {
    // current = 1
    // return 1
    // sets current = 2
    return this.current++
  }
}

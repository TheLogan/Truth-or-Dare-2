export class Vector2 {
  public constructor(init?: Partial<Vector2>) {
    Object.assign(this, init);
  }
  
  x!: number;
  y!: number;
}
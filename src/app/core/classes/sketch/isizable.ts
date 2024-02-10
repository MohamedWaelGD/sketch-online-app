export interface ISizableSketch {
  setSize(size: number): void;
}

export function isISizableSketch(obj: any): obj is ISizableSketch {
  return 'setSize' in obj && typeof obj.setSize === 'function';
}

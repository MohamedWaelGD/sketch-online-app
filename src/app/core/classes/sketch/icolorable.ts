export interface IColorableSketch {
  setColor(color: string): void;
}

export function isColorableSketch(obj: any): obj is IColorableSketch {
  return 'setColor' in obj && typeof obj.setColor === 'function';
}

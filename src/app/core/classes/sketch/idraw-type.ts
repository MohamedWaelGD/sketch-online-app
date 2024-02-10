import { DrawType } from "../../../pages/sketch-page/service/sketch.service";

export interface IDrawTypeSketch {
    setDrawType(drawType: DrawType): void;
  }
  
  export function isIDrawTypeSketch(obj: any): obj is IDrawTypeSketch {
    return 'setDrawType' in obj && typeof obj.setDrawType === 'function';
  }
  
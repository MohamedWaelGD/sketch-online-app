export interface IDestroy {
  destroyComponent(ctx: CanvasRenderingContext2D): void;
}

export function isIDestroy(obj: any): obj is IDestroy {
  return (
    'destroyComponent' in obj && typeof obj.destroyComponent === 'function'
  );
}

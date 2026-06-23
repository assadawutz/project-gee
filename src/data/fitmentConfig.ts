
export interface WheelPosition {
  x: number; // percentage from left
  y: number; // percentage from top
  scale: number; // base scale percentage relative to car image width
}

export interface CarFitmentConfig {
  frontWheel: WheelPosition;
  rearWheel: WheelPosition;
  shadowY: number; // vertical position for shadow layer
  bgImage?: string; // specific background if any
}

export const wheelMap: Record<string, CarFitmentConfig> = {
  v_civic_fe: {
    frontWheel: { x: 26.5, y: 66.8, scale: 21.5 },
    rearWheel: { x: 75.5, y: 66.8, scale: 21.5 },
    shadowY: 82,
  },
  v_revo: {
    frontWheel: { x: 28.5, y: 72.5, scale: 24 },
    rearWheel: { x: 73.5, y: 72.5, scale: 24 },
    shadowY: 88,
  },
  v_dmax: {
    frontWheel: { x: 28.5, y: 72.5, scale: 24 },
    rearWheel: { x: 73.5, y: 72.5, scale: 24 },
    shadowY: 88,
  },
  v_city_turbo: {
    frontWheel: { x: 27.5, y: 68.5, scale: 20 },
    rearWheel: { x: 74.5, y: 68.5, scale: 20 },
    shadowY: 84,
  },
  v_fortuner: {
    frontWheel: { x: 29.5, y: 71.0, scale: 25 },
    rearWheel: { x: 72.5, y: 71.0, scale: 25 },
    shadowY: 87,
  },
  v_corolla_cross: {
    frontWheel: { x: 29.0, y: 69.5, scale: 23 },
    rearWheel: { x: 73.0, y: 69.5, scale: 23 },
    shadowY: 85,
  },
};

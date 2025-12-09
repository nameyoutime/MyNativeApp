import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
// (e.g. iPhone 11 Pro is 375 x 812)
const GUIDELINE_BASE_WIDTH = 375;
// const GUIDELINE_BASE_HEIGHT = 812;

/**
 * Calculates a font size that scales with the screen width.
 * 
 * @param size The base font size to scale (based on 375px width design)
 * @returns The scaled font size
 */
export function responsiveFontSize(size: number): number {
  const scale = SCREEN_WIDTH / GUIDELINE_BASE_WIDTH;
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    // Sometimes android scales a bit too large, so we can subtract 1 or 2 pixels if needed,
    // but roundToNearestPixel is generally safe.
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}

/**
 * Helper to get width percentage
 * @param percentage string or number
 */
export function widthwp(percentage: number | string): number {
    const value = typeof percentage === "number" ? percentage : parseFloat(percentage);
    return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * value) / 100);
}

/**
 * Helper to get height percentage
 * @param percentage string or number
 */
export function heighthp(percentage: number | string): number {
    const value = typeof percentage === "number" ? percentage : parseFloat(percentage);
    return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * value) / 100);
}

import { useWindowDimensions, Platform } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isLandscape = width > height;

  // Base width for scaling (iPhone SE = 375, iPad = 768)
  const baseWidth = isTablet ? 768 : 375;

  const scaleFont = (size) => {
    const scaled = size * (width / baseWidth);
    return Math.min(scaled, size * 1.5); // optional cap
  };

  const scaleSpacing = (size) => {
    return size * (width / baseWidth);
  };

  return {
    width,
    height,
    isTablet,
    isLandscape,
    scaleFont,
    scaleSpacing,
  };
};
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { COLORS } from '../theme/theme';
import { OnboardStep } from '../data/data';

const common = {
  fill: 'none',
  stroke: COLORS.amber,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export default function OnboardIcon({ kind }: { kind: OnboardStep['icon'] }) {
  if (kind === 'pair') {
    return (
      <Svg width={34} height={34} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={3} {...common} />
        <Path d="M12 2v4M12 18v4M2 12h4M18 12h4" {...common} />
      </Svg>
    );
  }
  if (kind === 'rig') {
    return (
      <Svg width={34} height={34} viewBox="0 0 24 24">
        <Rect x={3} y={5} width={18} height={4} rx={1} {...common} />
        <Rect x={3} y={11} width={18} height={4} rx={1} {...common} />
        <Rect x={3} y={17} width={10} height={4} rx={1} {...common} />
      </Svg>
    );
  }
  if (kind === 'select') {
    return (
      <Svg width={34} height={34} viewBox="0 0 24 24">
        <Rect x={4} y={4} width={16} height={16} rx={4} {...common} />
        <Path d="M8 12l2.5 2.5L16 9" {...common} />
      </Svg>
    );
  }
  if (kind === 'dial') {
    return (
      <Svg width={34} height={34} viewBox="0 0 24 24">
        <Path d="M4 16a8 8 0 0 1 16 0" {...common} />
        <Path d="M12 16l4-5" {...common} />
        <Circle cx={12} cy={16} r={1.3} fill={COLORS.amber} stroke="none" />
      </Svg>
    );
  }
  if (kind === 'sync') {
    return (
      <Svg width={34} height={34} viewBox="0 0 24 24">
        <Path d="M3 12a9 9 0 0 1 15-6.7M21 12a9 9 0 0 1-15 6.7" {...common} />
        <Path d="M17 3v4h-4M7 21v-4h4" {...common} />
      </Svg>
    );
  }
  return (
    <Svg width={34} height={34} viewBox="0 0 24 24">
      <Path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" {...common} />
    </Svg>
  );
}

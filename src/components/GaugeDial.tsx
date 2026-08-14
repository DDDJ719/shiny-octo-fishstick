import React, { useRef } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { COLORS } from '../theme/theme';

const SIZE = 180;
const CENTER = 90;

function angleFor(value: number) {
  return -135 + (value / 100) * 270;
}

export default function GaugeDial({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const containerRef = useRef<React.ComponentRef<typeof View>>(null);
  const offset = useRef({ x: 0, y: 0 });

  const computeFromPage = (pageX: number, pageY: number) => {
    const x = pageX - offset.current.x;
    const y = pageY - offset.current.y;
    let deg = (Math.atan2(y - CENTER, x - CENTER) * 180) / Math.PI;
    deg = deg + 90;
    if (deg < 0) deg += 360;
    let rel = deg - 45;
    if (rel < 0) rel += 360;
    if (rel > 270) {
      rel = rel - 270 < 45 ? 270 : 0;
    }
    const v = Math.round(Math.max(0, Math.min(100, (rel / 270) * 100)));
    onChange(v);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        containerRef.current?.measureInWindow((x, y) => {
          offset.current = { x, y };
          computeFromPage(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        });
      },
      onPanResponderMove: (evt) => {
        computeFromPage(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
      },
    }),
  ).current;

  const angle = angleFor(value);
  const rad = (angle * Math.PI) / 180;
  const needleX = CENTER + 62 * Math.cos(rad);
  const needleY = CENTER + 62 * Math.sin(rad);

  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const tAngle = -135 + (i / 10) * 270;
    const tRad = (tAngle * Math.PI) / 180;
    const inner = 68;
    const outer = i % 5 === 0 ? 58 : 62;
    ticks.push(
      <Line
        key={i}
        x1={CENTER + inner * Math.cos(tRad)}
        y1={CENTER + inner * Math.sin(tRad)}
        x2={CENTER + outer * Math.cos(tRad)}
        y2={CENTER + outer * Math.sin(tRad)}
        stroke={i * 10 <= value ? COLORS.amber : COLORS.line}
        strokeWidth={i % 5 === 0 ? 2.5 : 1.5}
      />,
    );
  }

  return (
    <View
      ref={containerRef}
      style={{ width: SIZE, height: SIZE }}
      {...panResponder.panHandlers}
    >
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle cx={CENTER} cy={CENTER} r={76} fill={COLORS.panel2} stroke={COLORS.line} strokeWidth={1} />
        {ticks}
        <Line x1={CENTER} y1={CENTER} x2={needleX} y2={needleY} stroke={COLORS.amber} strokeWidth={3} strokeLinecap="round" />
        <Circle cx={CENTER} cy={CENTER} r={6} fill={COLORS.amber} />
      </Svg>
      <View style={styles.labelWrap} pointerEvents="none">
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.caption}>BRIGHTNESS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { fontSize: 26, fontWeight: '600', color: COLORS.text },
  caption: { fontSize: 9, letterSpacing: 2, color: COLORS.textDim, marginTop: 2 },
});

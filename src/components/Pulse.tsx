import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

export default function Pulse({
  active,
  style,
  children,
}: {
  active: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      opacity.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, opacity]);

  return <Animated.View style={[style, { opacity: active ? opacity : 1 }]}>{children}</Animated.View>;
}

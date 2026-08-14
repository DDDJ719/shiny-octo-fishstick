import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONT_MONO } from '../theme/theme';
import { ONBOARDING_STEPS } from '../data/data';
import OnboardIcon from '../components/OnboardIcon';

export default function OnboardingOverlay({
  step,
  setStep,
  onClose,
}: {
  step: number;
  setStep: (updater: (s: number) => number) => void;
  onClose: () => void;
}) {
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]}>
      <View style={styles.skipRow}>
        <Pressable onPress={onClose}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <OnboardIcon kind={current.icon} />
        </View>
        <Text style={styles.step}>
          STEP {step + 1} OF {ONBOARDING_STEPS.length}
        </Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.bodyText}>{current.body}</Text>
      </View>

      <View style={styles.dots}>
        {ONBOARDING_STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { width: i === step ? 16 : 6, backgroundColor: i === step ? COLORS.amber : COLORS.line },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonRow}>
        {step > 0 && (
          <Pressable onPress={() => setStep((s) => s - 1)} style={styles.backButton}>
            <Text style={styles.backButtonText}>BACK</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => (isLast ? onClose() : setStep((s) => s + 1))}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>{isLast ? 'GET STARTED' : 'NEXT'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: COLORS.bg, zIndex: 20 },
  skipRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 16 },
  skipText: { fontSize: 13, color: COLORS.textDim },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  step: { fontFamily: FONT_MONO, fontSize: 11, color: COLORS.amber, letterSpacing: 2, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 12 },
  bodyText: { fontSize: 14, lineHeight: 22, color: COLORS.textDim, textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingBottom: 20 },
  dot: { height: 6, borderRadius: 3 },
  buttonRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingBottom: 24 },
  backButton: { flex: 1, alignItems: 'center', padding: 13, borderRadius: 12, borderWidth: 1, borderColor: COLORS.line },
  backButtonText: { fontSize: 14, fontWeight: '700', color: COLORS.textDim, letterSpacing: 1 },
  nextButton: { flex: 2, alignItems: 'center', padding: 13, borderRadius: 12, backgroundColor: COLORS.amber },
  nextButtonText: { fontSize: 14, fontWeight: '700', color: '#1A1200', letterSpacing: 1 },
});

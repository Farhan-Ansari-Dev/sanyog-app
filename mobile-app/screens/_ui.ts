import { StyleSheet, Platform } from 'react-native';

export const colors = {
  primary: '#00E5FF', // Electric Blue accent
  bg: '#0A0A0E',      // Deep Dark background
  surface: '#15151D', // Elevated Card Dark
  text: '#FFFFFF',    // Primary Text
  muted: '#9CA3AF',   // Secondary Text
  border: '#2A2A35',  // Subtle border for cards
  danger: '#ff4444',  // Bright red for logout/errors
  accent: '#D4AF37',  // Gold/Amber accent
  placeholder: '#5C6078', // Placeholder text
} as const;

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 8, letterSpacing: 0.5 },
  label: { fontSize: 14, color: colors.muted, marginTop: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.surface,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.border,
    borderWidth: 1,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonText: { color: colors.text, fontWeight: '700', fontSize: 18, letterSpacing: 0.5 },
  link: { color: colors.primary, fontWeight: '600' },
  error: { color: colors.danger, marginTop: 10, fontWeight: '500' },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statValue: { fontSize: 36, fontWeight: '900', color: colors.accent, marginBottom: 4 },
  statLabel: { fontSize: 14, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600' },
});

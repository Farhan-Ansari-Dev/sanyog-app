import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { spacing, borderRadius, typography } from '../../theme';
import PrimaryButton from './PrimaryButton';

interface PermissionModalProps {
  visible: boolean;
  onAllow: () => void;
  onSkip: () => void;
}

export default function PermissionModal({ visible, onAllow, onSkip }: PermissionModalProps) {
  const t = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: t.primary + '15' }]}>
            <Ionicons name="shield-checkmark" size={40} color={t.primary} />
          </View>
          
          <Text style={[styles.title, { color: t.text }]}>Permissions Required</Text>
          <Text style={[styles.description, { color: t.textMuted }]}>
            Sanyog requires access to your camera and storage to help you upload certification documents seamlessly.
          </Text>

          <View style={styles.permissionList}>
            <View style={styles.permissionItem}>
              <Ionicons name="camera-outline" size={20} color={t.primary} />
              <Text style={[styles.permissionText, { color: t.text }]}>Camera for document scanning</Text>
            </View>
            <View style={styles.permissionItem}>
              <Ionicons name="folder-open-outline" size={20} color={t.primary} />
              <Text style={[styles.permissionText, { color: t.text }]}>Storage for file uploads</Text>
            </View>
            <View style={styles.permissionItem}>
              <Ionicons name="notifications-outline" size={20} color={t.primary} />
              <Text style={[styles.permissionText, { color: t.text }]}>Notifications for status updates</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <PrimaryButton 
              title="Grant Permissions" 
              onPress={onAllow} 
              size="lg"
              style={{ width: '100%' }}
            />
          </View>
          
          <Pressable onPress={onSkip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: t.textMuted }]}>Maybe Later</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  container: {
    width: '100%',
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  permissionList: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  permissionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    marginTop: spacing.lg,
    padding: spacing.xs,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  }
});

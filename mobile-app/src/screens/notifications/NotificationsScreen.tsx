/**
 * NotificationsScreen – Real-time alerts and updates
 */
import React, { useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import GlassCard from '../../components/common/GlassCard';
import { spacing, typography, borderRadius } from '../../theme';
import type { NotificationsStackParamList, Notification as NotifType } from '../../types';

const typeConfig: Record<NotifType['type'], { icon: keyof typeof Ionicons.glyphMap; colorKey: string }> = {
  info: { icon: 'information-circle', colorKey: 'info' },
  success: { icon: 'checkmark-circle', colorKey: 'success' },
  warning: { icon: 'alert-circle', colorKey: 'warning' },
  error: { icon: 'close-circle', colorKey: 'error' },
};

export default function NotificationsScreen({}: any) {
  const t = useTheme();
  const store = useAppStore();

  useEffect(() => {
    store.loadNotifications();
  }, []);

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const d = new Date(dateStr);
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 7) return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  const unread = store.notifications.filter((n) => !n.read);
  const read = store.notifications.filter((n) => n.read);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.xl }}>
          <View>
            <Text
              style={{
                fontSize: typography['3xl'],
                fontWeight: typography.black,
                color: t.text,
                letterSpacing: typography.tighter,
              }}
            >
              Notifications
            </Text>
            {store.unreadCount > 0 && (
              <Text style={{ fontSize: typography.sm, color: t.primary, marginTop: spacing.xs, fontWeight: typography.semiBold }}>
                {store.unreadCount} unread
              </Text>
            )}
          </View>
          {store.unreadCount > 0 && (
            <Pressable onPress={() => store.markAllAsRead()} hitSlop={8}>
              <Text style={{ fontSize: typography.sm, color: t.primary, fontWeight: typography.semiBold }}>
                Mark all read
              </Text>
            </Pressable>
          )}
        </View>

        {/* Unread */}
        {unread.length > 0 && (
          <>
            <Text
              style={{
                fontSize: typography.xs,
                fontWeight: typography.bold,
                color: t.textMuted,
                textTransform: 'uppercase',
                letterSpacing: typography.wider,
                marginBottom: spacing.md,
              }}
            >
              New
            </Text>
            {unread.map((notif) => {
              const cfg = typeConfig[notif.type];
              const color = (t as any)[cfg.colorKey] as string;
              const bgColor = (t as any)[`${cfg.colorKey}Bg`] as string;
              return (
                <Pressable
                  key={notif.id}
                  onPress={() => store.markAsRead(notif.id)}
                  style={({ pressed }) => ({
                    marginBottom: spacing.md,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <GlassCard style={{ borderLeftWidth: 3, borderLeftColor: color }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: bgColor,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: spacing.md,
                        }}
                      >
                        <Ionicons name={cfg.icon} size={18} color={color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: typography.sm, fontWeight: typography.bold, color: t.text, marginBottom: 4 }}>
                          {notif.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: typography.xs,
                            color: t.textSecondary,
                            lineHeight: typography.xs * typography.relaxed,
                          }}
                          numberOfLines={3}
                        >
                          {notif.message}
                        </Text>
                        <Text style={{ fontSize: typography.xs, color: t.textMuted, marginTop: spacing.sm }}>
                          {formatTimeAgo(notif.createdAt)}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: t.primary,
                          marginTop: 4,
                        }}
                      />
                    </View>
                  </GlassCard>
                </Pressable>
              );
            })}
          </>
        )}

        {/* Read */}
        {read.length > 0 && (
          <>
            <Text
              style={{
                fontSize: typography.xs,
                fontWeight: typography.bold,
                color: t.textMuted,
                textTransform: 'uppercase',
                letterSpacing: typography.wider,
                marginTop: spacing.lg,
                marginBottom: spacing.md,
              }}
            >
              Earlier
            </Text>
            {read.map((notif) => {
              const cfg = typeConfig[notif.type];
              const color = (t as any)[cfg.colorKey] as string;
              return (
                <GlassCard key={notif.id} style={{ marginBottom: spacing.sm, opacity: 0.75 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Ionicons name={cfg.icon} size={18} color={color} style={{ marginRight: spacing.md, marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: typography.sm, fontWeight: typography.semiBold, color: t.text, marginBottom: 2 }}>
                        {notif.title}
                      </Text>
                      <Text style={{ fontSize: typography.xs, color: t.textMuted }} numberOfLines={2}>
                        {notif.message}
                      </Text>
                      <Text style={{ fontSize: typography.xs, color: t.textMuted, marginTop: 4 }}>
                        {formatTimeAgo(notif.createdAt)}
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              );
            })}
          </>
        )}

        {/* Empty State */}
        {store.notifications.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: spacing['5xl'] }}>
            <Ionicons name="notifications-off-outline" size={48} color={t.textMuted} />
            <Text style={{ color: t.textMuted, fontSize: typography.base, marginTop: spacing.md }}>
              No notifications yet
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

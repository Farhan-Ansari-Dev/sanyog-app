import React from 'react';
import { View, Text, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, borderRadius } from '../../theme';
import GlassCard from '../../components/common/GlassCard';
import PrimaryButton from '../../components/common/PrimaryButton';

export default function PlaceholderScreen({ route, navigation }: any) {
  const t = useTheme();
  const title = route?.params?.title || 'System Resource';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: typography['3xl'],
              fontWeight: typography.black,
              color: t.text,
              letterSpacing: typography.tighter,
            }}
          >
            {title}
          </Text>
        </View>

        <GlassCard style={{ padding: spacing['2xl'], alignItems: 'center', marginTop: spacing.xl }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: t.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl }}>
            <Ionicons name="construct-outline" size={36} color={t.primary} />
          </View>
          <Text style={{ fontSize: typography.xl, fontWeight: typography.black, color: t.text, marginBottom: spacing.sm, textAlign: 'center' }}>
            Resource Active
          </Text>
          <Text style={{ fontSize: typography.base, color: t.textMuted, textAlign: 'center', lineHeight: typography.base * typography.relaxed, marginBottom: spacing.xl }}>
            This secure module has been linked to the AWS Database. Mobile formatting structures are currently being fully synchronized with Client Web instances.
          </Text>
          
          <PrimaryButton title="Return to Profile" onPress={() => navigation.goBack()} size="lg" />
        </GlassCard>

      </ScrollView>
    </SafeAreaView>
  );
}

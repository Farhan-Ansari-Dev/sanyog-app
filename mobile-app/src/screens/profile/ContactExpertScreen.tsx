/**
 * ContactExpertScreen – Expert contact form and info
 */
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import GlassCard from '../../components/common/GlassCard';
import PrimaryButton from '../../components/common/PrimaryButton';
import SectionHeader from '../../components/common/SectionHeader';
import { spacing, typography, borderRadius } from '../../theme';

export default function ContactExpertScreen() {
  const t = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
  };

  if (sent) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, justifyContent: 'center', alignItems: 'center', padding: spacing['2xl'] }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: t.successBg,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.xl,
          }}
        >
          <Ionicons name="checkmark-circle" size={40} color={t.success} />
        </View>
        <Text style={{ fontSize: typography['2xl'], fontWeight: typography.black, color: t.text, textAlign: 'center' }}>
          Message Sent!
        </Text>
        <Text style={{ fontSize: typography.sm, color: t.textMuted, textAlign: 'center', marginTop: spacing.md, lineHeight: typography.sm * typography.relaxed }}>
          Our certification experts will get back to you within 24 hours. Check your email for updates.
        </Text>
        <PrimaryButton title="Send Another" onPress={() => { setSent(false); setName(''); setEmail(''); setMessage(''); }} variant="outline" style={{ marginTop: spacing['2xl'] }} />
      </SafeAreaView>
    );
  }

  const directContacts = [
    { icon: 'call', label: 'Call Now', value: '+91 120 4567890', onPress: () => Linking.openURL('tel:+911204567890') },
    { icon: 'logo-whatsapp', label: 'WhatsApp', value: 'Message us', onPress: () => Linking.openURL('https://wa.me/911204567890') },
    { icon: 'mail', label: 'Email', value: 'info@sanyogconformity.com', onPress: () => Linking.openURL('mailto:info@sanyogconformity.com') },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['3xl'] }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontSize: typography['2xl'], fontWeight: typography.black, color: t.text, marginBottom: spacing.sm }}>
            Contact Expert
          </Text>
          <Text style={{ fontSize: typography.sm, color: t.textMuted, marginBottom: spacing.xl }}>
            Get personalized guidance from our certification specialists
          </Text>

          {/* Direct Contact Options */}
          <View style={{ flexDirection: 'row', marginBottom: spacing.xl }}>
            {directContacts.map((contact) => (
              <GlassCard key={contact.label} onPress={contact.onPress} style={{ flex: 1, padding: spacing.md, alignItems: 'center' }}>
                <Ionicons name={contact.icon as any} size={22} color={t.primary} style={{ marginBottom: spacing.sm }} />
                <Text style={{ fontSize: typography.xs, fontWeight: typography.semiBold, color: t.text }}>{contact.label}</Text>
              </GlassCard>
            ))}
          </View>

          {/* Contact Form */}
          <SectionHeader title="Send a Message" />
          {[
            { label: 'Name', value: name, setter: setName, placeholder: 'Your name' },
            { label: 'Email', value: email, setter: setEmail, placeholder: 'Your email', keyboardType: 'email-address' as const },
          ].map((field) => (
            <View key={field.label} style={{ marginBottom: spacing.base }}>
              <Text style={{ fontSize: typography.xs, fontWeight: typography.bold, color: t.textMuted, letterSpacing: typography.wider, textTransform: 'uppercase', marginBottom: spacing.xs }}>
                {field.label}
              </Text>
              <TextInput
                value={field.value}
                onChangeText={field.setter}
                placeholder={field.placeholder}
                placeholderTextColor={t.placeholder}
                keyboardType={field.keyboardType || 'default'}
                style={{
                  backgroundColor: t.inputBg,
                  borderRadius: borderRadius.md,
                  borderWidth: 1,
                  borderColor: t.border,
                  paddingHorizontal: spacing.base,
                  paddingVertical: 14,
                  fontSize: typography.base,
                  color: t.text,
                }}
              />
            </View>
          ))}

          <Text style={{ fontSize: typography.xs, fontWeight: typography.bold, color: t.textMuted, letterSpacing: typography.wider, textTransform: 'uppercase', marginBottom: spacing.xs }}>
            Message
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your certification needs..."
            placeholderTextColor={t.placeholder}
            multiline
            style={{
              backgroundColor: t.inputBg,
              borderRadius: borderRadius.md,
              borderWidth: 1,
              borderColor: t.border,
              paddingHorizontal: spacing.base,
              paddingVertical: spacing.md,
              fontSize: typography.base,
              color: t.text,
              minHeight: 120,
              textAlignVertical: 'top',
            }}
          />

          <PrimaryButton
            title="Send Message"
            onPress={handleSubmit}
            icon="paper-plane-outline"
            size="lg"
            style={{ marginTop: spacing.xl }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

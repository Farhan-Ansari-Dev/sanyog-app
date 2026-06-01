import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import PrimaryButton from '../../components/common/PrimaryButton';
import { spacing, typography, borderRadius } from '../../theme';

export default function EditProfileScreen() {
  const t = useTheme();
  const navigation = useNavigation();
  const user = useAppStore(s => s.user);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [company, setCompany] = useState(user?.company || '');

  const handleSave = () => {
    // In a real app, dispatch an update to the backend here
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { backgroundColor: t.surface, borderBottomColor: t.border }]}>
        <Ionicons name="arrow-back" size={24} color={t.text} onPress={() => navigation.goBack()} style={styles.backIcon} />
        <Text style={[styles.headerTitle, { color: t.text }]}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.avatarSection}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: t.primary + '20' }]}>
              <Text style={[styles.avatarInitial, { color: t.primary }]}>{name.charAt(0) || 'U'}</Text>
              <TouchableOpacity style={[styles.cameraBadge, { backgroundColor: t.primary, borderColor: t.surface }]}>
                <Ionicons name="camera" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.form, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: t.text }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: t.bg, color: t.text, borderColor: t.border }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={t.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: t.text }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: t.bg, color: t.text, borderColor: t.border }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor={t.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: t.text }]}>Phone Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: t.bg, color: t.text, borderColor: t.border }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Enter your phone"
                placeholderTextColor={t.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: t.text }]}>Company Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: t.bg, color: t.text, borderColor: t.border }]}
                value={company}
                onChangeText={setCompany}
                placeholder="Enter company name"
                placeholderTextColor={t.textMuted}
              />
            </View>

            <PrimaryButton 
              title="Save Changes" 
              onPress={handleSave} 
              style={styles.saveBtn}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backIcon: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    fontSize: typography.base,
  },
  saveBtn: {
    marginTop: spacing.sm,
  }
});

/**
 * ApplyScreen – Multi-step application form (3 steps)
 * Step 1: Company Details, Step 2: Product Info, Step 3: Review & Submit
 */
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import PrimaryButton from '../../components/common/PrimaryButton';
import GlassCard from '../../components/common/GlassCard';
import { spacing, typography, borderRadius, palette } from '../../theme';
import type { ServicesStackParamList, ApplicationFormData, Application } from '../../types';

const emptyForm: ApplicationFormData = {
  companyName: '',
  applicantName: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  gstNumber: '',
  productDescription: '',
  additionalNotes: '',
};

export default function ApplyScreen({ navigation, route }: any) {
  const t = useTheme();
  const addApplication = useAppStore((s) => s.addApplication);
  const { certId, certName } = route.params;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ApplicationFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({});

  const updateField = (key: keyof ApplicationFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateStep1 = () => {
    const errs: typeof errors = {};
    if (!form.companyName.trim()) errs.companyName = 'Required';
    if (!form.applicantName.trim()) errs.applicantName = 'Required';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.length < 10) errs.phone = 'Valid phone required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: typeof errors = {};
    if (!form.city.trim()) errs.city = 'Required';
    if (!form.productDescription.trim()) errs.productDescription = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const newApp: Application = {
        id: `app-${Date.now()}`,
        certId,
        certName,
        categoryName: 'Pending',
        companyName: form.companyName,
        applicantName: form.applicantName,
        email: form.email,
        status: 'submitted',
        statusHistory: [
          { status: 'submitted', date: new Date().toISOString(), note: 'Application submitted successfully' },
        ],
        documents: [],
        remarks: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addApplication(newApp);
      navigation.popToTop();
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    key: keyof ApplicationFormData,
    options?: { multiline?: boolean; keyboardType?: any; placeholder?: string }
  ) => (
    <View style={{ marginBottom: spacing.base }}>
      <Text
        style={{
          fontSize: typography.xs,
          fontWeight: typography.bold,
          color: t.textMuted,
          letterSpacing: typography.wider,
          textTransform: 'uppercase',
          marginBottom: spacing.xs,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={form[key]}
        onChangeText={(v) => updateField(key, v)}
        placeholder={options?.placeholder || `Enter ${label.toLowerCase()}`}
        placeholderTextColor={t.placeholder}
        keyboardType={options?.keyboardType || 'default'}
        multiline={options?.multiline}
        style={{
          backgroundColor: t.inputBg,
          borderRadius: borderRadius.md,
          borderWidth: 1,
          borderColor: errors[key] ? t.error : t.border,
          paddingHorizontal: spacing.base,
          paddingVertical: options?.multiline ? spacing.md : 14,
          fontSize: typography.base,
          color: t.text,
          minHeight: options?.multiline ? 100 : undefined,
          textAlignVertical: options?.multiline ? 'top' : 'center',
        }}
      />
      {errors[key] && (
        <Text style={{ color: t.error, fontSize: typography.xs, marginTop: 4 }}>{errors[key]}</Text>
      )}
    </View>
  );

  // ─── Progress Bar ───
  const renderProgress = () => (
    <View style={{ flexDirection: 'row', marginBottom: spacing['2xl'] }}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={{ flex: 1 }}>
          <View
            style={{
              height: 4,
              borderRadius: 2,
              backgroundColor: s <= step ? t.primary : t.border,
            }}
          />
          <Text
            style={{
              fontSize: typography.xs,
              color: s <= step ? t.primary : t.textMuted,
              marginTop: spacing.xs,
              fontWeight: s === step ? typography.bold : typography.regular,
            }}
          >
            {s === 1 ? 'Company' : s === 2 ? 'Product' : 'Review'}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing['3xl'] }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text
            style={{
              fontSize: typography.xl,
              fontWeight: typography.black,
              color: t.text,
              marginBottom: spacing.xs,
            }}
          >
            Apply: {certName}
          </Text>
          <Text style={{ fontSize: typography.sm, color: t.textMuted, marginBottom: spacing.xl }}>
            Step {step} of 3
          </Text>

          {renderProgress()}

          {/* Step 1: Company Details */}
          {step === 1 && (
            <>
              {renderInput('Company Name', 'companyName')}
              {renderInput('Applicant Name', 'applicantName')}
              {renderInput('Email Address', 'email', { keyboardType: 'email-address' })}
              {renderInput('Phone Number', 'phone', { keyboardType: 'phone-pad' })}
              <PrimaryButton title="Next: Product Details" onPress={handleNext} icon="arrow-forward-outline" iconPosition="right" size="lg" style={{ marginTop: spacing.md }} />
            </>
          )}

          {/* Step 2: Product Info */}
          {step === 2 && (
            <>
              {renderInput('City', 'city')}
              {renderInput('State', 'state')}
              {renderInput('GST Number', 'gstNumber', { placeholder: 'Optional' })}
              {renderInput('Product Description', 'productDescription', { multiline: true })}
              {renderInput('Additional Notes', 'additionalNotes', { multiline: true, placeholder: 'Optional' })}
              <View style={{ flexDirection: 'row', marginTop: spacing.md }}>
                <PrimaryButton title="Back" onPress={() => setStep(1)} variant="secondary" style={{ flex: 1 }} />
                <PrimaryButton title="Next: Review" onPress={handleNext} icon="arrow-forward-outline" iconPosition="right" style={{ flex: 2 }} />
              </View>
            </>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <>
              <GlassCard style={{ marginBottom: spacing.md }}>
                <Text style={{ fontSize: typography.sm, fontWeight: typography.bold, color: t.primary, marginBottom: spacing.md, textTransform: 'uppercase', letterSpacing: typography.wider }}>
                  Company Information
                </Text>
                {(['companyName', 'applicantName', 'email', 'phone'] as const).map((key) => (
                  <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                    <Text style={{ fontSize: typography.sm, color: t.textMuted, textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </Text>
                    <Text style={{ fontSize: typography.sm, color: t.text, fontWeight: typography.medium, maxWidth: '55%', textAlign: 'right' }} numberOfLines={1}>
                      {form[key] || '—'}
                    </Text>
                  </View>
                ))}
              </GlassCard>

              <GlassCard style={{ marginBottom: spacing.md }}>
                <Text style={{ fontSize: typography.sm, fontWeight: typography.bold, color: t.primary, marginBottom: spacing.md, textTransform: 'uppercase', letterSpacing: typography.wider }}>
                  Product Details
                </Text>
                {(['city', 'state', 'gstNumber', 'productDescription'] as const).map((key) => (
                  <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                    <Text style={{ fontSize: typography.sm, color: t.textMuted, textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </Text>
                    <Text style={{ fontSize: typography.sm, color: t.text, fontWeight: typography.medium, maxWidth: '55%', textAlign: 'right' }} numberOfLines={2}>
                      {form[key] || '—'}
                    </Text>
                  </View>
                ))}
              </GlassCard>

              <View style={{ flexDirection: 'row', marginTop: spacing.md }}>
                <PrimaryButton title="Back" onPress={() => setStep(2)} variant="secondary" style={{ flex: 1 }} />
                <PrimaryButton
                  title="Submit Application"
                  onPress={handleSubmit}
                  loading={loading}
                  icon="checkmark-circle-outline"
                  style={{ flex: 2 }}
                  size="lg"
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

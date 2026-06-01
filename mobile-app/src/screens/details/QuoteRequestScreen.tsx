import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import PrimaryButton from '../../components/common/PrimaryButton';
import { spacing, typography, borderRadius } from '../../theme';

export default function QuoteRequestScreen() {
  const t = useTheme();
  const navigation = useNavigation();
  
  const [productName, setProductName] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!productName) {
      Alert.alert('Required', 'Please enter the product name.');
      return;
    }
    
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Quote Requested',
        'Your quote request has been submitted successfully. Our team will contact you shortly.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { backgroundColor: t.surface, borderBottomColor: t.border }]}>
        <Ionicons name="arrow-back" size={24} color={t.text} onPress={() => navigation.goBack()} style={styles.backIcon} />
        <Text style={[styles.headerTitle, { color: t.text }]}>Request a Quote</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Text style={[styles.cardTitle, { color: t.text }]}>Product Details</Text>
          <Text style={[styles.cardSubtitle, { color: t.textSecondary }]}>
            Provide details about the product you need certified to get an accurate quote.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: t.text }]}>Product Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: t.bg, color: t.text, borderColor: t.border }]}
              placeholder="e.g., Wireless Earbuds"
              placeholderTextColor={t.textMuted}
              value={productName}
              onChangeText={setProductName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: t.text }]}>HSN Code (Optional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: t.bg, color: t.text, borderColor: t.border }]}
              placeholder="e.g., 85183000"
              placeholderTextColor={t.textMuted}
              value={hsnCode}
              onChangeText={setHsnCode}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: t.text }]}>Additional Requirements</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: t.bg, color: t.text, borderColor: t.border }]}
              placeholder="Any specific target markets or timeline?"
              placeholderTextColor={t.textMuted}
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <PrimaryButton
            title={submitting ? "Submitting..." : "Request Quote"}
            onPress={handleSubmit}
            disabled={submitting}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
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
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: typography.sm,
    marginBottom: spacing.xl,
    lineHeight: 20,
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
  textArea: {
    height: 100,
    paddingVertical: spacing.md,
  },
  submitBtn: {
    marginTop: spacing.md,
  }
});

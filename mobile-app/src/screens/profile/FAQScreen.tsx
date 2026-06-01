import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, borderRadius } from '../../theme';

const FAQS = [
  {
    question: "How long does BIS Certification take?",
    answer: "Typically, BIS Certification for electronics and IT goods takes about 30-45 working days, assuming all documentation is complete and testing proceeds without failures."
  },
  {
    question: "Do I need a local representative?",
    answer: "Yes, for foreign manufacturers, an Authorized Indian Representative (AIR) is mandatory. We provide AIR services as part of our comprehensive package."
  },
  {
    question: "What happens if my product fails testing?",
    answer: "If a sample fails, we will provide a detailed failure analysis report. You will need to rectify the design and resubmit an improved sample for re-testing."
  },
  {
    question: "Are your prices inclusive of government fees?",
    answer: "Our quotes clearly itemize government fees, lab testing charges, and our professional service fees so you have complete transparency."
  }
];

export default function FAQScreen() {
  const t = useTheme();
  const navigation = useNavigation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { backgroundColor: t.surface, borderBottomColor: t.border }]}>
        <Ionicons name="arrow-back" size={24} color={t.text} onPress={() => navigation.goBack()} style={styles.backIcon} />
        <Text style={[styles.headerTitle, { color: t.text }]}>Frequently Asked Questions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={t.textMuted} />
          <Text style={[styles.searchText, { color: t.textMuted }]}>Search FAQs...</Text>
        </View>

        {FAQS.map((faq, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.faqItem, { backgroundColor: t.surface, borderColor: t.border }]} 
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <View style={styles.questionRow}>
                <Text style={[styles.questionText, { color: isExpanded ? t.primary : t.text }]}>{faq.question}</Text>
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={isExpanded ? t.primary : t.textMuted} 
                />
              </View>
              {isExpanded && (
                <Text style={[styles.answerText, { color: t.textSecondary }]}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={[styles.supportCard, { backgroundColor: t.primary + '15', borderColor: t.primary + '30' }]}>
          <Ionicons name="chatbubbles-outline" size={32} color={t.primary} />
          <Text style={[styles.supportTitle, { color: t.primary }]}>Still have questions?</Text>
          <Text style={[styles.supportSubtitle, { color: t.textSecondary }]}>Our compliance experts are available 24/7 to assist you.</Text>
          <TouchableOpacity style={[styles.contactBtn, { backgroundColor: t.primary }]}>
            <Text style={styles.contactBtnText}>Contact Support</Text>
          </TouchableOpacity>
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.xl,
  },
  searchText: {
    marginLeft: spacing.sm,
    fontSize: typography.base,
  },
  faqItem: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: typography.base,
    fontWeight: '600',
    flex: 1,
    paddingRight: spacing.md,
  },
  answerText: {
    fontSize: typography.sm,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  supportCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  supportTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  supportSubtitle: {
    fontSize: typography.sm,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  contactBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  contactBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: typography.base,
  }
});

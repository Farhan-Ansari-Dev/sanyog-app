/**
 * StatusBadge – Colorful status indicators with icon + label
 */
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { borderRadius, spacing } from '../../theme';

interface Props {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  submitted: {
    label: 'Submitted',
    color: '#3B82F6',
    bg: '#3B82F6' + '15',
    icon: 'paper-plane',
  },
  under_review: {
    label: 'Under Review',
    color: '#F59E0B',
    bg: '#F59E0B' + '15',
    icon: 'time',
  },
  documents_required: {
    label: 'Docs Required',
    color: '#EF4444',
    bg: '#EF4444' + '15',
    icon: 'alert-circle',
  },
  document_verification: {
    label: 'Doc Verification',
    color: '#8B5CF6',
    bg: '#8B5CF6' + '15',
    icon: 'document-text',
  },
  expert_assigned: {
    label: 'Expert Assigned',
    color: '#06B6D4',
    bg: '#06B6D4' + '15',
    icon: 'person',
  },
  testing: {
    label: 'In Testing',
    color: '#F59E0B',
    bg: '#F59E0B' + '15',
    icon: 'flask',
  },
  approved: {
    label: 'Approved',
    color: '#10B981',
    bg: '#10B981' + '15',
    icon: 'checkmark-circle',
  },
  rejected: {
    label: 'Rejected',
    color: '#EF4444',
    bg: '#EF4444' + '15',
    icon: 'close-circle',
  },
};

export default function StatusBadge({ status, size = 'md' }: Props) {
  const t = useTheme();
  
  // Intelligent mapping for admin statuses
  const normalizedStatus = (status || "").toLowerCase();
  let key = status;
  
  if (normalizedStatus.includes('approved')) key = 'approved';
  else if (normalizedStatus.includes('rejected')) key = 'rejected';
  else if (normalizedStatus.includes('documents received')) key = 'submitted';
  else if (normalizedStatus.includes('under review')) key = 'under_review';
  else if (normalizedStatus.includes('query raised')) key = 'documents_required';

  const config = statusConfig[key] || {
    label: status.replace(/_/g, ' ').replace(/\//g, ' '),
    color: '#6B7280',
    bg: '#6B7280' + '15',
    icon: 'ellipse',
  };

  const sizes = {
    sm: { fontSize: 10, iconSize: 10, py: 4, px: 8 },
    md: { fontSize: 12, iconSize: 13, py: 5, px: 10 },
    lg: { fontSize: 13, iconSize: 15, py: 6, px: 12 },
  };

  const s = sizes[size];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: config.bg,
        paddingVertical: s.py,
        paddingHorizontal: s.px,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: config.color + '25',
      }}
    >
      <Ionicons
        name={config.icon as any}
        size={s.iconSize}
        color={config.color}
        style={{ marginRight: 4 }}
      />
      <Text
        style={{
          fontSize: s.fontSize,
          fontWeight: '700',
          color: config.color,
          letterSpacing: 0.2,
        }}
      >
        {config.label}
      </Text>
    </View>
  );
}

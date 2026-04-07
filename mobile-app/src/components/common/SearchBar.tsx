/**
 * SearchBar – Enhanced search input with native shadows and clear button
 */
import React from 'react';
import { View, TextInput, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { spacing, borderRadius, typography } from '../../theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Search...' }: Props) {
  const t = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: t.inputBg,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.base,
        marginHorizontal: spacing.lg,
        borderWidth: 1,
        borderColor: value ? t.primary + '40' : t.borderSubtle,
        elevation: 2,
        shadowColor: t.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      }}
    >
      <Ionicons name="search-outline" size={18} color={t.textMuted} style={{ marginRight: spacing.sm }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={t.placeholder}
        style={{
          flex: 1,
          fontSize: 15,
          color: t.text,
          fontWeight: '500',
          paddingVertical: Platform.OS === 'ios' ? 14 : 12,
        }}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: t.textMuted + '20',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="close" size={14} color={t.textMuted} />
          </View>
        </Pressable>
      )}
    </View>
  );
}

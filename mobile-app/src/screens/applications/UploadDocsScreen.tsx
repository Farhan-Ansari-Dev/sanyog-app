/**
 * UploadDocsScreen – Document upload interface
 */
import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import GlassCard from '../../components/common/GlassCard';
import PrimaryButton from '../../components/common/PrimaryButton';
import { spacing, typography, borderRadius } from '../../theme';

interface MockFile {
  id: string;
  name: string;
  size: string;
}

export default function UploadDocsScreen({ navigation }: any) {
  const t = useTheme();
  const [files, setFiles] = useState<MockFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickDocument = () => {
    // Mock file picker
    const mockFile: MockFile = {
      id: `file-${Date.now()}`,
      name: `Document_${files.length + 1}.pdf`,
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
    };
    setFiles((prev) => [...prev, mockFile]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setUploading(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: typography['2xl'],
            fontWeight: typography.black,
            color: t.text,
            letterSpacing: typography.tighter,
            marginBottom: spacing.sm,
          }}
        >
          Upload Documents
        </Text>
        <Text style={{ fontSize: typography.sm, color: t.textMuted, marginBottom: spacing.xl }}>
          Add supporting documents to your application
        </Text>

        {/* Drop Zone */}
        <Pressable
          onPress={pickDocument}
          style={({ pressed }) => ({
            borderWidth: 2,
            borderColor: t.primary + '40',
            borderStyle: 'dashed',
            borderRadius: borderRadius.xl,
            padding: spacing['2xl'],
            alignItems: 'center',
            backgroundColor: pressed ? t.primary + '08' : t.card,
            marginBottom: spacing.xl,
          })}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: t.primary + '15',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}
          >
            <Ionicons name="cloud-upload-outline" size={32} color={t.primary} />
          </View>
          <Text style={{ fontSize: typography.base, fontWeight: typography.bold, color: t.text, marginBottom: spacing.xs }}>
            Tap to Select Files
          </Text>
          <Text style={{ fontSize: typography.xs, color: t.textMuted, textAlign: 'center' }}>
            PDF, JPG, PNG • Max 10MB per file
          </Text>
        </Pressable>

        {/* Selected Files */}
        {files.length > 0 && (
          <>
            <Text
              style={{
                fontSize: typography.sm,
                fontWeight: typography.bold,
                color: t.textMuted,
                textTransform: 'uppercase',
                letterSpacing: typography.wider,
                marginBottom: spacing.md,
              }}
            >
              Selected Files ({files.length})
            </Text>
            {files.map((file) => (
              <GlassCard key={file.id} style={{ marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: borderRadius.md,
                      backgroundColor: t.successBg,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: spacing.md,
                    }}
                  >
                    <Ionicons name="document-text" size={20} color={t.success} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: typography.sm, color: t.text, fontWeight: typography.medium }}>
                      {file.name}
                    </Text>
                    <Text style={{ fontSize: typography.xs, color: t.textMuted, marginTop: 2 }}>{file.size}</Text>
                  </View>
                  <Pressable onPress={() => removeFile(file.id)} hitSlop={8}>
                    <Ionicons name="close-circle" size={22} color={t.error} />
                  </Pressable>
                </View>
              </GlassCard>
            ))}
          </>
        )}

        {/* Upload Button */}
        <PrimaryButton
          title={files.length === 0 ? 'Select Files First' : `Upload ${files.length} File${files.length > 1 ? 's' : ''}`}
          onPress={handleUpload}
          loading={uploading}
          disabled={files.length === 0}
          icon="cloud-upload"
          size="lg"
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

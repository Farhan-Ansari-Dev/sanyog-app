import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, borderRadius } from '../../theme';

export default function RoadmapWizardScreen({ navigation }: any) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  const [industry, setIndustry] = useState('');
  const [productType, setProductType] = useState('');
  const [markets, setMarkets] = useState<string[]>([]);

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      generateRoadmap();
    }
  };

  const generateRoadmap = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setRoadmap({
        title: `${productType} for Global Markets`,
        timeframe: '6-8 Weeks',
        certs: [
          { name: 'BIS CRS', desc: 'Required for Indian market entry', mandatory: true },
          { name: 'CE Mark', desc: 'Required for European economic area', mandatory: true },
          { name: 'RoHS', desc: 'Chemical compliance requirement', mandatory: false },
        ]
      });
    }, 2500); // simulate AI thinking
  };

  const OptionBtn = ({ label, selected, onPress, icon }: any) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: selected ? t.primary + '15' : t.card,
        borderWidth: 2,
        borderColor: selected ? t.primary : t.borderSubtle,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <Ionicons name={icon} size={24} color={selected ? t.primary : t.textMuted} style={{ marginRight: spacing.md }} />
      <Text style={{ fontSize: 16, fontWeight: '600', color: selected ? t.primary : t.text }}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: t.borderSubtle }}>
        <Text style={{ fontSize: 13, color: t.primary, fontWeight: '700', textTransform: 'uppercase' }}>
          {roadmap ? 'Your Roadmap' : `Step ${step} of 3`}
        </Text>
        <Text style={{ fontSize: 24, fontWeight: '800', color: t.text, marginTop: 4 }}>
          {roadmap ? 'Certification Plan Ready' : step === 1 ? "What's your industry?" : step === 2 ? "What are you building?" : "Target Markets?"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Animated.View style={{ opacity: fadeAnim }}>
          
          {!isGenerating && !roadmap && step === 1 && (
            <>
              <OptionBtn label="Consumer Electronics" icon="hardware-chip-outline" selected={industry === 'Consumer Electronics'} onPress={() => setIndustry('Consumer Electronics')} />
              <OptionBtn label="Medical Devices" icon="fitness-outline" selected={industry === 'Medical Devices'} onPress={() => setIndustry('Medical Devices')} />
              <OptionBtn label="Automotive" icon="car-outline" selected={industry === 'Automotive'} onPress={() => setIndustry('Automotive')} />
              <OptionBtn label="Toys & Children Products" icon="extension-puzzle-outline" selected={industry === 'Toys'} onPress={() => setIndustry('Toys')} />
            </>
          )}

          {!isGenerating && !roadmap && step === 2 && (
            <>
              <OptionBtn label="Smartphones / Tablets" icon="phone-portrait-outline" selected={productType === 'Smartphones / Tablets'} onPress={() => setProductType('Smartphones / Tablets')} />
              <OptionBtn label="Wearables" icon="watch-outline" selected={productType === 'Wearables'} onPress={() => setProductType('Wearables')} />
              <OptionBtn label="IoT Devices" icon="wifi-outline" selected={productType === 'IoT Devices'} onPress={() => setProductType('IoT Devices')} />
            </>
          )}

          {!isGenerating && !roadmap && step === 3 && (
            <>
              <OptionBtn label="India (BIS, WPC)" icon="location-outline" selected={markets.includes('India')} onPress={() => setMarkets(m => m.includes('India') ? m.filter(x => x !== 'India') : [...m, 'India'])} />
              <OptionBtn label="Europe (CE, RoHS)" icon="earth-outline" selected={markets.includes('Europe')} onPress={() => setMarkets(m => m.includes('Europe') ? m.filter(x => x !== 'Europe') : [...m, 'Europe'])} />
              <OptionBtn label="USA (FCC, FDA)" icon="flag-outline" selected={markets.includes('USA')} onPress={() => setMarkets(m => m.includes('USA') ? m.filter(x => x !== 'USA') : [...m, 'USA'])} />
            </>
          )}

          {isGenerating && (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
              <ActivityIndicator size="large" color={t.primary} />
              <Text style={{ marginTop: spacing.lg, fontSize: 16, color: t.textSecondary, fontWeight: '600' }}>
                Analyzing requirements across {markets.length} jurisdictions...
              </Text>
            </View>
          )}

          {roadmap && (
            <View>
              <View style={{ backgroundColor: t.primary + '15', padding: spacing.lg, borderRadius: borderRadius.lg, marginBottom: spacing.xl }}>
                <Text style={{ fontSize: 14, color: t.primary, fontWeight: '700' }}>ESTIMATED TIMEFRAME</Text>
                <Text style={{ fontSize: 28, color: t.primary, fontWeight: '900', marginTop: 4 }}>{roadmap.timeframe}</Text>
              </View>

              <Text style={{ fontSize: 18, fontWeight: '800', color: t.text, marginBottom: spacing.md }}>
                Required Certifications
              </Text>

              {roadmap.certs.map((cert: any, idx: number) => (
                <View key={idx} style={{ backgroundColor: t.card, padding: spacing.lg, borderRadius: borderRadius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: t.borderSubtle }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: '800', color: t.text }}>{cert.name}</Text>
                      <Text style={{ fontSize: 14, color: t.textMuted, marginTop: 4 }}>{cert.desc}</Text>
                    </View>
                    {cert.mandatory ? (
                      <View style={{ backgroundColor: '#EF444420', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                        <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: '700' }}>MANDATORY</Text>
                      </View>
                    ) : (
                      <View style={{ backgroundColor: '#10B98120', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                        <Text style={{ color: '#10B981', fontSize: 10, fontWeight: '700' }}>RECOMMENDED</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}

              <Pressable
                onPress={() => navigation.navigate('ServicesList')}
                style={{ backgroundColor: t.primary, padding: spacing.lg, borderRadius: borderRadius.lg, alignItems: 'center', marginTop: spacing.xl }}
              >
                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>View Service Catalog</Text>
              </Pressable>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {!isGenerating && !roadmap && (
        <View style={{ padding: spacing.lg, borderTopWidth: 1, borderTopColor: t.borderSubtle }}>
          <Pressable
            onPress={handleNext}
            disabled={
              (step === 1 && !industry) || 
              (step === 2 && !productType) || 
              (step === 3 && markets.length === 0)
            }
            style={({ pressed }) => {
              const isDisabled = (step === 1 && !industry) || 
                                 (step === 2 && !productType) || 
                                 (step === 3 && markets.length === 0);
              return {
                backgroundColor: isDisabled ? t.borderSubtle : t.primary,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                alignItems: 'center',
                opacity: pressed ? 0.9 : 1,
              };
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>
              {step === 3 ? 'Generate Roadmap' : 'Continue'}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

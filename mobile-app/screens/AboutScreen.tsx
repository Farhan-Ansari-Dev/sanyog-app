import React from 'react';
import { View, Text, Linking, Pressable } from 'react-native';

import { ui, colors } from './_ui';

export default function AboutScreen() {
  return (
    <View style={ui.screen}>
      <Text style={ui.title}>About Sanyog</Text>
      <Text style={{ color: colors.text, lineHeight: 22, fontSize: 15 }}>
        Where Accuracy Meets Assurance.{"\n\n"}
        Sanyog Conformity Solutions provides compliance and certification consultancy for domestic and global markets.
      </Text>

      <View style={[ui.card, { marginTop: 24 }]}>
        <Text style={[ui.statLabel, { marginBottom: 12 }]}>Contact Information</Text>
        
        <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 4 }}>Phone</Text>
        <Text style={{ color: colors.muted, marginBottom: 12 }}>+91 1206138010, +91 7897001049</Text>
        
        <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 4 }}>Email</Text>
        <Pressable onPress={() => Linking.openURL('mailto:info@sanyogconformity.com')}>
          <Text style={{ color: colors.primary, marginBottom: 12 }}>info@sanyogconformity.com</Text>
        </Pressable>
        
        <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 4 }}>Address</Text>
        <Text style={{ color: colors.muted, lineHeight: 20 }}>
          Urbtech Trade Centre, Tower IS-07, Office No. 702, 2nd Floor, Noida Sector 132, UP 201304
        </Text>
      </View>

      <View style={[ui.card, { marginTop: 16 }]}>
        <Text style={[ui.statLabel, { marginBottom: 8 }]}>Website</Text>
        <Pressable onPress={() => Linking.openURL('https://www.sanyogconformity.com')}>
          <Text style={{ color: colors.primary, fontSize: 15 }}>www.sanyogconformity.com</Text>
        </Pressable>
      </View>
    </View>
  );
}

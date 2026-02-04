import React from 'react';
import { View, Text } from 'react-native';

import { ui } from './_ui';

export default function AboutScreen() {
  return (
    <View style={ui.screen}>
      <Text style={ui.title}>About Sanyog</Text>
      <Text style={{ color: '#111827', lineHeight: 20 }}>
        Where Accuracy Meets Assurance.{"\n\n"}
        Sanyog Conformity Solutions provides compliance and certification consultancy for domestic and global markets.
      </Text>

      <Text style={{ marginTop: 16, fontWeight: '800' }}>Contact</Text>
      <Text style={{ marginTop: 6, color: '#6b7280' }}>Phone: +91 1206138010, +91 7897001049</Text>
      <Text style={{ marginTop: 6, color: '#6b7280' }}>Email: info@sanyogconformity.com</Text>
      <Text style={{ marginTop: 6, color: '#6b7280' }}>
        Address: Urbtech Trade Centre, Tower IS-07, Office No. 702, 2nd Floor, Noida Sector 132, UP 201304
      </Text>
    </View>
  );
}

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const CUBE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      overflow: hidden;
    }
    .scene {
      width: 180px;
      height: 180px;
      perspective: 800px;
    }
    .cube {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      animation: spinCube 10s linear infinite;
    }
    @keyframes spinCube {
      0%   { transform: rotateX(-20deg) rotateY(0deg); }
      100% { transform: rotateX(-20deg) rotateY(360deg); }
    }
    .face {
      position: absolute;
      width: 180px;
      height: 180px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(145deg, #ffffff 55%, #f5f8fb 100%);
      box-shadow:
        inset 0 0 15px rgba(255,255,255,0.7),
        inset 0 -4px 10px rgba(0,0,0,0.08),
        0 8px 20px rgba(0,0,0,0.12);
      border: 1px solid rgba(255,255,255,0.8);
    }
    .face-front  { transform: translateZ(90px); }
    .face-back   { transform: rotateY(180deg) translateZ(90px); }
    .face-right  { transform: rotateY(90deg)  translateZ(90px); }
    .face-left   { transform: rotateY(-90deg) translateZ(90px); }
    .face-top    { transform: rotateX(90deg)  translateZ(90px); }
    .face-bottom { transform: rotateX(-90deg) translateZ(90px); }
    
    .label {
      font-family: sans-serif;
      font-weight: 900;
      font-size: 24px;
      color: #1565c0;
      letter-spacing: 1px;
    }
    .sub {
      font-size: 8px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 4px;
    }
    svg { width: 80px; height: 80px; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="scene">
    <div class="cube">
      <!-- FRONT: ISO -->
      <div class="face face-front">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="42" stroke="#1565c0" stroke-width="3"/>
          <ellipse cx="50" cy="50" rx="20" ry="40" stroke="#1565c0" stroke-width="2.5"/>
          <line x1="8" y1="50" x2="92" y2="50" stroke="#1565c0" stroke-width="2"/>
        </svg>
        <span class="label">ISO</span>
      </div>
      <!-- BACK: CE -->
      <div class="face face-back">
        <span class="label" style="font-size: 48px;">CE</span>
        <span class="sub">European Conformity</span>
      </div>
      <!-- RIGHT: BIS -->
      <div class="face face-right">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 90,80 10,80" fill="#1565c0"/>
          <circle cx="50" cy="50" r="8" fill="white"/>
        </svg>
        <span class="label">BIS</span>
      </div>
      <!-- LEFT: FSSAI -->
      <div class="face face-left">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 40 L32 60 L68 20" stroke="#2e7d32" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="label" style="color: #2e7d32;">FSSAI</span>
      </div>
      <!-- TOP: SABER -->
      <div class="face face-top">
        <span class="label" style="color: #2e7d32;">SABER</span>
        <span class="sub">Saudi Certification</span>
      </div>
      <!-- BOTTOM: WPL -->
      <div class="face face-bottom">
        <span class="label" style="color: #43a047;">WPL</span>
        <span class="sub">Worldwide Logistics</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

export default function CertificationDice() {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: CUBE_HTML }}
        style={styles.webview}
        scrollEnabled={false}
        backgroundColor="transparent"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { responsiveFontSize } from '../utils/responsive';

interface UserScoreCircleProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
}

const UserScoreCircle: React.FC<UserScoreCircleProps> = ({
  score,
  size = 40,
  strokeWidth = 3,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Determine colors based on score (TMDB style)
  let barColor = '#21d07a'; // Green
  let trackColor = '#204529'; // Dark Green

  if (score < 40) {
    barColor = '#db2360'; // Red
    trackColor = '#571435'; // Dark Red
  } else if (score < 70) {
    barColor = '#d2d531'; // Yellow
    trackColor = '#423d0f'; // Dark Yellow
  }

  // If score is 0, we might want grey? But let's stick to these for now.

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle Fill */}
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="#081c22" />

        {/* Track Circle */}
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={barColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
      </Svg>

      {/* Percentage Text Overlay */}
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.textContainer}>
          {score > 0 ? (
            <View style={styles.scoreRow}>
              <Text
                style={[
                  styles.scoreText,
                  { fontSize: responsiveFontSize(size * 0.34) },
                ]}
              >
                {score}
              </Text>
              <Text
                style={[
                  styles.percentText,
                  { fontSize: responsiveFontSize(size * 0.18) },
                ]}
              >
                %
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.scoreText,
                { fontSize: responsiveFontSize(size * 0.34) },
              ]}
            >
              NR
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Top align for superscript effect
    paddingTop: 2, // Slight adjustment if needed
  },
  scoreText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  percentText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 1,
  },
});

export default UserScoreCircle;

import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import AmazingGiggleLandLayout from '../StoryComponents/AmazingGiggleLandLayout';
import { useStore } from '../[QuestStore]/amazingGiggleQuestContext';

const { height } = Dimensions.get('window');

export default function AmazingStoryQuestMasks() {
  const giggleLandStoryFloat = useRef(new Animated.Value(0)).current;
  const giggleLandStoryTilt = useRef(new Animated.Value(0)).current;
  const giggleLandQuizFloat = useRef(new Animated.Value(0)).current;
  const giggleLandQuizTilt = useRef(new Animated.Value(0)).current;

  const {
    giggleLandStoryScore,
    setGiggleLandStoryScore,
    giggleLandQuizScore,
    setGiggleLandQuizScore,
  } = useStore();

  useFocusEffect(
    useCallback(() => {
      giggleLandLoadProgress();
    }, []),
  );

  const giggleLandLoadProgress = async () => {
    const giggleLandStorySaved = await AsyncStorage.getItem(
      'GiggleStoriesMoodScore',
    );
    const giggleLandQuizSaved = await AsyncStorage.getItem(
      'GiggleQuizBestScore',
    );

    if (giggleLandStorySaved)
      setGiggleLandStoryScore(Number(giggleLandStorySaved));
    if (giggleLandQuizSaved)
      setGiggleLandQuizScore(Number(giggleLandQuizSaved));
  };

  const giggleLandGetStoryMask = () => {
    if (giggleLandStoryScore <= 8)
      return require('../../assets/amazonStoryQuestImages/gigglelandstorymask1.png');
    if (giggleLandStoryScore <= 18)
      return require('../../assets/amazonStoryQuestImages/gigglelandstorymask2.png');
    if (giggleLandStoryScore <= 25)
      return require('../../assets/amazonStoryQuestImages/gigglelandstorymask3.png');
    return require('../../assets/amazonStoryQuestImages/gigglelandstorymask4.png');
  };

  const giggleLandGetQuizMask = () => {
    if (giggleLandQuizScore <= 5)
      return require('../../assets/amazonStoryQuestImages/gigglelandquizmask1.png');
    if (giggleLandQuizScore <= 12)
      return require('../../assets/amazonStoryQuestImages/gigglelandquizmask2.png');
    if (giggleLandQuizScore <= 16)
      return require('../../assets/amazonStoryQuestImages/gigglelandquizmask3.png');
    return require('../../assets/amazonStoryQuestImages/gigglelandquizmask4.png');
  };

  useEffect(() => {
    const giggleLandStoryAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(giggleLandStoryFloat, {
            toValue: -8,
            duration: 780,
            useNativeDriver: true,
          }),
          Animated.timing(giggleLandStoryTilt, {
            toValue: 1,
            duration: 780,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(giggleLandStoryFloat, {
            toValue: 0,
            duration: 820,
            useNativeDriver: true,
          }),
          Animated.timing(giggleLandStoryTilt, {
            toValue: 0,
            duration: 820,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1700),
      ]),
    );

    const giggleLandQuizAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(1200),
        Animated.parallel([
          Animated.timing(giggleLandQuizFloat, {
            toValue: -10,
            duration: 860,
            useNativeDriver: true,
          }),
          Animated.timing(giggleLandQuizTilt, {
            toValue: 1,
            duration: 860,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(giggleLandQuizFloat, {
            toValue: 0,
            duration: 930,
            useNativeDriver: true,
          }),
          Animated.timing(giggleLandQuizTilt, {
            toValue: 0,
            duration: 930,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1300),
      ]),
    );

    giggleLandStoryAnimation.start();
    giggleLandQuizAnimation.start();

    return () => {
      giggleLandStoryAnimation.stop();
      giggleLandQuizAnimation.stop();
    };
  }, [
    giggleLandStoryFloat,
    giggleLandStoryTilt,
    giggleLandQuizFloat,
    giggleLandQuizTilt,
  ]);

  const giggleLandStoryRotate = giggleLandStoryTilt.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '4deg'],
  });

  const giggleLandQuizRotate = giggleLandQuizTilt.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-4deg'],
  });

  return (
    <AmazingGiggleLandLayout>
      <View style={styles.giggleLandContainer}>
        <View style={styles.giggleLandBlock}>
          <Animated.View
            style={{
              transform: [
                { translateY: giggleLandStoryFloat },
                { rotate: giggleLandStoryRotate },
              ],
            }}
          >
            <Image
              source={giggleLandGetStoryMask()}
              style={styles.giggleLandMaskImage}
            />
          </Animated.View>
          <Text style={styles.giggleLandMaskLabel}>Story Mood Mask</Text>
          <Text style={styles.giggleLandScoreText}>
            {giggleLandStoryScore}/{30}
          </Text>
        </View>

        <View style={styles.giggleLandBlock}>
          <Animated.View
            style={{
              transform: [
                { translateY: giggleLandQuizFloat },
                { rotate: giggleLandQuizRotate },
              ],
            }}
          >
            <Image
              source={giggleLandGetQuizMask()}
              style={styles.giggleLandMaskImage}
            />
          </Animated.View>
          <Text style={styles.giggleLandMaskLabel}>Quiz Wisdom Mask</Text>
          <Text style={styles.giggleLandScoreText}>
            {giggleLandQuizScore}/{20}
          </Text>
        </View>
      </View>
    </AmazingGiggleLandLayout>
  );
}

const styles = StyleSheet.create({
  giggleLandContainer: {
    flex: 1,
    paddingTop: height * 0.09,
    alignItems: 'center',
    paddingBottom: 130,
  },
  giggleLandBlock: {
    alignItems: 'center',
    marginBottom: 50,
  },
  giggleLandMaskLabel: {
    fontSize: 22,
    marginTop: 10,
    color: '#1B1B1B',
    fontWeight: '700',
  },
  giggleLandScoreText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1B1B1B',
    marginTop: 4,
  },
  giggleLandMaskImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
});

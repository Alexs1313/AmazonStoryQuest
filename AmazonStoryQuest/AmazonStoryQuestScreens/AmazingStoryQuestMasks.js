import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import AmazingGiggleLandLayout from '../AmazonStoryQuestComponents/AmazingGiggleLandLayout';
import { useStore } from '../AmazonStoryQuestStore/amazingGiggleQuestContext';

const { height } = Dimensions.get('window');

export default function AmazingStoryQuestMasks() {
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

  return (
    <AmazingGiggleLandLayout>
      <View style={styles.giggleLandContainer}>
        <View style={styles.giggleLandBlock}>
          <Image
            source={giggleLandGetStoryMask()}
            style={styles.giggleLandMaskImage}
          />
          <Text style={styles.giggleLandMaskLabel}>Story Mood Mask</Text>
          <Text style={styles.giggleLandScoreText}>
            {giggleLandStoryScore}/{30}
          </Text>
        </View>

        <View style={styles.giggleLandBlock}>
          <Image
            source={giggleLandGetQuizMask()}
            style={styles.giggleLandMaskImage}
          />
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

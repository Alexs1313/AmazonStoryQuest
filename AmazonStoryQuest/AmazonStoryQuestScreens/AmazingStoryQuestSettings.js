import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import AmazingGiggleLandLayout from '../AmazonStoryQuestComponents/AmazingGiggleLandLayout';
import { useStore } from '../AmazonStoryQuestStore/amazingGiggleQuestContext';

export default function AmazingStoryQuestSettings() {
  const [giggleLandDialog, setGiggleLandDialog] = useState(null);
  const {
    isOnGiggleLandVibration,
    setIsOnGiggleLandVibration,
    isOnGiggleLandSound,
    setIsOnGiggleLandSound,
    setGiggleLandFavorites,
    setGiggleLandRatings,
    setGiggleLandStoryScore,
    setGiggleLandQuizScore,
  } = useStore();

  const giggleLandToggleVibration = async value => {
    try {
      await AsyncStorage.setItem('gigglelandvibration', JSON.stringify(value));
      setIsOnGiggleLandVibration(value);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const giggleLandToggleSound = async value => {
    try {
      await AsyncStorage.setItem('gigglelandsound', JSON.stringify(value));
      setIsOnGiggleLandSound(value);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const giggleLandClearFavorites = async () => {
    await AsyncStorage.removeItem('GiggleFavorites');
    await AsyncStorage.removeItem('GiggleRatings');
    await AsyncStorage.removeItem('GiggleStoriesMoodScore');
    setGiggleLandDialog(null);
    setGiggleLandFavorites([]);
  };

  const giggleLandResetProgress = async () => {
    await AsyncStorage.removeItem('GiggleQuizBestScore');
    await AsyncStorage.removeItem('GiggleStoriesMoodScore');
    await AsyncStorage.removeItem('GiggleRatings');
    setGiggleLandRatings({});
    setGiggleLandQuizScore(0);
    setGiggleLandStoryScore(0);
    setGiggleLandDialog(null);
  };

  return (
    <AmazingGiggleLandLayout>
      <View style={styles.giggleLandContainer}>
        <ImageBackground
          source={require('../../assets/amazonStoryQuestImages/gigglelandsettboard.png')}
          style={styles.giggleLandBoard}
        >
          <Text style={styles.giggleLandTitle}>Settings</Text>

          {Platform.OS === 'ios' && (
            <View style={styles.giggleLandRow}>
              <Text style={styles.giggleLandItemText}>Sounds</Text>
              <TouchableOpacity
                onPress={() => giggleLandToggleSound(!isOnGiggleLandSound)}
                activeOpacity={0.8}
              >
                <Image
                  source={
                    isOnGiggleLandSound
                      ? require('../../assets/amazonStoryQuestImages/gigglelandsetton.png')
                      : require('../../assets/amazonStoryQuestImages/gigglelandsettoff.png')
                  }
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.giggleLandRow}>
            <Text style={styles.giggleLandItemText}>Vibration</Text>
            <TouchableOpacity
              onPress={() =>
                giggleLandToggleVibration(!isOnGiggleLandVibration)
              }
              activeOpacity={0.8}
            >
              <Image
                source={
                  isOnGiggleLandVibration
                    ? require('../../assets/amazonStoryQuestImages/gigglelandsetton.png')
                    : require('../../assets/amazonStoryQuestImages/gigglelandsettoff.png')
                }
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setGiggleLandDialog('reset')}
            style={styles.giggleLandRow}
            activeOpacity={0.7}
          >
            <Text style={styles.giggleLandItemText}>Reset Progress</Text>
            <Image
              source={require('../../assets/amazonStoryQuestImages/gigglelandreset.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setGiggleLandDialog('fav')}
            style={styles.giggleLandRow}
            activeOpacity={0.7}
          >
            <Text style={styles.giggleLandItemText}>Clear Favorite</Text>
            <Image
              source={require('../../assets/amazonStoryQuestImages/gigglelandclear.png')}
              style={{ tintColor: '#fff' }}
            />
          </TouchableOpacity>
        </ImageBackground>

        {giggleLandDialog && (
          <View style={styles.giggleLandOverlay}>
            <ImageBackground
              source={require('../../assets/amazonStoryQuestImages/gigglelandmodalbox2.png')}
              style={styles.giggleLandDialog}
            >
              <Text style={styles.giggleLandDialogText}>
                {giggleLandDialog === 'fav'
                  ? 'Clear favorites?\nAre you sure?'
                  : 'Are you sure you want to\nreset your progress?'}
              </Text>
            </ImageBackground>

            <View style={styles.giggleLandDialogBtns}>
              <TouchableOpacity onPress={() => setGiggleLandDialog(null)}>
                <Image
                  source={require('../../assets/amazonStoryQuestImages/storydetailsclose.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={
                  giggleLandDialog === 'fav'
                    ? giggleLandClearFavorites
                    : giggleLandResetProgress
                }
              >
                <Image
                  source={require('../../assets/amazonStoryQuestImages/gigglelandyes.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </AmazingGiggleLandLayout>
  );
}

const styles = StyleSheet.create({
  giggleLandContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 130,
  },
  giggleLandBoard: {
    width: 374,
    paddingTop: 40,
    height: 512,
    paddingHorizontal: 60,
    paddingBottom: 40,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  giggleLandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 35,
  },
  giggleLandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  giggleLandItemText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  giggleLandOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  giggleLandDialog: {
    width: 360,
    height: 182,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  giggleLandDialogText: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    color: '#fff',
  },
  giggleLandDialogBtns: {
    flexDirection: 'row',
    gap: 60,
    marginTop: 40,
  },
});

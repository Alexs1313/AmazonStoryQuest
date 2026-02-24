import AsyncStorage from '@react-native-async-storage/async-storage';
import AmazingGiggleLandLayout from '../StoryComponents/AmazingGiggleLandLayout';

import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Vibration,
} from 'react-native';
import { giggleLandQuizData } from '../../giggleLandQuizData';
import { useStore } from '../[QuestStore]/amazingGiggleQuestContext';

const { height } = Dimensions.get('window');

const GiggleLandAnimatedPressable = ({
  onPress,
  disabled = false,
  children,
  style,
}) => {
  const giggleLandScale = useRef(new Animated.Value(1)).current;

  const giggleLandPressIn = () => {
    Animated.spring(giggleLandScale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 35,
      bounciness: 4,
    }).start();
  };

  const giggleLandPressOut = () => {
    Animated.spring(giggleLandScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 35,
      bounciness: 4,
    }).start();
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={giggleLandPressIn}
      onPressOut={giggleLandPressOut}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale: giggleLandScale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default function AmazingStoryQuestQuiz() {
  const [giggleLandScreen, setGiggleLandScreen] = useState('intro');
  const [giggleLandIndex, setGiggleLandIndex] = useState(0);
  const [giggleLandSelected, setGiggleLandSelected] = useState(null);
  const [giggleLandConfirmed, setGiggleLandConfirmed] = useState(false);
  const [giggleLandScore, setGiggleLandScore] = useState(0);
  const [giggleLandBestScore, setGiggleLandBestScore] = useState(0);
  const [giggleLandExitDialog, setGiggleLandExitDialog] = useState(false);
  const [giggleLandShowConfetti, setGiggleLandShowConfetti] = useState(false);
  const [giggleLandShowFinalConfetti, setGiggleLandShowFinalConfetti] =
    useState(false);
  const {
    isOnGiggleLandVibration,
    isOnGiggleLandSound,
    GiggleLandSound,
    GiggleLandBadSound,
    GiggleLandNeutralSound,
    GiggleLandWinSound,
  } = useStore();

  useEffect(() => {
    giggleLandLoadBest();
  }, []);

  const giggleLandLoadBest = async () => {
    const giggleLandSavedBest = await AsyncStorage.getItem(
      'GiggleQuizBestScore',
    );
    if (giggleLandSavedBest) {
      setGiggleLandBestScore(Number(giggleLandSavedBest));
    }
  };

  const giggleLandSaveBest = async giggleLandNewScore => {
    if (giggleLandNewScore > giggleLandBestScore) {
      setGiggleLandBestScore(giggleLandNewScore);
      await AsyncStorage.setItem(
        'GiggleQuizBestScore',
        String(giggleLandNewScore),
      );
    }
  };

  const giggleLandStartQuiz = () => {
    setGiggleLandScreen('quiz');
    setGiggleLandIndex(0);
    setGiggleLandScore(0);
    setGiggleLandSelected(null);
    setGiggleLandConfirmed(false);
  };

  useEffect(() => {
    if (giggleLandScreen === 'result' && giggleLandScore >= 11) {
      setGiggleLandShowFinalConfetti(true);
      setTimeout(() => setGiggleLandShowFinalConfetti(false), 3800);
    }
  }, [giggleLandScreen]);

  const giggleLandConfirmAnswer = () => {
    if (giggleLandSelected === null) return;

    const giggleLandEarned =
      giggleLandQuizData[giggleLandIndex].a[giggleLandSelected].points;
    const giggleLandTotal = giggleLandScore + giggleLandEarned;

    if (isOnGiggleLandSound) {
      if (giggleLandEarned === 2) {
        GiggleLandWinSound();
      } else if (giggleLandEarned === 1) {
        GiggleLandNeutralSound();
      } else {
        GiggleLandBadSound();
      }
    }

    if (giggleLandEarned >= 1) {
      setGiggleLandShowConfetti(true);
      setTimeout(() => setGiggleLandShowConfetti(false), 2000);
    }

    if (giggleLandEarned === 0 && isOnGiggleLandVibration) {
      Vibration.vibrate(120);
    }

    setGiggleLandScore(giggleLandTotal);
    setGiggleLandConfirmed(true);

    setTimeout(() => {
      if (giggleLandIndex === giggleLandQuizData.length - 1) {
        giggleLandSaveBest(giggleLandTotal);

        if (giggleLandTotal > giggleLandBestScore) {
          setGiggleLandBestScore(giggleLandTotal);
        }

        setGiggleLandScreen('result');

        if (isOnGiggleLandSound && giggleLandTotal >= 11) {
          GiggleLandSound();
        }
      } else {
        setGiggleLandIndex(giggleLandIndex + 1);
        setGiggleLandSelected(null);
        setGiggleLandConfirmed(false);
      }
    }, 1200);
  };

  const giggleLandExitQuiz = () => {
    setGiggleLandExitDialog(false);
    setGiggleLandScreen('intro');
  };

  if (giggleLandScreen === 'intro') {
    return (
      <AmazingGiggleLandLayout>
        <View style={styles.giggleLandCenter}>
          <ImageBackground
            source={require('../../assets/amazonStoryQuestImages/storyquizintr.png')}
            style={styles.giggleLandIntroBox}
          >
            <Text style={styles.giggleLandTitle}>
              Welcome to the Joke Quiz!
            </Text>
            <Text style={styles.giggleLandIntroText}>
              {`Each question gives you an unfinished joke — and your task is to pick the funniest ending. Choose wisely: some answers make no sense, some are mildly funny, and one is truly brilliant. Let’s see how your humor score turns out!`}
            </Text>
          </ImageBackground>

          <TouchableOpacity onPress={giggleLandStartQuiz} activeOpacity={0.7}>
            <Image
              source={require('../../assets/amazonStoryQuestImages/gigglelandnext.png')}
            />
          </TouchableOpacity>
        </View>
      </AmazingGiggleLandLayout>
    );
  }

  if (giggleLandScreen === 'quiz') {
    const giggleLandCurrentQuestion = giggleLandQuizData[giggleLandIndex];

    return (
      <AmazingGiggleLandLayout>
        {giggleLandExitDialog && (
          <View style={styles.giggleLandDialogOverlay}>
            <ImageBackground
              source={require('../../assets/amazonStoryQuestImages/storyquizmodal.png')}
              style={styles.giggleLandDialogBox}
            >
              <Text style={styles.giggleLandDialogText}>
                Progress will be lost. Exit?
              </Text>

              <View style={styles.giggleLandDialogButtons}>
                <TouchableOpacity
                  onPress={() => setGiggleLandExitDialog(false)}
                >
                  <Image
                    source={require('../../assets/amazonStoryQuestImages/storydetailsclose.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={giggleLandExitQuiz}>
                  <Image
                    source={require('../../assets/amazonStoryQuestImages/gigglelandyes.png')}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        )}

        <ImageBackground
          source={require('../../assets/amazonStoryQuestImages/gigglelandquest.png')}
          style={styles.giggleLandQuestionBox}
        >
          <Text style={styles.giggleLandQuestion}>
            {giggleLandCurrentQuestion.q}
          </Text>
          <View style={styles.giggleLandPaginationRow}>
            {giggleLandQuizData.map((_, giggleLandDotIndex) => (
              <View
                key={giggleLandDotIndex}
                style={[
                  styles.giggleLandDot,
                  giggleLandDotIndex <= giggleLandIndex
                    ? styles.giggleLandDotActive
                    : styles.giggleLandDotInactive,
                ]}
              />
            ))}
          </View>
        </ImageBackground>

        <View>
          {giggleLandCurrentQuestion.a.map(
            (giggleLandOption, giggleLandOptIdx) => {
              const giggleLandIsSelected =
                giggleLandSelected === giggleLandOptIdx;

              let giggleLandBg = require('../../assets/amazonStoryQuestImages/gigglelandoptionnorm.png');

              if (giggleLandConfirmed && giggleLandIsSelected) {
                if (giggleLandOption.points === 2) {
                  giggleLandBg = require('../../assets/amazonStoryQuestImages/gigglelandoptioncorr.png');
                } else if (giggleLandOption.points === 1) {
                  giggleLandBg = require('../../assets/amazonStoryQuestImages/gigglelandoptionmed.png');
                } else {
                  giggleLandBg = require('../../assets/amazonStoryQuestImages/gigglelandoptionwrong.png');
                }
              }

              return (
                <GiggleLandAnimatedPressable
                  key={giggleLandOptIdx}
                  disabled={giggleLandConfirmed}
                  onPress={() => {
                    setGiggleLandSelected(giggleLandOptIdx);
                  }}
                >
                  <ImageBackground
                    source={giggleLandBg}
                    style={[
                      styles.giggleLandOption,
                      { opacity: !giggleLandIsSelected ? 0.8 : 1 },
                    ]}
                  >
                    <Text style={styles.giggleLandOptionText}>
                      {giggleLandOption.text}
                    </Text>
                  </ImageBackground>
                </GiggleLandAnimatedPressable>
              );
            },
          )}

          {giggleLandShowConfetti && (
            <Image
              source={require('../../assets/amazonStoryQuestImages/confettiBig.gif')}
              style={{
                position: 'absolute',
                alignSelf: 'center',
                top: -50,
              }}
            />
          )}
        </View>

        <TouchableOpacity
          disabled={giggleLandSelected === null}
          onPress={giggleLandConfirmAnswer}
          style={{
            opacity: giggleLandSelected === null ? 0.4 : 1,
            alignSelf: 'center',
            marginTop: 20,
            marginBottom: 120,
          }}
        >
          <Image
            source={require('../../assets/amazonStoryQuestImages/gigglelandyes.png')}
          />
        </TouchableOpacity>
      </AmazingGiggleLandLayout>
    );
  }

  if (giggleLandScreen === 'result') {
    const giggleLandIsGood = giggleLandScore >= 11;

    return (
      <AmazingGiggleLandLayout>
        <View style={styles.giggleLandCenter}>
          <Image
            source={
              giggleLandIsGood
                ? require('../../assets/amazonStoryQuestImages/gigglelandgoodres.png')
                : require('../../assets/amazonStoryQuestImages/gigglelandbadres.png')
            }
            style={{ top: 40, zIndex: 1 }}
          />

          <View>
            <ImageBackground
              source={require('../../assets/amazonStoryQuestImages/gigglelandresbox.png')}
              style={styles.giggleLandResultBox}
            >
              <Text style={styles.giggleLandResultText}>
                {giggleLandIsGood
                  ? 'Well Done! You’ve clearly mastered the art of picking the funniest punchlines.'
                  : 'Not bad! Your humor spark is there — it just needs a little warm-up.'}
                {'\n\n'}You earned {giggleLandScore} points.
              </Text>
            </ImageBackground>

            {giggleLandShowFinalConfetti && (
              <Image
                source={require('../../assets/amazonStoryQuestImages/fireworkMany.gif')}
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  top: -50,
                }}
              />
            )}
          </View>

          <TouchableOpacity onPress={() => setGiggleLandScreen('intro')}>
            <Image
              source={require('../../assets/amazonStoryQuestImages/gigglelandrest.png')}
            />
          </TouchableOpacity>
        </View>
      </AmazingGiggleLandLayout>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  giggleLandCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 130,
  },
  giggleLandIntroBox: {
    width: 344,
    height: 471,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 30,
  },
  giggleLandTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
    color: '#fff',
    width: '80%',
  },
  giggleLandIntroText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#fff',
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  giggleLandQuestionBox: {
    width: 379,
    minHeight: 190,
    alignSelf: 'center',
    padding: 20,
    marginTop: height * 0.09,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giggleLandQuestion: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 17,
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  giggleLandPaginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  giggleLandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  giggleLandDotActive: {
    backgroundColor: '#FFF',
  },
  giggleLandDotInactive: {
    backgroundColor: '#000',
    opacity: 0.3,
  },
  giggleLandOption: {
    width: 348,
    minHeight: 93,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 11,
    paddingHorizontal: 20,
  },
  giggleLandOptionText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    color: '#1B1B1B',
  },
  giggleLandDialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  giggleLandDialogBox: {
    width: 300,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  giggleLandDialogText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  giggleLandDialogButtons: {
    flexDirection: 'row',
    gap: 30,
  },
  giggleLandResultBox: {
    width: 361,
    minHeight: 218,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    marginVertical: 20,
  },
  giggleLandResultText: {
    fontSize: 17,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    paddingHorizontal: 20,
  },
});

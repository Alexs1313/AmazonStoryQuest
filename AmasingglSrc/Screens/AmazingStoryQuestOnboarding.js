import AmazingGiggleLandLayout from '../StoryComponents/AmazingGiggleLandLayout';
import {
  Animated,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import AmazingStoryQuestButton from '../StoryComponents/AmazingStoryQuestButton';

const AmazingStoryQuestOnboarding = () => {
  const [giggleLandCurrentStep, setGiggleLandCurrentStep] = useState(0);
  const [giggleLandTypedTitle, setGiggleLandTypedTitle] = useState('');
  const [giggleLandTypedSubtitle, setGiggleLandTypedSubtitle] = useState('');
  const navigation = useNavigation();
  const giggleLandBoardAnim = useRef(new Animated.Value(0)).current;
  const giggleLandImageAnim = useRef(new Animated.Value(0)).current;
  const giggleLandFullTitle =
    giggleLandCurrentStep === 0 && Platform.OS === 'ios'
      ? 'Welcome to Amazin Giggle Quest!'
      : giggleLandCurrentStep === 0 && Platform.OS === 'android'
      ? 'Welcome to Toto Story Quest!'
      : giggleLandCurrentStep === 1
      ? 'Read & Rate Funny Stories'
      : giggleLandCurrentStep === 2
      ? 'Complete the Joke Quiz'
      : 'Track Your Mood Masks';
  const giggleLandFullSubtitle =
    giggleLandCurrentStep === 0
      ? 'Enjoy lighthearted stories, playful humor, and a fun way to lift your mood.'
      : giggleLandCurrentStep === 1
      ? 'Explore short comedic stories and rate them with smileys to shape your personal progress.'
      : giggleLandCurrentStep === 2
      ? 'Choose the funniest punchlines, earn points, and boost your second progress mask.'
      : 'Two masks reflect your achievements: one for stories, one for the quiz. The more points you earn, the happier they become. Enjoy the journey!';

  useEffect(() => {
    giggleLandBoardAnim.setValue(0);
    giggleLandImageAnim.setValue(0);

    Animated.parallel([
      Animated.timing(giggleLandBoardAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(giggleLandImageAnim, {
        toValue: 1,
        duration: 500,
        delay: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [giggleLandCurrentStep, giggleLandBoardAnim, giggleLandImageAnim]);

  useEffect(() => {
    setGiggleLandTypedTitle('');
    setGiggleLandTypedSubtitle('');

    let giggleLandTitleIndex = 0;
    let giggleLandSubtitleIndex = 0;
    let giggleLandSubtitleTimer;

    const giggleLandTitleTimer = setInterval(() => {
      giggleLandTitleIndex += 1;
      setGiggleLandTypedTitle(
        giggleLandFullTitle.slice(0, giggleLandTitleIndex),
      );

      if (giggleLandTitleIndex >= giggleLandFullTitle.length) {
        clearInterval(giggleLandTitleTimer);
      }
    }, 18);

    const giggleLandSubtitleDelay = setTimeout(() => {
      giggleLandSubtitleTimer = setInterval(() => {
        giggleLandSubtitleIndex += 1;
        setGiggleLandTypedSubtitle(
          giggleLandFullSubtitle.slice(0, giggleLandSubtitleIndex),
        );

        if (giggleLandSubtitleIndex >= giggleLandFullSubtitle.length) {
          clearInterval(giggleLandSubtitleTimer);
        }
      }, 10);
    }, 120);

    return () => {
      clearInterval(giggleLandTitleTimer);
      clearTimeout(giggleLandSubtitleDelay);
      if (giggleLandSubtitleTimer) {
        clearInterval(giggleLandSubtitleTimer);
      }
    };
  }, [giggleLandCurrentStep, giggleLandFullTitle, giggleLandFullSubtitle]);

  return (
    <AmazingGiggleLandLayout>
      <View style={styles.giggleLandOnboardContainer}>
        <Animated.View
          style={{
            opacity: giggleLandBoardAnim,
            transform: [
              {
                translateY: giggleLandBoardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
            ],
          }}
        >
          <ImageBackground
            source={require('../../assets/amazonStoryQuestImages/gigglelandboard.png')}
            style={styles.giggleLandBoardCont}
          >
            <Text style={styles.giggleLandTitle}>{giggleLandTypedTitle}</Text>
            <Text style={styles.giggleLandSubtitle}>
              {giggleLandTypedSubtitle}
            </Text>
          </ImageBackground>
        </Animated.View>

        <Animated.View
          style={{
            opacity: giggleLandImageAnim,
            transform: [
              {
                translateY: giggleLandImageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [22, 0],
                }),
              },
            ],
          }}
        >
          {giggleLandCurrentStep === 0 && (
            <Image
              source={require('../../assets/amazonStoryQuestImages/gigglelandon1.png')}
              style={{ marginBottom: 130, marginTop: 90 }}
            />
          )}
          {giggleLandCurrentStep === 1 && (
            <Image
              source={require('../../assets/amazonStoryQuestImages/gigglelandon2.png')}
              style={{ marginBottom: 24, marginTop: 30 }}
            />
          )}
          {giggleLandCurrentStep === 2 && (
            <Image
              source={require('../../assets/amazonStoryQuestImages/gigglelandon3.png')}
              style={{ marginBottom: 24 }}
            />
          )}
          {giggleLandCurrentStep === 3 && (
            <Image
              source={require('../../assets/amazonStoryQuestImages/gigglelandon4.png')}
              style={{ marginBottom: 47, marginTop: 24 }}
            />
          )}
        </Animated.View>

        <AmazingStoryQuestButton
          onPress={() =>
            giggleLandCurrentStep === 3
              ? navigation.replace('AmazingStoryQuestTab')
              : setGiggleLandCurrentStep(giggleLandCurrentStep + 1)
          }
        />
      </View>
    </AmazingGiggleLandLayout>
  );
};

const styles = StyleSheet.create({
  giggleLandOnboardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 35,
  },
  giggleLandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  giggleLandSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Inika-Bold',
    paddingHorizontal: 20,
  },
  giggleLandBoardCont: {
    width: 371,
    height: 271,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 35,
  },
});

export default AmazingStoryQuestOnboarding;

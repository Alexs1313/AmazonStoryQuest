import AmazingGiggleLandLayout from '../AmazonStoryQuestComponents/AmazingGiggleLandLayout';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import AmazingStoryQuestButton from '../AmazonStoryQuestComponents/AmazingStoryQuestButton';

const AmazingStoryQuestOnboarding = () => {
  const [giggleLandCurrentStep, setGiggleLandCurrentStep] = useState(0);
  const navigation = useNavigation();

  return (
    <AmazingGiggleLandLayout>
      <View style={styles.giggleLandOnboardContainer}>
        <ImageBackground
          source={require('../../assets/amazonStoryQuestImages/gigglelandboard.png')}
          style={styles.giggleLandBoardCont}
        >
          <Text style={styles.giggleLandTitle}>
            {giggleLandCurrentStep === 0 &&
              Platform.OS === 'ios' &&
              'Welcome to Amazon Story Quest!'}
            {giggleLandCurrentStep === 0 &&
              Platform.OS === 'android' &&
              'Welcome to Toto Story Quest!'}
            {giggleLandCurrentStep === 1 && 'Read & Rate Funny Stories'}
            {giggleLandCurrentStep === 2 && 'Complete the Joke Quiz'}
            {giggleLandCurrentStep === 3 && 'Track Your Mood Masks'}
          </Text>
          <Text style={styles.giggleLandSubtitle}>
            {giggleLandCurrentStep === 0 &&
              'Enjoy lighthearted stories, playful humor, and a fun way to lift your mood.'}
            {giggleLandCurrentStep === 1 &&
              'Explore short comedic stories and rate them with smileys to shape your personal progress.'}
            {giggleLandCurrentStep === 2 &&
              'Choose the funniest punchlines, earn points, and boost your second progress mask.'}
            {giggleLandCurrentStep === 3 &&
              'Two masks reflect your achievements: one for stories, one for the quiz. The more points you earn, the happier they become. Enjoy the journey!'}
          </Text>
        </ImageBackground>

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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  giggleLandSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '400',
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

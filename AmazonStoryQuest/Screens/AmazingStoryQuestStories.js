import AsyncStorage from '@react-native-async-storage/async-storage';
import AmazingGiggleLandLayout from '../StoryComponents/AmazingGiggleLandLayout';

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Share,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { giggleLandStoriesData } from '../StoryQuestConsts/giggleLandQuizData';
import { useStore } from '../[AmazonQuestStore]/amazingGiggleQuestContext';

const { height } = Dimensions.get('window');

const AmazingStoryQuestStories = () => {
  const [giggleLandTab, setGiggleLandTab] = useState('all');
  const [giggleLandOpened, setGiggleLandOpened] = useState(null);
  const {
    setIsOnGiggleLandVibration,
    setIsOnGiggleLandSound,
    giggleLandFavorites,
    setGiggleLandFavorites,
    giggleLandRatings,
    setGiggleLandRatings,
  } = useStore();

  useFocusEffect(
    useCallback(() => {
      giggleLandLoadSound();
      giggleLandLoadVibration();
      giggleLandLoadData();

      return () => {
        setGiggleLandTab('all');
        setGiggleLandOpened(null);
      };
    }, []),
  );

  const giggleLandLoadSound = async () => {
    try {
      const giggleLandSoundValue = await AsyncStorage.getItem(
        'gigglelandsound',
      );
      const giggleLandSoundOn = JSON.parse(giggleLandSoundValue);
      setIsOnGiggleLandSound(giggleLandSoundOn);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const giggleLandLoadVibration = async () => {
    try {
      const giggleLandVibrationValue = await AsyncStorage.getItem(
        'gigglelandvibration',
      );
      if (giggleLandVibrationValue !== null) {
        const giggleLandVibrationOn = JSON.parse(giggleLandVibrationValue);
        setIsOnGiggleLandVibration(giggleLandVibrationOn);
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  const giggleLandLoadData = async () => {
    const giggleLandFav = await AsyncStorage.getItem('GiggleFavorites');
    const giggleLandRating = await AsyncStorage.getItem('GiggleRatings');

    if (giggleLandFav) setGiggleLandFavorites(JSON.parse(giggleLandFav));
    if (giggleLandRating) setGiggleLandRatings(JSON.parse(giggleLandRating));
  };

  const giggleLandToggleFavorite = async id => {
    let giggleLandNewFav = [];

    if (giggleLandFavorites.includes(id))
      giggleLandNewFav = giggleLandFavorites.filter(
        favorite => favorite !== id,
      );
    else giggleLandNewFav = [...giggleLandFavorites, id];
    setGiggleLandFavorites(giggleLandNewFav);
    await AsyncStorage.setItem(
      'GiggleFavorites',
      JSON.stringify(giggleLandNewFav),
    );
  };

  const giggleLandSetRating = async (selectedId, selectedValue) => {
    const giggleLandNewRatings = {
      ...giggleLandRatings,
      [selectedId]: selectedValue,
    };
    setGiggleLandRatings(giggleLandNewRatings);

    await AsyncStorage.setItem(
      'GiggleRatings',
      JSON.stringify(giggleLandNewRatings),
    );

    const giggleLandNewSum = Object.values(giggleLandNewRatings).reduce(
      (a, b) => a + b,
      0,
    );

    const giggleLandPrev = await AsyncStorage.getItem('GiggleStoriesMoodScore');
    const giggleLandBest = giggleLandPrev ? Number(giggleLandPrev) : 0;

    const giggleLandFinal =
      giggleLandNewSum > giggleLandBest ? giggleLandNewSum : giggleLandBest;

    await AsyncStorage.setItem(
      'GiggleStoriesMoodScore',
      String(giggleLandFinal),
    );
  };

  const giggleLandShareStory = async (selectedTitle, selectedText) => {
    try {
      await Share.share({
        message: `${selectedTitle}\n\n${selectedText}`,
      });
    } catch (error) {
      console.log('Error', error);
    }
  };

  const giggleLandVisibleStories =
    giggleLandTab === 'all'
      ? giggleLandStoriesData
      : giggleLandStoriesData.filter(story =>
          giggleLandFavorites.includes(story.id),
        );

  if (giggleLandOpened) {
    const giggleLandStory = giggleLandStoriesData.find(
      story => story.id === giggleLandOpened,
    );

    return (
      <ImageBackground
        source={require('../../assets/amazonStoryQuestImages/gigglelanddetbg.png')}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.giggleLandContainer}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                textAlign: 'center',
                marginTop: 40,
                color: '#fff',
                paddingHorizontal: 50,
                marginBottom: 20,
              }}
            >
              {giggleLandStory.title}
            </Text>

            <Image
              source={giggleLandStory.image}
              style={styles.giggleLandStoryImage}
            />

            <Text style={styles.giggleLandStorySubitle}>
              {giggleLandStory.text}
            </Text>

            <View style={styles.giggleLandStarsDetWrap}>
              <TouchableOpacity
                onPress={() => giggleLandToggleFavorite(giggleLandStory.id)}
                style={{ alignSelf: 'center' }}
              >
                <Image
                  source={
                    giggleLandFavorites.includes(giggleLandStory.id)
                      ? require('../../assets/amazonStoryQuestImages/starbigOn.png')
                      : require('../../assets/amazonStoryQuestImages/starbigOff.png')
                  }
                />
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {[1, 2, 3].map(n => (
                  <TouchableOpacity
                    key={n}
                    onPress={() => giggleLandSetRating(giggleLandStory.id, n)}
                  >
                    <Text style={{ fontSize: 40, marginHorizontal: 4 }}>
                      {giggleLandRatings[giggleLandStory.id] >= n ? (
                        <Image
                          source={require('../../assets/amazonStoryQuestImages/gigglelandlolact.png')}
                          style={{
                            width: 26,
                            height: 24,
                          }}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/amazonStoryQuestImages/gigglelandlol.png')}
                          style={{
                            width: 26,
                            height: 24,
                          }}
                        />
                      )}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  giggleLandShareStory(
                    giggleLandStory.title,
                    giggleLandStory.text,
                  )
                }
              >
                <Image
                  source={require('../../assets/amazonStoryQuestImages/gigglelandshr.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  return (
    <AmazingGiggleLandLayout>
      <View style={styles.giggleLandContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 20,
            gap: 25,
          }}
        >
          <TouchableOpacity
            onPress={() => setGiggleLandTab('all')}
            activeOpacity={0.7}
          >
            <ImageBackground
              source={require('../../assets/amazonStoryQuestImages/tabOn.png')}
              style={[
                styles.giggleLandTabContainer,
                giggleLandTab === 'favorite'
                  ? { opacity: 0.6 }
                  : { opacity: 1 },
              ]}
            >
              <Text
                style={{ color: '#1B1B1B', fontSize: 16, fontWeight: '700' }}
              >
                All
              </Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setGiggleLandTab('favorite')}
            activeOpacity={0.7}
          >
            <ImageBackground
              source={require('../../assets/amazonStoryQuestImages/tabOn.png')}
              style={[
                styles.giggleLandTabContainer,
                giggleLandTab === 'favorite'
                  ? { opacity: 1 }
                  : { opacity: 0.6 },
              ]}
            >
              <Text
                style={{ color: '#1B1B1B', fontSize: 16, fontWeight: '700' }}
              >
                Favorite
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        {giggleLandTab === 'favorite' &&
          giggleLandVisibleStories.length === 0 && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ImageBackground
                source={require('../../assets/amazonStoryQuestImages/gigglelandmodalbox.png')}
                style={styles.giggleLandEmptyBoard}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '700',
                    paddingHorizontal: 50,
                    lineHeight: 22,
                  }}
                >
                  Your favorites are empty… Looks like no story has impressed
                  you yet. Give a few a try — maybe one will steal your heart.
                </Text>
              </ImageBackground>

              <Image
                source={require('../../assets/amazonStoryQuestImages/gigglelandemptystar.png')}
                style={{ tintColor: '#00fbffff' }}
              />
            </View>
          )}
        {giggleLandVisibleStories.map(story => (
          <View key={story.id}>
            <ImageBackground
              source={require('../../assets/amazonStoryQuestImages/storycardbg.png')}
              style={styles.giggleLandCardBoard}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={story.image}
                  style={{
                    width: '33%',
                    height: 110,
                    left: 13,
                    top: 2,
                    borderRadius: 12,
                  }}
                />

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.giggleLandStoryTitle}>{story.title}</Text>

                  <View style={{ flexDirection: 'row', marginTop: 2 }}>
                    {[1, 2, 3].map(n => (
                      <View key={n} style={{ marginRight: 5 }}>
                        {giggleLandRatings[story.id] >= n ? (
                          <Image
                            source={require('../../assets/amazonStoryQuestImages/gigglelandlolact.png')}
                            style={{
                              tintColor: '#f5ae08d6',
                              width: 24,
                              height: 24,
                            }}
                          />
                        ) : (
                          <Image
                            source={require('../../assets/amazonStoryQuestImages/gigglelandlol.png')}
                            style={{
                              tintColor: '#f5ae08d6',
                              width: 24,
                              height: 24,
                            }}
                          />
                        )}
                      </View>
                    ))}
                  </View>

                  <View style={styles.giggleLandStarsWrap}>
                    <Image
                      source={
                        giggleLandFavorites.includes(story.id)
                          ? require('../../assets/amazonStoryQuestImages/starbigOn.png')
                          : require('../../assets/amazonStoryQuestImages/starbigOff.png')
                      }
                      style={{ tintColor: '#f5ae08d6', width: 26, height: 24 }}
                    />

                    <TouchableOpacity
                      onPress={() => setGiggleLandOpened(story.id)}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={require('../../assets/amazonStoryQuestImages/playbtn.png')}
                        style={{
                          tintColor: '#f5ae08d6',
                          width: 32,
                          height: 32,
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        giggleLandShareStory(story.title, story.text)
                      }
                    >
                      <Image
                        source={require('../../assets/amazonStoryQuestImages/gigglelandshr.png')}
                        style={{
                          tintColor: '#f5ae08d6',
                          width: 26,
                          height: 20,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </View>
    </AmazingGiggleLandLayout>
  );
};

const styles = StyleSheet.create({
  giggleLandContainer: {
    flex: 1,
    paddingBottom: 130,
    paddingTop: height * 0.06,
  },
  giggleLandTabContainer: {
    width: 130,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giggleLandStoryBoard: {
    width: 510,
    height: 724,
    alignSelf: 'center',
    padding: 50,
    paddingTop: 80,
  },
  giggleLandStarsWrap: {
    flexDirection: 'row',
    marginTop: 5,
    gap: 16,
    alignItems: 'center',
  },
  giggleLandStoryTitle: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
    width: '80%',
  },
  giggleLandCardBoard: {
    width: 364,
    minHeight: 182,
    alignSelf: 'center',
    padding: 20,
    marginBottom: 8,
    paddingTop: 35,
  },
  giggleLandStarsDetWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 50,
    alignSelf: 'flex-end',
    flex: 1,
    width: '100%',
    marginTop: 40,
  },
  giggleLandStorySubitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  giggleLandStoryImage: {
    width: 150,
    height: 140,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  giggleLandEmptyBoard: {
    width: 371,
    height: 271,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
});

export default AmazingStoryQuestStories;

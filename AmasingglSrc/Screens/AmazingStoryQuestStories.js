import AsyncStorage from '@react-native-async-storage/async-storage';
import AmazingGiggleLandLayout from '../StoryComponents/AmazingGiggleLandLayout';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  Image,
  Pressable,
  ImageBackground,
  Share,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { giggleLandStoriesData } from '../../giggleLandQuizData';
import { useStore } from '../[QuestStore]/amazingGiggleQuestContext';

const { height } = Dimensions.get('window');

const AnimatedPressable = ({ onPress, style, children }) => {
  const giggleLandScale = useRef(new Animated.Value(1)).current;

  const giggleLandHandlePressIn = () => {
    Animated.spring(giggleLandScale, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 35,
      bounciness: 4,
    }).start();
  };

  const giggleLandHandlePressOut = () => {
    Animated.spring(giggleLandScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 35,
      bounciness: 4,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={giggleLandHandlePressIn}
      onPressOut={giggleLandHandlePressOut}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale: giggleLandScale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const AmazingStoryQuestStories = () => {
  const [giggleLandTab, setGiggleLandTab] = useState('all');
  const [giggleLandOpened, setGiggleLandOpened] = useState(null);
  const giggleLandCardAnims = useRef({});
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
  const giggleLandVisibleStoryIds = giggleLandVisibleStories
    .map(story => story.id)
    .join('-');

  const giggleLandGetCardAnim = storyId => {
    if (!giggleLandCardAnims.current[storyId]) {
      giggleLandCardAnims.current[storyId] = new Animated.Value(0);
    }
    return giggleLandCardAnims.current[storyId];
  };

  useEffect(() => {
    const giggleLandCardsToAnimate = giggleLandVisibleStories.map(story =>
      giggleLandGetCardAnim(story.id),
    );

    giggleLandCardsToAnimate.forEach(anim => anim.setValue(0));

    Animated.stagger(
      90,
      giggleLandCardsToAnimate.map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [giggleLandVisibleStoryIds]);

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
                fontSize: 20,
                fontWeight: '700',
                textAlign: 'center',

                color: '#000',
                width: '50%',
                alignSelf: 'center',
                marginBottom: 20,
              }}
            >
              {giggleLandStory.title}
            </Text>

            <AnimatedPressable
              onPress={() => setGiggleLandOpened(null)}
              style={styles.giggleLandBackButton}
            >
              <Image
                source={require('../../assets/amazonStoryQuestImages/back.png')}
              />
            </AnimatedPressable>

            <Image
              source={giggleLandStory.image}
              style={styles.giggleLandStoryImage}
            />

            <Text style={styles.giggleLandStorySubitle}>
              {giggleLandStory.text}
            </Text>

            <View style={styles.giggleLandStarsDetWrap}>
              <AnimatedPressable
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
              </AnimatedPressable>

              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {[1, 2, 3].map(n => (
                  <AnimatedPressable
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
                  </AnimatedPressable>
                ))}
              </View>

              <AnimatedPressable
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
              </AnimatedPressable>
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
          <AnimatedPressable onPress={() => setGiggleLandTab('all')}>
            <ImageBackground
              source={require('../../assets/amazonStoryQuestImages/tabOn.png')}
              style={[
                styles.giggleLandTabContainer,
                giggleLandTab === 'favorite'
                  ? { opacity: 0.8 }
                  : { opacity: 1 },
              ]}
            >
              <Text
                style={{ color: '#1B1B1B', fontSize: 16, fontWeight: '700' }}
              >
                All
              </Text>
            </ImageBackground>
          </AnimatedPressable>

          <AnimatedPressable onPress={() => setGiggleLandTab('favorite')}>
            <ImageBackground
              source={require('../../assets/amazonStoryQuestImages/tabOn.png')}
              style={[
                styles.giggleLandTabContainer,
                giggleLandTab === 'favorite'
                  ? { opacity: 1 }
                  : { opacity: 0.8 },
              ]}
            >
              <Text
                style={{ color: '#1B1B1B', fontSize: 16, fontWeight: '700' }}
              >
                Favorite
              </Text>
            </ImageBackground>
          </AnimatedPressable>
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
          <Animated.View
            key={story.id}
            style={{
              opacity: giggleLandGetCardAnim(story.id),
              transform: [
                {
                  translateY: giggleLandGetCardAnim(story.id).interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            }}
          >
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

                    <AnimatedPressable
                      onPress={() => setGiggleLandOpened(story.id)}
                    >
                      <Image
                        source={require('../../assets/amazonStoryQuestImages/playbtn.png')}
                        style={{
                          tintColor: '#f5ae08d6',
                          width: 32,
                          height: 32,
                        }}
                      />
                    </AnimatedPressable>

                    <AnimatedPressable
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
                    </AnimatedPressable>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </Animated.View>
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
  giggleLandBackButton: {
    position: 'absolute',
    left: 20,
    top: height * 0.06,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giggleLandBackButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B1B1B',
    marginTop: -3,
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
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  giggleLandStoryImage: {
    width: 150,
    height: 140,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
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

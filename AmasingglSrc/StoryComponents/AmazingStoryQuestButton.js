import React, { useRef } from 'react';
import { Animated, Image, Pressable } from 'react-native';

const AmazingStoryQuestButton = ({ onPress }) => {
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
    >
      <Animated.View style={{ transform: [{ scale: giggleLandScale }] }}>
        <Image
          source={require('../../assets/amazonStoryQuestImages/gigglelandnext.png')}
        />
      </Animated.View>
    </Pressable>
  );
};

export default AmazingStoryQuestButton;

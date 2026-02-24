import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useRef } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import AmazingStoryQuestStories from '../Screens/AmazingStoryQuestStories';
import AmazingStoryQuestMasks from '../Screens/AmazingStoryQuestMasks';
import AmazingStoryQuestQuiz from '../Screens/AmazingStoryQuestQuiz';
import AmazingStoryQuestSettings from '../Screens/AmazingStoryQuestSettings';

const Tab = createBottomTabNavigator();

const AnimatedTabBarButton = ({
  children,
  onPressIn,
  onPressOut,
  style,
  ...props
}) => {
  const giggleLandScale = useRef(new Animated.Value(1)).current;

  const giggleLandHandlePressIn = event => {
    Animated.spring(giggleLandScale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 35,
      bounciness: 4,
    }).start();
    onPressIn?.(event);
  };

  const giggleLandHandlePressOut = event => {
    Animated.spring(giggleLandScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 35,
      bounciness: 4,
    }).start();
    onPressOut?.(event);
  };

  return (
    <Pressable
      {...props}
      style={style}
      onPressIn={giggleLandHandlePressIn}
      onPressOut={giggleLandHandlePressOut}
    >
      <Animated.View style={{ transform: [{ scale: giggleLandScale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const AmazingStoryQuestTab = () => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          ...styles.gigglelandTabs,
          paddingHorizontal: isLandscape ? '40%' : '28%',
        },
        tabBarActiveTintColor: '#000',
        tabBarBackground: () => (
          <ImageBackground
            source={require('../../assets/amazonStoryQuestImages/gigglelandtab.png')}
            style={{ height: 71, width: 243, alignSelf: 'center' }}
          ></ImageBackground>
        ),
        tabBarButton: props => <AnimatedTabBarButton {...props} />,
      }}
    >
      <Tab.Screen
        name="AmazingStoryQuestStories"
        component={AmazingStoryQuestStories}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Image
                  source={require('../../assets/amazonStoryQuestImages/gigglelandtab1foc.png')}
                />
              ) : (
                <Image
                  source={require('../../assets/amazonStoryQuestImages/gigglelandtab1.png')}
                />
              )}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="AmazingStoryQuestMasks"
        component={AmazingStoryQuestMasks}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Image
                  source={require('../../assets/amazonStoryQuestImages/gigglelandtab2act.png')}
                />
              ) : (
                <Image
                  source={require('../../assets/amazonStoryQuestImages/gigglelandtab2.png')}
                />
              )}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="AmazingStoryQuestQuiz"
        component={AmazingStoryQuestQuiz}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Image
                  source={require('../../assets/amazonStoryQuestImages/gigglelandtab3act.png')}
                />
              ) : (
                <Image
                  source={require('../../assets/amazonStoryQuestImages/gigglelandtab3.png')}
                />
              )}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="AmazingStoryQuestSettings"
        component={AmazingStoryQuestSettings}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Image
                  source={require('../../assets/amazonStoryQuestImages/gigglelandtab4act.png')}
                />
              ) : (
                <Image
                  source={require('../../assets/amazonStoryQuestImages/gigglelandtab4.png')}
                />
              )}
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  gigglelandTabs: {
    elevation: 0,
    paddingTop: 17,
    paddingBottom: 16,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 31,
    borderTopColor: 'transparent',
    borderTopWidth: 1,
  },
});

export default AmazingStoryQuestTab;

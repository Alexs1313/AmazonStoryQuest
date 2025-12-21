import { ImageBackground, ScrollView } from 'react-native';

const AmazingGiggleLandLayout = ({ children }) => {
  return (
    <ImageBackground
      source={require('../../assets/amazonStoryQuestImages/gigglelandbg.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </ImageBackground>
  );
};

export default AmazingGiggleLandLayout;

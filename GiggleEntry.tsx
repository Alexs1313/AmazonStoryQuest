import { MusicProvider } from './AmasingglSrc/[QuestStore]/amazingGiggleQuestContext';
import { NavigationContainer } from '@react-navigation/native';
import AmazingStoryQuestStack from './Routes';

const GiggleEntry = () => {
  return (
    <NavigationContainer>
      <MusicProvider>
        <AmazingStoryQuestStack />
      </MusicProvider>
    </NavigationContainer>
  );
};

export default GiggleEntry;

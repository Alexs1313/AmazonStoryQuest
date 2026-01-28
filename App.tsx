import { MusicProvider } from './AmazonStoryQuest/[AmazonQuestStore]/amazingGiggleQuestContext';
import { NavigationContainer } from '@react-navigation/native';
import AmazingStoryQuestStack from './AmazonStoryQuest/[QuestRoutes]/AmazingStoryQuestStack';

const App = () => {
  return (
    <NavigationContainer>
      <MusicProvider>
        <AmazingStoryQuestStack />
      </MusicProvider>
    </NavigationContainer>
  );
};

export default App;

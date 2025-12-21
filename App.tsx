import { MusicProvider } from './AmazonStoryQuest/AmazonStoryQuestStore/amazingGiggleQuestContext';
import { NavigationContainer } from '@react-navigation/native';
import AmazingStoryQuestStack from './AmazonStoryQuest/AmazonStoryQuestRoutes/AmazingStoryQuestStack';

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

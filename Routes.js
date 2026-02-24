import { createStackNavigator } from '@react-navigation/stack';
import AmazingStoryQuestLoader from './AmasingglSrc/StoryComponents/AmazingGiggleLandLoader';
import AmazingStoryQuestOnboarding from './AmasingglSrc/Screens/AmazingStoryQuestOnboarding';
import AmazingStoryQuestTab from './AmasingglSrc/[QuestRoutes]/AmazingStoryQuestTab';

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AmazingStoryQuestLoader"
        component={AmazingStoryQuestLoader}
      />
      <Stack.Screen
        name="AmazingStoryQuestOnboarding"
        component={AmazingStoryQuestOnboardin}
      />
      <Stack.Screen
        name="AmazingStoryQuestTab"
        component={AmazingStoryQuestTab}
      />
    </Stack.Navigator>
  );
};

export default Routes;

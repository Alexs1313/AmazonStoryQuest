import { Image, TouchableOpacity } from 'react-native';

const AmazingStoryQuestButton = ({ onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress()}>
      <Image
        source={require('../../assets/amazonStoryQuestImages/gigglelandnext.png')}
      />
    </TouchableOpacity>
  );
};

export default AmazingStoryQuestButton;

import { createContext, useContext, useState } from 'react';
import Sound from 'react-native-sound';

export const StoreContext = createContext();

export const useStore = () => {
  return useContext(StoreContext);
};

export const MusicProvider = ({ children }) => {
  const [isOnGiggleLandVibration, setIsOnGiggleLandVibration] = useState(false);
  const [isOnGiggleLandSound, setIsOnGiggleLandSound] = useState(false);
  const [giggleLandFavorites, setGiggleLandFavorites] = useState([]);
  const [giggleLandRatings, setGiggleLandRatings] = useState({});
  const [giggleLandStoryScore, setGiggleLandStoryScore] = useState(0);
  const [giggleLandQuizScore, setGiggleLandQuizScore] = useState(0);

  const GiggleLandSound = () => {
    const clickSound = new Sound(
      'fireworks-08-419026.mp3',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('error', error);
          return;
        }
        clickSound.play(success => {
          if (!success) {
            console.log('error');
          }
          clickSound.release();
        });
      },
    );
  };

  const GiggleLandBadSound = () => {
    const clickSound = new Sound(
      'crowd-shocked-reaction-352766.mp3',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('error', error);
          return;
        }
        clickSound.play(success => {
          if (!success) {
            console.log('error');
          }
          clickSound.release();
        });
      },
    );
  };

  const GiggleLandNeutralSound = () => {
    const clickSound = new Sound(
      'crowd-laughing-07-120585.mp3',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('error', error);
          return;
        }
        clickSound.play(success => {
          if (!success) {
            console.log('error');
          }
          clickSound.release();
        });
      },
    );
  };

  const GiggleLandWinSound = () => {
    const clickSound = new Sound(
      'crowd-laughing-sound-effect-no-copyright-390899.mp3',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('error', error);
          return;
        }
        clickSound.play(success => {
          if (!success) {
            console.log('error');
          }
          clickSound.release();
        });
      },
    );
  };

  const lepraaLabValues = {
    isOnGiggleLandVibration,
    setIsOnGiggleLandVibration,
    isOnGiggleLandSound,
    setIsOnGiggleLandSound,
    GiggleLandSound,
    GiggleLandBadSound,
    GiggleLandNeutralSound,
    GiggleLandWinSound,
    giggleLandFavorites,
    setGiggleLandFavorites,
    giggleLandRatings,
    setGiggleLandRatings,
    giggleLandStoryScore,
    setGiggleLandStoryScore,
    giggleLandQuizScore,
    setGiggleLandQuizScore,
  };

  return (
    <StoreContext.Provider value={lepraaLabValues}>
      {children}
    </StoreContext.Provider>
  );
};

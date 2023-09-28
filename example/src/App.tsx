import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SwipeableElement } from 'react-native-swipeable-element';
import type { SwipeableElementProps } from '../../src/SwipeableElement/types';
function mockApiCall() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, 1000);
  });
}

function CheckMark() {
  return (
    <Image
      source={require('../assets/check-mark.png')}
      style={styles.finishedIcon}
      resizeMode="contain"
    />
  );
}

function ElementToSwipe() {
  return (
    <Image
      source={require('../assets/up-arrow.png')}
      style={styles.icon}
      resizeMode="contain"
    />
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const onSwipeEnd: SwipeableElementProps['onSwipeComplete'] = async (e) => {
    console.log('onSwipeComplete: ', e);
    if (e.isTopReached) {
      try {
        setIsLoading(true);
        await mockApiCall();
        setIsFinished(true);
        setTimeout(() => {
          setIsFinished(false);
        }, 2000);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.root}>
      <SwipeableElement
        isLoading={isLoading}
        isFinished={isFinished}
        styleProp={{
          container: styles.container,
          swipeableWrapper: styles.swipeableWrapper,
        }}
        onSwipeComplete={onSwipeEnd}
        FinishedComponent={CheckMark}
        Element={ElementToSwipe}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'powderblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: 80,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  swipeableWrapper: { marginTop: 'auto', marginBottom: 6 },
  icon: { tintColor: 'white', height: 40 },
  finishedIcon: {
    tintColor: 'white',
    height: 40,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});
export default App;

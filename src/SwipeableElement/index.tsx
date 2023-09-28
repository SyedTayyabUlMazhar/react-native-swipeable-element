import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, PanResponder, View } from 'react-native';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import type { SwipeableElementProps } from './types';
import styles from './styles';

function SwipeableElement(props: SwipeableElementProps) {
  const {
    styleProp,
    onSwipeComplete,
    isLoading,
    loaderColor = 'white',
    isFinished,
    FinishedComponent,
    Element,
    loopAnimationDuration = 2000,
  } = props;

  const childTranslateYAnim = useRef(new Animated.Value(0)).current;
  const childOpacityAnim = useRef(new Animated.Value(1)).current;

  const loopAnimation = useRef<Animated.CompositeAnimation>();

  const [containerLayoutValues, setContainerLayoutValues] =
    useState<LayoutRectangle>();
  const [swipeableWrapperLayoutValues, setSwipeableWrapperLayoutValues] =
    useState<LayoutRectangle>();

  const resetPosition = () => {
    Animated.spring(childTranslateYAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const calculateChildTranslateBounds = () => {
    if (!containerLayoutValues || !swipeableWrapperLayoutValues)
      return { translateMaxTop: 0, translateMaxBottom: 0 };

    const translateMaxTop = swipeableWrapperLayoutValues.y;
    const translateMaxBottom =
      containerLayoutValues.height -
      (swipeableWrapperLayoutValues.y + swipeableWrapperLayoutValues.height);

    return { translateMaxTop, translateMaxBottom };
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: () => {
          loopAnimation.current?.reset();
        },
        onPanResponderMove: (_evt, gestureState) => {
          if (!containerLayoutValues || !swipeableWrapperLayoutValues) return;
          let { dy } = gestureState;

          const { translateMaxTop, translateMaxBottom } =
            calculateChildTranslateBounds();

          dy = dy > translateMaxBottom ? translateMaxBottom : dy;
          dy = dy < -translateMaxTop ? -translateMaxTop : dy;
          childTranslateYAnim.setValue(dy);
        },
        onPanResponderTerminationRequest: () => true,
        onPanResponderRelease: (_evt, gestureState) => {
          const { translateMaxTop, translateMaxBottom } =
            calculateChildTranslateBounds();
          const { dy } = gestureState;
          const didReachTop = dy <= -translateMaxTop;
          const didReachBottom = dy >= translateMaxBottom;

          onSwipeComplete?.({
            isTopReached: didReachTop,
            isBottomReached: didReachBottom,
          });

          resetPosition();
          loopAnimation.current?.reset();
          loopAnimation.current?.start();
        },
        onPanResponderTerminate: () => {
          resetPosition();
          loopAnimation.current?.reset();
          loopAnimation.current?.start();
        },
        onShouldBlockNativeResponder: () => true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerLayoutValues, swipeableWrapperLayoutValues]
  );

  useEffect(() => {
    if (!containerLayoutValues || !swipeableWrapperLayoutValues) return;
    const { translateMaxTop } = calculateChildTranslateBounds();
    loopAnimation.current = Animated.loop(
      Animated.parallel([
        Animated.timing(childTranslateYAnim, {
          toValue: -translateMaxTop,
          duration: loopAnimationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(childOpacityAnim, {
          toValue: 0,
          duration: loopAnimationDuration,
          useNativeDriver: true,
        }),
      ])
    );
    loopAnimation.current.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerLayoutValues, swipeableWrapperLayoutValues]);

  const onContainerLayout = (e: LayoutChangeEvent) =>
    setContainerLayoutValues(e.nativeEvent.layout);
  const onSwipeableWrapperLayout = (e: LayoutChangeEvent) =>
    setSwipeableWrapperLayoutValues(e.nativeEvent.layout);

  return (
    <View style={styleProp?.container} onLayout={onContainerLayout}>
      {isLoading ? (
        <ActivityIndicator
          size={'small'}
          color={loaderColor}
          style={styles.loader}
        />
      ) : null}
      {isFinished ? <FinishedComponent /> : null}
      {!isLoading && !isFinished ? (
        <Animated.View
          style={[
            styleProp?.swipeableWrapper,
            {
              transform: [{ translateY: childTranslateYAnim }],
              opacity: childOpacityAnim,
            },
          ]}
          {...panResponder.panHandlers}
          onLayout={onSwipeableWrapperLayout}
        >
          <Element />
        </Animated.View>
      ) : null}
    </View>
  );
}

export default SwipeableElement;

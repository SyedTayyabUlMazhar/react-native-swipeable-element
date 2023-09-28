import type { StyleProp, ViewStyle } from 'react-native';

export type SwipeableElementProps = {
  /**
   * Called when user releases touch
   * @param event contains two boolean properties that determine whether the swipeable element
   * touched top or bottom of the container when touch was released.
   * @returns
   */
  onSwipeComplete?: (event: {
    isTopReached: boolean;
    isBottomReached: boolean;
  }) => void;
  isLoading?: boolean;
  loaderColor?: string;
  isFinished?: boolean;
  FinishedComponent: () => React.ReactElement;
  /**
   * Element that can be swiped
   */
  Element: () => React.ReactElement;
  styleProp?: {
    container?: StyleProp<ViewStyle>;
    swipeableWrapper?: StyleProp<ViewStyle>;
  };
  loopAnimationDuration?: number;
};

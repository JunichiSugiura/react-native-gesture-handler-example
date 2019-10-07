import React, {useMemo, useRef} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import {Template} from '../shared';

const {add, cond, eq, event, set, Value} = Animated;

const screen = Dimensions.get('screen');

export function BottomSheetExample() {
  const dragY = useRef(new Value(0)).current;
  const offsetY = useRef(new Value(screen.height - BOTTOM_BAR_HEIGHT)).current;
  const gestureState = useRef(new Value(-1)).current;
  const translateY = useRef(
    cond(
      eq(gestureState, State.ACTIVE),
      add(offsetY, dragY),
      set(offsetY, add(offsetY, dragY)),
    ),
  ).current;

  const handlePan = useMemo(
    () =>
      event([
        {
          nativeEvent: {
            translationY: dragY,
            state: gestureState,
          },
        },
      ]),
    [],
  );

  return (
    <Template>
      <PanGestureHandler
        onGestureEvent={handlePan}
        onHandlerStateChange={handlePan}>
        <Animated.View
          style={[styles.bottomSheet, {transform: [{translateY}]}]}
        />
      </PanGestureHandler>
    </Template>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    height: screen.height * 1.5,
    width: screen.width,
    backgroundColor: 'white',
    borderRadius: 16,
  },
});

const BOTTOM_BAR_HEIGHT = 82;

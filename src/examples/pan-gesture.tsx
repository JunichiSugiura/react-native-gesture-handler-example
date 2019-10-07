import React, {useMemo, useRef} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import {Template} from '../shared';

const screen = Dimensions.get('screen');

const {add, cond, eq, event, interpolate, set, Value} = Animated;

export function PanGestureExample() {
  const offsetX = useRef(new Value((screen.width - BOX_SIZE) / 2)).current;
  const offsetY = useRef(new Value((screen.height - BOX_SIZE) / 2)).current;
  const dragX = useRef(new Value(0)).current;
  const dragY = useRef(new Value(0)).current;
  const gestureState = useRef(new Value(State.UNDETERMINED)).current;
  const translateX = useRef(
    cond(
      eq(gestureState, State.ACTIVE),
      add(offsetX, dragX),
      set(offsetX, add(offsetX, dragX)),
    ),
  ).current;
  const translateY = useRef(
    cond(
      eq(gestureState, State.ACTIVE),
      add(offsetY, dragY),
      set(offsetY, add(offsetY, dragY)),
    ),
  ).current;
  const opacity = useRef(
    interpolate(translateY, {
      inputRange: [0, screen.height],
      outputRange: [1, 0.1],
    }),
  ).current;

  const handleGesture = useMemo(
    () =>
      event([
        {
          nativeEvent: {
            translationX: dragX,
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
        onGestureEvent={handleGesture}
        onHandlerStateChange={handleGesture}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.box,
            {
              opacity,
              transform: [{translateX, translateY}],
            },
          ]}
        />
      </PanGestureHandler>
    </Template>
  );
}

const BOX_SIZE = 100;

const styles = StyleSheet.create({
  container: {flex: 1},
  box: {
    height: BOX_SIZE,
    width: BOX_SIZE,
    backgroundColor: 'tomato',
    borderRadius: 16,
  },
});

import React, {useRef} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

const {add, cond, eq, event, set, Value} = Animated;

const {width, height} = Dimensions.get('screen');

export function BottomSheetExample() {
  const dragY = useRef(new Value(0)).current;
  const offsetY = useRef(new Value(0)).current;
  const gestureState = useRef(new Value(-1)).current;
  const onGestureEvent = useRef(
    event([
      {
        nativeEvent: {
          translationY: dragY,
          state: gestureState,
        },
      },
    ]),
  ).current;

  const addY = useRef(add(offsetY, dragY)).current;
  const transY = useRef(
    cond(eq(gestureState, State.ACTIVE), addY, set(offsetY, addY)),
  ).current;

  return (
    <StyledPanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onGestureEvent}>
      <Animated.View
        style={[styles.bottomSheet, {transform: [{translateY: transY}]}]}
      />
    </StyledPanGestureHandler>
  );
}

const StyledPanGestureHandler = styled(PanGestureHandler)`
  flex: 1;
`;

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    height: height * 1.5,
    width,
    backgroundColor: 'white',
    borderRadius: 16,
  },
});

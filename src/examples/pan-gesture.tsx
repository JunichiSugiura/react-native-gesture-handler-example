import React, {useRef} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

const {width} = Dimensions.get('screen');

const {add, cond, eq, event, set, Value} = Animated;

export function PanGesture() {
  const dragX = useRef(new Value(0));
  const dragY = useRef(new Value(0));
  const offsetX = useRef(new Value((width - BOX_SIZE) / 2));
  const offsetY = useRef(new Value(240));
  const gestureState = useRef(new Value(-1));
  const onGestureEvent = useRef(
    event([
      {
        nativeEvent: {
          translationX: dragX.current,
          translationY: dragY.current,
          state: gestureState.current,
        },
      },
    ]),
  );

  const addX = useRef(add(offsetX.current, dragX.current));
  const addY = useRef(add(offsetY.current, dragY.current));

  const transX = useRef(
    cond(
      eq(gestureState.current, State.ACTIVE),
      addX.current,
      set(offsetX.current, addX.current),
    ),
  );
  const transY = useRef(
    cond(
      eq(gestureState.current, State.ACTIVE),
      addY.current,
      set(offsetY.current, addY.current),
    ),
  );

  return (
    <Container>
      <PanGestureHandler
        onGestureEvent={onGestureEvent.current}
        onHandlerStateChange={onGestureEvent.current}>
        <Animated.View
          style={[
            styles.box,
            {
              transform: [
                {
                  translateX: transX.current,
                },
                {
                  translateY: transY.current,
                },
              ],
            },
          ]}
        />
      </PanGestureHandler>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const BOX_SIZE = 100;

const styles = StyleSheet.create({
  box: {
    height: BOX_SIZE,
    width: BOX_SIZE,
    backgroundColor: 'white',
    position: 'absolute',
  },
});

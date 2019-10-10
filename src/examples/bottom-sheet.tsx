import React, {useRef} from 'react'
import {Dimensions, StyleSheet} from 'react-native'
import {PanGestureHandler, State} from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import {Template} from '../shared'

const {
  add,
  Clock,
  clockRunning,
  cond,
  eq,
  event,
  greaterThan,
  lessThan,
  set,
  spring,
  startClock,
  stopClock,
  sub,
  Value,
} = Animated

export function BottomSheetExample() {
  const {clock, gestureState, startY} = useRef({
    clock: new Clock(),
    gestureState: new Value(-1),
    startY: new Value(initialStartY),
  }).current

  const dragY = new Value(0)
  const candidateY = add(startY, dragY)
  const newY = cond(
    lessThan(candidateY, minStartY),
    minStartY,
    cond(greaterThan(candidateY, maxStartY), maxStartY, candidateY),
  )
  const snapPoint = cond(
    lessThan(sub(screen.height, newY, initialStartY), newY),
    initialStartY,
    screen.height,
  )

  const vector = cond(lessThan(startY, snapPoint), VECTOR, -VECTOR)
  const distance = vector
  const newStartY = add(startY, distance)

  const translateY = useRef(
    cond(
      eq(gestureState, State.ACTIVE),
      newY,
      cond(
        eq(gestureState, State.END),
        cond(
          eq(startY, newY),
          [stopClock(clock), set(startY, newY)],
          cond(clockRunning(clock), set(startY, newStartY), [
            startClock(clock),
            set(startY, newY),
          ]),
        ),
        startY,
      ),
    ),
  ).current

  const handlePan = useRef(
    event([
      {
        nativeEvent: {
          translationY: dragY,
          state: gestureState,
        },
      },
    ]),
  ).current

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
  )
}

const BAR_HEIGHT = 82
const VECTOR = 50

const screen = Dimensions.get('screen')
const initialStartY = screen.height - BAR_HEIGHT
const sheetHeight = screen.height * 1.5
const minStartY = screen.height - sheetHeight
const maxStartY = screen.height - BAR_HEIGHT

function runSpring(
  clock: Animated.Clock,
  value: Animated.Value<number>,
  velocity: number,
  dest: number,
) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  }

  const config = {
    damping: 7,
    mass: 1,
    stiffness: 121.6,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
  }

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    height: sheetHeight,
    width: screen.width,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'tomato',
  },
})

import React, {useRef} from 'react'
import {Dimensions, StyleSheet} from 'react-native'
import {PanGestureHandler, State} from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import {Template} from '../shared'

const {
  add,
  block,
  Clock,
  clockRunning,
  cond,
  eq,
  event,
  not,
  set,
  spring,
  SpringUtils,
  startClock,
  stopClock,
  Value,
} = Animated

export function BottomSheetExample() {
  const {clock, dragY, dragVY, gestureState, positionY} = useRef({
    clock: new Clock(),
    dragY: new Value(0),
    dragVY: new Value(0),
    gestureState: new Value(-1),
    positionY: new Value(initialPositionY),
  }).current

  const handlePan = useRef(
    event([
      {
        nativeEvent: {
          translationY: dragY,
          velocityY: dragVY,
          state: gestureState,
        },
      },
    ]),
  ).current
  // const candidateY = add(position, dragY)
  // const newY = cond(
  //   lessThan(candidateY, minStartY),
  //   minStartY,
  //   cond(greaterThan(candidateY, maxStartY), maxStartY, candidateY),
  // )
  // const snapPoint = cond(
  //   lessThan(sub(screen.height, newY, initialPositionY), newY),
  //   initialPositionY,
  //   screen.height,
  // )

  // const vector = cond(lessThan(startY, snapPoint), VECTOR, -VECTOR)
  // const distance = vector
  // const newStartY = add(startY, distance)
  const newPositionY = add(positionY, dragY)

  const translateY = useRef(
    cond(
      eq(gestureState, State.ACTIVE),
      [stopClock(clock), newPositionY],
      cond(
        eq(gestureState, State.END),
        [
          set(positionY, add(positionY, dragY)),
          runSpring(clock, positionY, initialPositionY, dragVY),
          positionY,
        ],
        positionY,
      ),
    ),
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
const initialPositionY = screen.height - BAR_HEIGHT
const sheetHeight = screen.height * 1.5
const minStartY = screen.height - sheetHeight
const maxStartY = screen.height - BAR_HEIGHT

function runSpring(
  clock: Animated.Clock,
  value: Animated.Value<number>,
  dest: number,
  velocity: Animated.Value<number>,
) {
  const state: Animated.SpringState = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  }

  const config: Animated.SpringConfig = {
    ...SpringUtils.makeDefaultConfig(),
    damping: new Value(30),
    mass: new Value(1),
    stiffness: new Value(300),
  }

  return block([
    cond(not(clockRunning(clock)), [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue as Animated.Value<number>, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    set(value, state.position),
  ])
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

import React, {useMemo, useRef} from 'react'
import {Dimensions, StyleSheet} from 'react-native'
import {PanGestureHandler, State} from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import {Template} from '../shared'

const {
  add,
  block,
  call,
  Clock,
  clockRunning,
  cond,
  diff,
  divide,
  eq,
  event,
  greaterThan,
  lessThan,
  multiply,
  set,
  startClock,
  stopClock,
  sub,
  Value,
} = Animated

export function BottomSheetExample() {
  const gestureState = new Value(State.UNDETERMINED)
  const startY = new Value(initialStartY)
  const dragY = new Value(0)
  const candidateY = add(startY, dragY)
  const newY = cond(
    lessThan(candidateY, minStartY),
    minStartY,
    cond(greaterThan(candidateY, maxStartY), maxStartY, candidateY),
  )

  const isActive = eq(gestureState, State.ACTIVE)
  // const isEnd = eq(gestureState, State.END)
  const isEnd = block([
    call([eq(gestureState, State.END)], log),
    eq(gestureState, State.END),
  ])
  const isSnapped = eq(startY, newY)

  const snapPoint = cond(
    lessThan(sub(screen.height, newY, initialStartY), newY),
    initialStartY,
    screen.height,
  )

  const clock = new Clock()

  const vector = cond(lessThan(startY, snapPoint), VECTOR, -VECTOR)
  // const dt = divide(diff(clock), 1000)
  // const distance = multiply(vector, dt)
  const distance = vector
  const newStartY = add(startY, distance)

  function log(...args) {
    console.log(...args)
  }

  const translateY = useRef(
    cond(
      isActive,
      newY,
      cond(
        isEnd,
        cond(
          isSnapped,
          [call([], () => log('stop')), stopClock(clock), set(startY, newY)],
          cond(
            clockRunning(clock),
            [call([distance, newStartY], log), set(startY, newStartY)],
            [startClock(clock), set(startY, newY)],
          ),
          // [
          //   call([clockRunning(clock), diff(clock), newStartY], log),
          //   startClock(clock),
          //   set(startY, newStartY),
          // ],
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

function runSpring(clock, value, velocity, dest) {
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

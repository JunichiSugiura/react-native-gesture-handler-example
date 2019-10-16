import React, {useRef} from 'react'
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {PanGestureHandler, State} from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import {Template} from '../shared'

const {
  abs,
  add,
  block,
  Clock,
  clockRunning,
  cond,
  eq,
  event,
  lessThan,
  multiply,
  not,
  set,
  spring,
  SpringUtils,
  startClock,
  stopClock,
  sub,
  Value,
} = Animated

interface IProps {
  snapPoints?: number[]
}

export function BottomSheetExample({
  snapPoints = [initialPositionY, screen.height / 2, 0],
}: IProps) {
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

  const newPositionY = add(positionY, dragY)
  const translateY = useRef(
    cond(
      eq(gestureState, State.ACTIVE),
      [stopClock(clock), newPositionY],
      cond(
        eq(gestureState, State.END),
        [
          set(positionY, newPositionY),
          runSpring(
            clock,
            positionY,
            snapPoint(positionY, dragVY, snapPoints),
            dragVY,
          ),
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
          style={[styles.bottomSheet, {transform: [{translateY}]}]}>
          <Button onPress={() => {}}>Snap 1</Button>
          <Button onPress={() => {}}>Snap 2</Button>
          <Button onPress={() => {}}>Snap 3</Button>
        </Animated.View>
      </PanGestureHandler>
    </Template>
  )
}

const BAR_HEIGHT = 82

const screen = Dimensions.get('screen')
const initialPositionY = screen.height - BAR_HEIGHT

function snapPoint(
  position: Animated.Value<number>,
  dragV: Animated.Value<number>,
  snapPoints: number[],
): Animated.Node<number> {
  const sortedPoints = snapPoints
    .sort((p1, p2) => p1 - p2)
    .map(p => new Value(p))
  const destination = add(position, multiply(0.4, dragV))
  const diffs = sortedPoints.map(value => abs(sub(destination, value)))

  function currentSnapPoint(i = 0): Animated.Node<number> {
    return i === sortedPoints.length - 1
      ? block([sortedPoints[i]])
      : cond(
          lessThan(diffs[i], diffs[i + 1]),
          sortedPoints[i],
          currentSnapPoint(i + 1),
        )
  }

  return currentSnapPoint()
}

function runSpring(
  clock: Animated.Clock,
  value: Animated.Value<number>,
  dest: number | Animated.Node<number>,
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
    height: screen.height,
    width: screen.width,
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'stretch',
    paddingTop: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
})

interface IButtonProps {
  children: string
  onPress: () => void
}

function Button({children, onPress}: IButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <Text>{children}</Text>
    </TouchableOpacity>
  )
}

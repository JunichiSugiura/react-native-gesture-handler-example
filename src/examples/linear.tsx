import React, {useEffect, useRef, useState} from 'react'
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native'
import Animated, {Easing} from 'react-native-reanimated'
import styled from 'styled-components/native'

import {Template} from '../shared'

const {
  block,
  call,
  Clock,
  clockRunning,
  cond,
  debug,
  diff,
  divide,
  eq,
  neq,
  not,
  set,
  startClock,
  stopClock,
  timing,
  Value,
} = Animated
export function LinearExample() {
  const {clock, playerState, translateX} = useRef({
    clock: new Clock(),
    playerState: new Value<PlayerState>(PlayerState.PAUSED),
    translateX: new Value(initialX),
  }).current
  const [isPlaying, setIsPlaying] = useState(false)

  Animated.useCode(
    block([
      cond(
        playerState,
        [
          cond(eq(translateX, destinationX), set(translateX, initialX)),
          runTiming(clock, translateX, destinationX, 1000, () => {
            setIsPlaying(false)
          }),
        ],
        [stopClock(clock)],
      ),
    ]),
    [playerState],
  )

  useEffect(() => {
    playerState.setValue(isPlaying ? PlayerState.PLAYING : PlayerState.PAUSED)
  }, [isPlaying])

  return (
    <Template>
      <Container
        onPress={() => {
          setIsPlaying(!isPlaying)
        }}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.clock,
            {
              transform: [{translateX}],
            },
          ]}
        />
      </Container>
    </Template>
  )
}

enum PlayerState {
  PAUSED,
  PLAYING,
}

function runTiming(
  clock: Animated.Clock,
  value: Animated.Value<number>,
  dest: number,
  duration: number,
  onFinished?: () => void,
) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  }

  const config = {
    duration,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  }

  return block([
    debug('clock: ', clock),
    debug('position: ', state.position),
    cond(not(clockRunning(clock)), [
      set(state.finished, 0),
      set(state.time, clock),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, [
      stopClock(clock),
      call([], () => onFinished && onFinished()),
    ]),
    set(value, state.position),
  ])
}

const BOX_SIZE = 10
const HORIZONTAL_PADDING = 10
const screen = Dimensions.get('screen')
const initialY = (screen.height - BOX_SIZE) / 2
const initialX = HORIZONTAL_PADDING
const destinationX = screen.width - HORIZONTAL_PADDING - BOX_SIZE

const styles = StyleSheet.create({
  clock: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: 'white',
    top: initialY,
  },
})

const Container = styled.TouchableOpacity`
  flex: 1;
`

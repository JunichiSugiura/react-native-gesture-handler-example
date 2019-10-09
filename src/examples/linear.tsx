import React, {useRef} from 'react'
import {Dimensions, StyleSheet} from 'react-native'
import Animated, {Easing} from 'react-native-reanimated'
import styled from 'styled-components/native'

import {Template} from '../shared'

const {
  block,
  Clock,
  clockRunning,
  cond,
  debug,
  diff,
  divide,
  set,
  startClock,
  stopClock,
  timing,
  Value,
} = Animated
export function LinearExample() {
  const clock = useRef(new Clock()).current
  const translateX = useRef(
    block([runTiming(clock, initialX, screen.width, 1000)]),
  ).current

  return (
    <Template>
      <Container>
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

function runTiming(
  clock: Animated.Clock,
  value: number,
  dest: number,
  duration: number,
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
    debug('clock: ', divide(diff(clock), 1000)),
    cond(clockRunning(clock), set(config.toValue, dest), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ])
}

const BOX_SIZE = 10
const screen = Dimensions.get('screen')
const initialY = (screen.height - BOX_SIZE) / 2
const initialX = 0

const styles = StyleSheet.create({
  clock: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: 'white',
    top: initialY,
  },
})

const Container = styled.View`
  flex: 1;
`

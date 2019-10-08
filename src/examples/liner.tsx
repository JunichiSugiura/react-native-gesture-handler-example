import React, {useRef, useState} from 'react'
import {Dimensions, StyleSheet, Text} from 'react-native'
import {TapGestureHandler, State} from 'react-native-gesture-handler'
import Animated, {Easing} from 'react-native-reanimated'
import styled from 'styled-components/native'

import {Template} from '../shared'

const {
  add,
  block,
  Clock,
  clockRunning,
  call,
  cond,
  diff,
  divide,
  eq,
  event,
  not,
  multiply,
  set,
  startClock,
  stopClock,
  timing,
  Value,
} = Animated

function runTiming(clock: Animated.Clock, value: number, dest: number) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  }

  const config = {
    duration: 5000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  }

  return block([
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

export function LinerExample() {
  const clock = useRef(new Clock()).current

  const translateX = useRef(runTiming(clock, 0, 100)).current

  // Animated.useCode(startClock(clock), [])

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
          ]}></Animated.View>
      </Container>
    </Template>
  )
}

const VECTOR = 1
const BOX_SIZE = 10
const screen = Dimensions.get('screen')
const initailY = (screen.height - BOX_SIZE) / 2
const initailX = 30

const styles = StyleSheet.create({
  clock: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: 'white',
    top: initailY,
  },
})

const Container = styled.View`
  flex: 1;
`

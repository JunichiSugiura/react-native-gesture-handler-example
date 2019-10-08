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

export function LinerExample() {
  const clock = new Clock()

  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  }

  const config = {
    duration: new Value(1),
    toValue: new Value(0),
    easing: Easing.inOut(Easing.linear),
  }

  const translateX = useRef(
    cond(
      clockRunning(clock),
      [
        call([], () => console.log('running')),
        set(state.position, add(state.position, 1)),
      ],
      block([
        startClock(clock),
        timing(clock, state, config),
        cond(state.finished, stopClock(clock)),
        state.position,
      ]),
    ),
  ).current

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

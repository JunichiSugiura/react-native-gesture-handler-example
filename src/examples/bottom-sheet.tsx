import React, {useMemo, useRef} from 'react'
import {Dimensions, StyleSheet} from 'react-native'
import {PanGestureHandler, State} from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import {Template} from '../shared'

const {add, cond, eq, event, lessThan, set, Value} = Animated

export function BottomSheetExample() {
  const startY = useRef(new Value(initialStartY)).current
  const dragY = useRef(new Value(0)).current
  const candidateY = useRef(add(startY, dragY)).current
  const newY = useRef(
    cond(lessThan(candidateY, minStartY), minStartY, candidateY),
  ).current
  const gestureState = useRef(new Value(State.UNDETERMINED)).current
  const translateY = useRef(
    cond(eq(gestureState, State.ACTIVE), newY, set(startY, newY)),
  ).current

  const handlePan = useMemo(
    () =>
      event([
        {
          nativeEvent: {
            translationY: dragY,
            state: gestureState,
          },
        },
      ]),
    [],
  )

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

const screen = Dimensions.get('screen')
const initialStartY = screen.height - BAR_HEIGHT
const sheetHeight = screen.height * 1.5
const minStartY = screen.height - sheetHeight

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

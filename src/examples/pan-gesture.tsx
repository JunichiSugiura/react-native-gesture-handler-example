import React, {useCallback, useMemo, useRef, useState} from 'react'
import {Alert, Dimensions, StyleSheet} from 'react-native'
import {PanGestureHandler, State} from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import styled from 'styled-components/native'

import {Template} from '../shared'

const screen = Dimensions.get('screen')

const {add, call, cond, eq, event, interpolate, set, Value} = Animated

export function PanGestureExample() {
  const [showBox, setShowBox] = useState(true)
  const onDrop = useCallback(([x, y]) => {
    if (x > screen.width / 2 && y > screen.height - DUMPSTER_RADIUS) {
      Alert.alert('Removed')
      setShowBox(false)
    }
  }, [])

  const gestureState = useRef(new Value(State.UNDETERMINED)).current
  const startX = useRef(new Value((screen.width - BOX_SIZE) / 2)).current
  const startY = useRef(new Value((screen.height - BOX_SIZE) / 2)).current
  const dragX = useRef(new Value(0)).current
  const dragY = useRef(new Value(0)).current
  const newX = useRef(add(startX, dragX)).current
  const newY = useRef(add(startY, dragY)).current
  const translateX = useRef(
    cond(eq(gestureState, State.ACTIVE), newX, set(startX, newX)),
  ).current
  const translateY = useRef(
    cond(eq(gestureState, State.ACTIVE), newY, [
      cond(
        eq(gestureState, State.END),
        [call([newX, newY], onDrop), set(startY, newY)],
        set(startY, newY),
      ),
    ]),
  ).current
  const opacity = useRef(
    interpolate(translateY, {
      inputRange: [0, screen.height],
      outputRange: [1, 0.1],
    }),
  ).current

  const handleGesture = useMemo(
    () =>
      event([
        {
          nativeEvent: {
            translationX: dragX,
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
        onGestureEvent={handleGesture}
        onHandlerStateChange={handleGesture}>
        {showBox ? (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.box,
              {
                opacity,
                transform: [{translateX, translateY}],
              },
            ]}
          />
        ) : (
          <RestoreContainer>
            <RestoreButton onPress={() => setShowBox(true)}>
              <RestoreText>Restore</RestoreText>
            </RestoreButton>
          </RestoreContainer>
        )}
      </PanGestureHandler>
      <Dumpster>
        <DumpsterText>Trush</DumpsterText>
      </Dumpster>
    </Template>
  )
}

const BOX_SIZE = 100

const styles = StyleSheet.create({
  container: {flex: 1},
  box: {
    zIndex: 100,
    height: BOX_SIZE,
    width: BOX_SIZE,
    backgroundColor: 'tomato',
    borderRadius: 16,
  },
})

const DUMPSTER_RADIUS = screen.width / 2
const Dumpster = styled.View`
  position: absolute;
  bottom: -${DUMPSTER_RADIUS};
  right: -${DUMPSTER_RADIUS};
  height: ${DUMPSTER_RADIUS * 2};
  width: ${DUMPSTER_RADIUS * 2};
  border-radius: ${DUMPSTER_RADIUS};
  border-width: 1;
  border-style: dashed;
  border-color: white;
`

const DumpsterText = styled.Text`
  color: white;
  position: absolute;
  top: ${DUMPSTER_RADIUS / 2};
  left: ${DUMPSTER_RADIUS / 2};
`

const RestoreContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const RestoreButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`

const RestoreText = styled.Text`
  color: white;
`

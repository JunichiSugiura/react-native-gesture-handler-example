import {NavigationNativeContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import styled from 'styled-components/native';

import {PanGestureExample, BottomSheetExample} from './examples/index';

export function App() {
  return (
    <NavigationNativeContainer>
      <RootStack.Navigator
        initialRouteName="Menu"
        screenOptions={{
          headerStyle: {
            backgroundColor: 'black',
            shadowOpacity: 0,
            elevation: 0,
          },
          headerBackTitleVisible: false,
          headerTintColor: 'white',
          cardStyle: {backgroundColor: 'black'},
        }}>
        <RootStack.Screen name="Menu" component={Menu} />
        {Object.values(LIST).map(({name, component}) => (
          <RootStack.Screen name={name} component={component} key={name} />
        ))}
      </RootStack.Navigator>
    </NavigationNativeContainer>
  );
}

const RootStack = createStackNavigator();

const LIST = {
  bottomSheet: {name: 'Bottom Sheet', component: BottomSheetExample},
  panGesture: {name: 'Pan Gesture', component: PanGestureExample},
};

export function Menu({
  navigation,
}: {
  navigation: {navigate: (name: string) => void};
}) {
  return (
    <Container>
      {Object.values(LIST).map(({name}) => (
        <Row onPress={() => navigation.navigate(name)} key={name}>
          <RowTitle>{name}</RowTitle>
        </Row>
      ))}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const Row = styled.TouchableOpacity`
  padding-horizontal: 16;
  flex-direction: row;
  align-items: center;
  height: 40;
`;

const RowTitle = styled.Text`
  color: white;
`;

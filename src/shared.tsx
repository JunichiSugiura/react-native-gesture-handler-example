import {useNavigation} from '@react-navigation/core';
import React from 'react';
import styled from 'styled-components/native';

interface ITemplateProps {
  children: JSX.Element | JSX.Element[];
}

export function Template({children}: ITemplateProps) {
  const navigation = useNavigation();
  return (
    <TemplateContainer>
      <BackContainer onPress={navigation.goBack}>
        <BackText>back</BackText>
      </BackContainer>
      {children}
    </TemplateContainer>
  );
}

const TemplateContainer = styled.View`
  flex: 1;
`;

const BackContainer = styled.TouchableOpacity`
  height: 40;
  padding-horizontal: 16;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 40;
  left: 20;
  background: white;
  border-radius: 20;
`;

const BackText = styled.Text`
  color: black;
  font-size: 16;
`;

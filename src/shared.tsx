import React from 'react'
import styled from 'styled-components/native'

interface ITemplateProps {
  children: JSX.Element | JSX.Element[]
}

export function Template({children}: ITemplateProps) {
  return <TemplateContainer>{children}</TemplateContainer>
}

const TemplateContainer = styled.View`
  flex: 1;
`

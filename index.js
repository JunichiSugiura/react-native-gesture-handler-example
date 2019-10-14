/**
 * @format
 */
import {YellowBox} from 'react-native'

import {AppRegistry} from 'react-native'
import {App} from './src/app'
import {name as appName} from './app.json'

YellowBox.ignoreWarnings(['Remote debugger', '`-[RCTRootView'])

AppRegistry.registerComponent(appName, () => App)

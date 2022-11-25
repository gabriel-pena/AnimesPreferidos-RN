/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useReducer } from 'react';
import {
  Link,
  Text,
  HStack,
  Center,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  VStack,
  Code,
  extendTheme,
  StatusBar,
  themeTools,
  Box,
  Pressable,
} from 'native-base';
import NativeBaseIcon from './src/components/NativeBaseIcon';
import { Animated, Dimensions } from 'react-native';
import HomeTab from './tabs/HomeTab';
import { SceneMap, TabView } from 'react-native-tab-view';
import MarkedTab from './tabs/MarkedTab';
import customTheme from './theme';
import { markedsAnimesinitialState, markedsAnimesReducer } from './reducers/markedsAnimes';
import Anime from './models/Anime';

const initialLayout = { width: Dimensions.get('window').width };


const storeInitial:any = {
  markedsAnimesState: null,
  markedsAnimesDispatch: null,
}

const ReducerContext = React.createContext(storeInitial);

export function useGlobalReducer() {
  return React.useContext(ReducerContext);
}

const renderScene = SceneMap({
  home: HomeTab,  
  marked: MarkedTab,
});

const App = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'À Marcar' },
    { key: 'marked', title: 'Marcados' },
  ]);
  const [markedsAnimesState, markedsAnimesDispatch] = useReducer(markedsAnimesReducer, markedsAnimesinitialState);
  const [loadingStore, setLoadingStore] = React.useState(true);

  const store = {
    markedsAnimesState,
    markedsAnimesDispatch,
  };

  const loadStore = async () => {
    await Anime.getMarkedsAnimes(markedsAnimesDispatch);
    setLoadingStore(false);
  }

  React.useEffect(() => {
    loadStore();
  }, []);


  const renderTabBar = (props: any) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <Box flexDirection="row" style={{ backgroundColor: customTheme.colors.blueGray[800] }}>
        {props.navigationState.routes.map((route: any, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex: any) =>
              inputIndex === i ? 1 : 0.5
            ),
          });
          const color = index === i ? '#ffffff' : '#ffffff';
          const borderColor = index === i ? 'cyan.500' : 'coolGray.900';

        return (
          <Pressable
          borderBottomWidth="3"
          borderColor={borderColor}
          flex={1}
          key={route.key}
          alignItems="center"
          p="3"
            onPress={() => {
              console.log(i);
              setIndex(i);
            }}>
                <Animated.Text style={{ color }}>{route.title}</Animated.Text>
          </Pressable>
        );
      })}
    </Box>
  );
};

  return (
    <NativeBaseProvider theme={customTheme}>
      <ReducerContext.Provider value={store}>
        <StatusBar backgroundColor={customTheme.colors.blueGray[700]} />
        <Box style={{ backgroundColor: customTheme.colors.blueGray[800], padding: 15 }}>
          <Heading>Animes TOP</Heading>
        </Box>
        {!loadingStore && (
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            style={{ marginTop: 0 }}
            lazy={true}
          />
        )}
      </ReducerContext.Provider>
    </NativeBaseProvider>
  );
};
export default App;

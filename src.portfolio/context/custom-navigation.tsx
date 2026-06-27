import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

// 1. Define the Types for our Router
(() => {
  /* We define our routes as an array of objects representing history.
    Example: [{ name: 'Home' }, { name: 'Details', params: { id: '123' } }]
  */
})();

interface Route {
  name: string;
  params?: any;
}

interface NavigationContextType {
  currentRoute: Route;
  push: (screenName: string, params?: any) => void;
  pop: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// 2. The Custom Screen Wrapper Component (Like Stack.Screen)
interface ScreenProps {
  name: string;
  component: React.ComponentType<any>;
}

export const CustomScreen: React.FC<ScreenProps> = () => {
  // This component acts purely as a configuration rule declarations block.
  // Our main Navigator container will parse its props.
  return null;
};

// 3. The Main Stack Navigator Engine Component
interface NavigatorProps {
  children: React.ReactElement<ScreenProps>[];
  initialRouteName: string;
}

export const CustomStackNavigator: React.FC<NavigatorProps> = ({ children, initialRouteName }) => {
  const [history, setHistory] = useState<Route[]>([{ name: initialRouteName }]);

  const currentRoute = history[history.length - 1];

  const push = (screenName: string, params?: any) => {
    setHistory((prev) => [...prev, { name: screenName, params }]);
  };

  const pop = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1)); // Remove the top element
    }
  };

  // Find the configuration matching the active route name
  const activeChild = children.find((child) => child.props.name === currentRoute.name);

  return (
    <NavigationContext.Provider value={{ currentRoute, push, pop }}>
      <View style={styles.container}>
        {activeChild ? (
          // Instantiate the screen component and pass the route params down
          <activeChild.props.component route={currentRoute} />
        ) : null}
      </View>
    </NavigationContext.Provider>
  );
};

// 4. Custom Hook for screens to consume the navigation actions
export const useCustomNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useCustomNavigation must be used within a CustomStackNavigator');
  }
  return context;
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
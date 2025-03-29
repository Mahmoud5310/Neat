import { ComponentType, LazyExoticComponent } from "react";
import { Route } from "wouter";

type ComponentProp = 
  | (() => React.JSX.Element) 
  | LazyExoticComponent<() => React.JSX.Element> 
  | ComponentType<any>;

interface CustomRouteProps {
  path: string;
  component: ComponentProp;
}

export function CustomRoute({ path, component: Component }: CustomRouteProps) {
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}
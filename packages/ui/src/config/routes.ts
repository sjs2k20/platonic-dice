import { Home } from "@pages/Home";
import { Die } from "@pages/Die";
import { Core } from "@pages/Core";
import { About } from "@pages/About";

export interface RouteConfig {
  path: string;
  label: string;
  component: React.ComponentType;
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    label: "Home",
    component: Home,
  },
  {
    path: "/die",
    label: "Die Demo",
    component: Die,
  },
  {
    path: "/core",
    label: "Core Explorer",
    component: Core,
  },
  {
    path: "/about",
    label: "About",
    component: About,
  },
];

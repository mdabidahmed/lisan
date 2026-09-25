export { Sidebar, type SidebarProps } from './Sidebar';
export { NavList, type NavListProps } from './NavList';
/* `PremiumDialog` is deliberately not re-exported. `PremiumCard` reaches it through a dynamic import
   to keep Zod out of the app-shell chunk, and a static re-export from this barrel — which the shell
   does import — would pull the module back in and undo that. */
export { PremiumCard } from './PremiumCard';

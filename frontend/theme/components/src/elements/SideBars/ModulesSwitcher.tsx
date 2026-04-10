import { ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../../components/ui/sidebar';
import { IconName, Icons } from '../Utilities/Icons';

export function ModulesSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo?: React.ElementType;
    plan: string;
    icon?: IconName;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (

    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="w-full cursor-default"
        >
          <div className="">
            <activeTeam.logo className="size-6 text-primary" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{activeTeam.name}</span>
            <span className="truncate text-xs">{activeTeam.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
    // <SidebarMenu>
    //   <SidebarMenuItem>
    //     <DropdownMenu>
    //       <DropdownMenuTrigger className="w-full">
    //         <SidebarMenuButton
    //           size="lg"
    //           className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    //         >
    //           <div className="">
    //             <activeTeam.logo className="size-6 text-primary" />
    //           </div>
    //           <div className="grid flex-1 text-left text-sm leading-tight">
    //             <span className="truncate font-medium">{activeTeam.name}</span>
    //             <span className="truncate text-xs">{activeTeam.plan}</span>
    //           </div>
    //           <ChevronsUpDown className="ml-auto" />
    //         </SidebarMenuButton>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent
    //         className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
    //         align="start"
    //         side={isMobile ? 'bottom' : 'right'}
    //         sideOffset={4}
    //       >
    //         <DropdownMenuLabel className="text-muted-foreground text-xs">
    //           Teams
    //         </DropdownMenuLabel>
    //         {teams.map((team, index) => (
    //           <DropdownMenuItem
    //             key={team.name}
    //             onClick={() => setActiveTeam(team)}
    //             className="gap-2 p-2"
    //           >
    //             <div className="flex 
    //             ">
    //               {/* {team.logo && <team.logo className="size-3.5 shrink-0" />} */}
    //               {team.icon && <Icons name={team.icon} />}
    //             </div>
    //             {team.name}
    //             {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
    //           </DropdownMenuItem>
    //         ))}
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   </SidebarMenuItem>
    // </SidebarMenu>
  );
}


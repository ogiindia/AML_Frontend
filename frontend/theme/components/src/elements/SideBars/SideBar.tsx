import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '../../components/ui/sidebar';
import { IconName } from '../Utilities/Icons';
import { ModulesSwitcher } from './ModulesSwitcher';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
export function SideBar({
  callback,
  menuData,
  switcherData,
  username,
  groupName,
  ...props
}: {
  switcherData: {
    name: string;
    logo: React.ElementType;
    plan: string;
    icon: IconName;
  }[];
} & React.ComponentProps<typeof Sidebar>) {

  React.useEffect(() => {
    console.log(username, groupName);
  }, [username, groupName]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}

        <ModulesSwitcher teams={switcherData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuData} callback={callback} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          callback={callback}
          user={{
            name: username,
            role: groupName,
            avatar: 'avatar',
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default SideBar;

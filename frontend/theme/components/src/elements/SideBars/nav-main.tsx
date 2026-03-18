'use client';

import { ChevronRight } from 'lucide-react';
import * as React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../../components/ui/sidebar';
import { Icons } from '../Utilities';

interface MenuItem {
  menuName: string;
  path?: string;
  icons?: string;
  showInMenu?: boolean;
  children?: MenuItem[];
}

interface Group {
  module: string;
  menuName: string;
  children: MenuItem[];
}

export function NavMain({
  items,
  callback,
}: {
  items: Group[];
  callback: (e) => void;
}) {
  return (
    <>
      {Object.keys(items).map((group) => (
        <SidebarGroup key={group}>
          <SidebarGroupLabel>{group}</SidebarGroupLabel>
          <SidebarMenu>
            {items[group].map((menuItem) =>
              menuItem.children && menuItem.children.length > 0 ? (
                <Collapsible
                  key={menuItem['menuName']}
                  asChild
                  defaultOpen
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={menuItem['menuName']}>
                        {menuItem['icons'] && (
                          <Icons name={menuItem['icons']} />
                        )}{' '}
                        <span>{menuItem['menuName']}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menuItem.children.map((subItem) =>
                          subItem.children && subItem.children.length > 0 ? (
                            <Collapsible
                              key={subItem['menuName']}
                              asChild
                              defaultOpen
                              className="group/collapsible"
                            >
                              <SidebarMenuSubItem>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuSubButton>
                                    <span>{subItem['menuName']}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                  </SidebarMenuSubButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <SidebarMenuSub>
                                    {subItem.children.map((dropdownItem) => {
                                      return (
                                        <SidebarMenuSubItem
                                          key={dropdownItem['menuName']}
                                        >
                                          <SidebarMenuSubButton asChild>
                                            <a
                                              href={'#'}
                                              onClick={() =>
                                                callback(
                                                  dropdownItem['path'] || '#',
                                                )
                                              }
                                            >
                                              {dropdownItem['icons'] && (
                                                <Icons
                                                  name={dropdownItem['icons']}
                                                />
                                              )}

                                              <span>
                                                {dropdownItem['menuName']}
                                              </span>
                                            </a>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      );
                                    })}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </SidebarMenuSubItem>
                            </Collapsible>
                          ) : (
                            <>
                              <SidebarMenuSubItem key={subItem['menuName']}>
                                <SidebarMenuSubButton asChild>
                                  <a
                                    href={'#'}
                                    onClick={() =>
                                      callback(subItem['path'] || '#')
                                    }
                                  >
                                    {subItem['icons'] && (
                                      <Icons name={subItem['icons']} />
                                    )}

                                    <span>{subItem['menuName']}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </>
                          ),
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <>
                  <SidebarMenuItem key={menuItem['menuName']}>
                    <SidebarMenuButton asChild tooltip={menuItem['menuName']}>
                      <a
                        href={'#'}
                        onClick={() => callback(menuItem['path'] || '#')}
                      >
                        {menuItem['icons'] && (
                          <Icons name={menuItem['icons']} />
                        )}
                        <span>{menuItem['menuName']}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

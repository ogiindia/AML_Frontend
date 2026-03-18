import { ChevronRight, File, Folder } from 'lucide-react';
import * as React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../components/ui/collapsible';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '../../components/ui/sidebar';

export function Tree({
  key,
  item,
  level,
  labelKey,
  childrenKey,
}: {
  level?: number;
  key?: any;
  item: {} | any;
  labelKey?: string;
  childrenKey?: string;
}) {
  if (Array.isArray(item)) {
    //Leaf array

    return (
      <>
        {/* {item.map((leaf, _index) => (
          <SidebarMenuButton key={_index + leaf.id} className={`pl-6 text-sm`}>
            <File />
            {leaf[labelKey] || leaf.name}
          </SidebarMenuButton>
        ))} */}

        {item.map((i, _index) => {
          if (i[childrenKey] != undefined && Array.isArray(i[childrenKey])) {
            return (
              <SidebarMenuItem key={i[labelKey]}>
                <Collapsible
                  defaultOpen={true}
                  className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <ChevronRight className="transition-transform" />
                      <Folder />
                      {i[labelKey] || i.name}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <Tree
                        level={_index + 1}
                        key={_index}
                        item={i[childrenKey]}
                        labelKey={labelKey}
                      />
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            );
          } else {
            return (
              <SidebarMenuButton
                key={_index + i[labelKey]}
                className={`pl-6 text-sm cursor-pointer`}
                onClick={(i) => console.log('into onclick' + i)}
              >
                <File />
                {i[labelKey] || i.name}
              </SidebarMenuButton>
            );
          }
        })}
      </>
    );
  }

  return (
    <>
      {Object.entries(item).map(([key, value], _index) => (
        <SidebarMenuItem key={key}>
          <Collapsible
            defaultOpen={true}
            className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <ChevronRight className="transition-transform" />
                <Folder />
                {key}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <Tree
                  labelKey={labelKey}
                  level={_index + 1}
                  key={_index}
                  item={value}
                />
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      ))}
    </>
  );
}

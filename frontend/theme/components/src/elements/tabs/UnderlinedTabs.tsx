import * as React from 'react';
import { Badge } from '../../components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';

/**
 * tabData : [ {
    name: 'Explore',
    value: 'explore',
    content: (
      <>
        Discover <span className='text-foreground font-semibold'>fresh ideas</span>, trending topics, and hidden gems
        curated just for you. Start exploring and let your curiosity lead the way!
      </>
    )
  },]
 */


export function UnderlinedTabs({ tabData = [], defaultValue }) {
  return (
    <>
      <div className="">
        <Tabs defaultValue={defaultValue} className="gap-4">
          <TabsList className="rounded-none border-b p-0">
            {tabData.length > 0 && tabData.map((tab, __index) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:border-primary dark:data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground hover:border-muted-foreground/30 h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
              >
                {tab.name} {tab.badge && <Badge>{tab.badge}</Badge>}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabData.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <p className="text-muted-foreground text-sm">{tab.content}</p>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}

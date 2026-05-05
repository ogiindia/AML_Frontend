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

          {/* TAB HEADER */}
          <TabsList className="flex gap-3 bg-transparent border-0 p-0">

            {tabData.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}

                className="
          px-5 py-2 rounded-lg
          text-white
          bg-white/10
          backdrop-blur-md
          border border-white/20
          transition-all duration-300

          hover:bg-white/20

          data-[state=active]:bg-gradient-to-r
          data-[state=active]:from-[#1f4e79]
          data-[state=active]:to-[#00AEEF]
          data-[state=active]:text-white
          data-[state=active]:shadow-lg
          data-[state=active]:border-0
        "
              >
                {tab.name}
              </TabsTrigger>
            ))}

          </TabsList>

          {/* TAB CONTENT */}
          {tabData.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="font-semibold text-sm">
                {tab.content}
              </div>
            </TabsContent>
          ))}

        </Tabs>
      </div>
    </>
  );
}

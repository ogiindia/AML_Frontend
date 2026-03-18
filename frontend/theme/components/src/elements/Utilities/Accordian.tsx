// not using in any pages just for reference and to invoke the tailwind css
import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';

function AccordianSample() {
  return (
    <>
      <Accordion
        className={`border rounded-lg bg-white shadom-sm`}
        type="single"
        collapsible
      >
        <AccordionItem className={`text-xl text-bold border-b`} value="item-1">
          <AccordionTrigger className={`px-4 py-3 text-lg font-semibold`}>
            Is it accessible?
          </AccordionTrigger>
          <AccordionContent className={`p-4 border-t bg-gray-50`}>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export default AccordianSample;

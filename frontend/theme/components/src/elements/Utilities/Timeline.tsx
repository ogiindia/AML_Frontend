import { Calendar } from 'lucide-react';
import React from 'react';

const TimelineItem = ({ title, date, description, alignLeft }: any) => (
  <div
    className={`timeline-item ${alignLeft ? 'align-left' : 'align-right'} row`}
  >
    <div className="col-md-6">
      <div className="timeline-content p-3">
        <h5 className="fw-bold">{title}</h5>
        <p className="text-muted">{date}</p>
        <p>{description}</p>
      </div>
    </div>
  </div>
);

export const Timeline = ({ data = [] }) => (
  <div className="max-w-(--breakpoint-sm) mx-auto">
    <div className="relative ml-3">
      {/* Timeline line */}
      <div className="absolute left-0 top-4 bottom-0 border-l-2" />

      {data.map(
        ({ company, description, period, technologies, title }, index) => (
          <div key={index} className="relative pl-8 pb-12 last:pb-0">
            {/* Timeline dot */}
            <div className="absolute h-3 w-3 -translate-x-1/2 left-px top-3 rounded-full border-2 border-primary bg-background" />

            {/* Content */}
            <div className="space-y-3">
              {company && (
                <div className="flex items-center gap-2.5">
                  <span className="text-base font-medium">{company}</span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{period}</span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground text-pretty">
                {description}
              </p>
              <div className="flex flex-wrap gap-2">
                {/* {technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="rounded-full"
                    >
                      {tech}
                    </Badge>
                  ))} */}
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  </div>
);

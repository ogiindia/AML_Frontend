import * as React from 'react';

export function SplitPageLayout({
  left,
  right,
  logo,
  orientation = 'left',
}: any) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {orientation === 'left' ? (
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              {
                logo && {
                  logo,
                }
                //    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                //   {/* <GalleryVerticalEnd className="size-4" /> */}
                // </div>
                // dummy
              }
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">{left}</div>
          </div>
        </div>
      ) : (
        <div className="bg-muted relative hidden lg:block">
          {/* <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
          <div className="flex flex-1">{left}</div>
        </div>
      )}

      {orientation === 'left' ? (
        <div className="bg-muted relative hidden lg:block">
          {/* <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
          <div className="flex flex-1">{right}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              {
                logo && {
                  logo,
                }
                //    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                //   {/* <GalleryVerticalEnd className="size-4" /> */}
                // </div>
                // dummy
              }
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">{right}</div>
          </div>
        </div>
      )}
    </div>
  );
}

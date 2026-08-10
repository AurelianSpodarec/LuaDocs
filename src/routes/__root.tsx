import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import * as React from 'react';
import appCss from '@/styles/app.css?url';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import SearchDialog from '@/components/search';
import { AnnouncementBar } from '@/announcement/AnnouncementBar';
import { SelectedVersionProvider } from '@/version/SelectedVersionProvider';
import { googleAnalyticsScripts } from '@/analytics/googleAnalytics';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'LuaDocs',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
    scripts: googleAnalyticsScripts(),
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider search={{ SearchDialog }}>
          {/* Above both shells and outside the router, so it is one bar that survives
              navigation rather than one per layout that remounts on every entry. */}
          <AnnouncementBar />
          <SelectedVersionProvider>
            <Outlet />
          </SelectedVersionProvider>
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}

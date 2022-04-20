require('./bootstrap');

import React from 'react';
import { render } from 'react-dom';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import { RouteContext } from '@/Hooks/useRoute';

const appName =
  window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: name => require(`./Pages/${name}.tsx`),
  setup({ el, App, props }) {
    return render(
      <RouteContext.Provider value={(window as any).route}>
        <App {...props} />
      </RouteContext.Provider>,
      el,
    );
  },
});

InertiaProgress.init({ color: '#4B5563' });

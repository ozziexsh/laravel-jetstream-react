import React from 'react';
import Welcome from '@/Jetstream/Welcome';
import AppLayout from '@/Layouts/AppLayout';

export default function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Dashboard
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            <Welcome />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

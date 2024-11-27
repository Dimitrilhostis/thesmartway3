import React from 'react';
import Layout from './components/layout/Layout';
import Calendar from './components/calendar/Calendar';

function App() {
  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)]">
        <Calendar />
      </div>
    </Layout>
  );
}

export default App;
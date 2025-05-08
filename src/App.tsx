import React from 'react';
import { PlanogramProvider } from './context/PlanogramContext';
import Header from './components/Header';
import Planogram from './components/Planogram';
import ProductInfo from './components/ProductInfo';
import Instructions from './components/Instructions';

function App() {
  return (
    <PlanogramProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 pb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:flex-grow">
              <Planogram />
            </div>
            <div className="lg:w-80">
              <ProductInfo />
            </div>
          </div>
        </main>
        <Instructions />
      </div>
    </PlanogramProvider>
  );
}

export default App;
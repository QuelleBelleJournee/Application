import React, { useState, useEffect } from 'react';
import { DriveContext, Music } from './types';
import { generatePlaylist } from './services/recommendationEngine';
import SensorControls from './components/SensorControls';
import Playlist from './components/Playlist';
import { Activity } from 'lucide-react';

const App: React.FC = () => {
  // State for the "Context" (Speed, Time, Weather)
  // In a real app, this would come from APIs or WebSockets
  const [context, setContext] = useState<DriveContext>({
    speed: 0,
    timeOfDay: 9, // 9:00 AM
    weather: 'clear'
  });

  const [playlist, setPlaylist] = useState<Music[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // The "Controller" Execution
  // Whenever the context changes, re-run the algorithm
  useEffect(() => {
    setIsProcessing(true);
    
    // Debounce slightly to simulate API latency
    const timer = setTimeout(() => {
      const newPlaylist = generatePlaylist(context);
      setPlaylist(newPlaylist);
      setIsProcessing(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [context]);

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Header / Info */}
        <div className="lg:col-span-12 mb-4 flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              AdaptiveDrive
            </h1>
            <p className="text-gray-500 text-sm">Real-time Contextual Playlist Engine</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
             <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
             {isProcessing ? 'Analyzing Context...' : 'System Active'}
          </div>
        </div>

        {/* Left Column: Sensors (Input) */}
        <div className="lg:col-span-4 space-y-6">
          <SensorControls context={context} onContextChange={setContext} />
          
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
              <Activity size={16} /> Logic Debugger
            </h3>
            <div className="text-xs font-mono text-gray-500 space-y-1">
              <p>Current Algorithm State:</p>
              <p>Rule: {context.speed > 90 ? 'HIGH_SPEED_FOCUS' : (context.timeOfDay > 20 || context.timeOfDay < 5) ? 'NIGHT_MODE_RELAX' : 'STANDARD_ADAPTIVE'}</p>
              <p>Filter: {playlist.length > 0 ? playlist[0].type.toUpperCase() : 'MIXED'} priority</p>
            </div>
          </div>
        </div>

        {/* Right Column: Playlist (Output) */}
        <div className="lg:col-span-8 bg-gray-900 rounded-2xl p-6 border border-gray-800 h-[600px] shadow-2xl">
          <Playlist tracks={playlist} />
        </div>

      </div>
    </div>
  );
};

export default App;
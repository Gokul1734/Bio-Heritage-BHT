import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './PAGES/HomePage'
import DashboardPage from './PAGES/DashboardPage'
import Organize from './PAGES/Organize'
import EventIn from './PAGES/EventIn'
import YourEvents from './PAGES/YourEvents'
import MarketPage from './PAGES/MarketPage'
import SellPage from './PAGES/SellPage'
import { useState } from 'react';
import RecentActivityPage from './PAGES/RecentActivityPage';

function App() {
  const [user,setUser] = useState(undefined)
  // const contract = '0x5B9119796E893fb3b78782b96E001dB6566e8902'
  // const contract = '0x83a1eced57c49B9a98fD1a097f603112dA73829d'
  const contract = '0xC1b3d1405DCddBD3D035F67058d13bC79AC51e20'
  return (
    <Router>
      <Routes>
        <Route path='/' element = {<HomePage contract= {contract} setUser = {setUser} />} />
        <Route path='/dashboard' element = {<DashboardPage contract={contract} user = {user} setUser = {setUser} />} />
        <Route path='/organize' element = {<Organize contract={contract} user = {user} setUser = {setUser} />} />
        <Route path='/events-in' element = {<EventIn contract={contract} user = {user} setUser = {setUser} />} />
        <Route path='/your-events' element = {<YourEvents contract={contract} user = {user} setUser = {setUser} />} />
        <Route path='/market' element = {<MarketPage contract={contract} user = {user} setUser = {setUser} />} />
        <Route path='/sell' element = {<SellPage contract={contract} user = {user} />} />
        <Route path='/recent-activity' element = {<RecentActivityPage contract={contract} user = {user} />} />
      </Routes>
    </Router>
  );
}

export default App;

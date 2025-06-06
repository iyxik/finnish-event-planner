import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import EventListPage from './Pages/EventListPage';
import FormPage from './Pages/FormPage';
import SingleEvent  from './Pages/SingleEvent';
import "./styles/MainApp.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<EventListPage />} />
                <Route path="/events/new" element={<FormPage />} />
                <Route path="/events/:id" element={<SingleEvent />} />
            </Routes>
        </Router>
    );
}

export default App;

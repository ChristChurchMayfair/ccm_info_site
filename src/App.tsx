import React from 'react';
import './App.css';
import {createClient, CreateClientParams} from 'contentful';
import { TermCard } from './components/TermCard';

let contentfulConfig: CreateClientParams = {
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN || "No Token",
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID || "No Space ID"
}

const contentful = createClient(contentfulConfig)

const App: React.FC = () => {
  return (
    <div className="App">
      <div></div>
      <TermCard termName="Autumn 2019" contentfulClient={contentful}/>
      <div></div>
    </div>
  );
}

export default App;

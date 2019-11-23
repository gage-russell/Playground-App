// in src/users.js
import React from 'react';
import DynamicView from "../components/Dashboard/DynamicView";

export const Dashboard = props => (

  <div>
    <DynamicView {...props} />
  </div>
);
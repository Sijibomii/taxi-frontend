import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import RiderRequest from './RiderRequest';
import RiderDashboard from './RiderDashboard';
import RiderDetail from './RiderDetail';
import { isRider } from '../services/AuthService';

function Rider (props) {
  if (!isRider()) {
    return <Redirect to='/' />
  }

  return (
    <Switch>
      <Route path='/rider/request' component={RiderRequest} />
      <Route path='/rider/:id' component={RiderDetail} />
      <Route component={RiderDashboard} />
    </Switch>
  )
}

export default Rider;
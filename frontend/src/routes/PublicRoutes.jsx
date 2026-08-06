import React from 'react'
import { useSelector } from 'react-redux'
import {Outlet,Navigate} from 'react-router-dom'
import { PATHS } from './paths'

const PublicRoutes = () => {
  const {isAuthenticated} = useSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to={PATHS.HOME} replace/> : <Outlet/>;
}

export default PublicRoutes;
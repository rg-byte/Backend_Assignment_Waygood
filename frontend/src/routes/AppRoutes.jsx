import React from 'react'
import {PATHS} from './paths'
import {Routes, Route, Navigate} from 'react-router-dom'
import PublicRoutes from './PublicRoutes'

import Login from "../auth/Login";
import Register from "../auth/Register";

const AppRoutes=()=>{
    return(
        <Routes>
            <Route element={<PublicRoutes/>}>
               <Route path={PATHS.LOGIN} element={<Login/>}></Route>
               <Route path={PATHS.REGISTER} element={<Register/>}></Route>
            </Route>
        </Routes>
    )
}
export default AppRoutes;
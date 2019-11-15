import React from 'react'


export default React.createContext({
    token:null,
    role:null,
    isAuth:false,
    login: (token,role) => {},
    logout: () => {},
})
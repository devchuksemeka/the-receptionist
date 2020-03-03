import React from 'react'


export default React.createContext({
    token:null,
    role:null,
    permissions:[],
    isAuth:false,
    login: (data) => {},
    logout: () => {},
})
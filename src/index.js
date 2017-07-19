import React from 'react'
import ReactDOM from 'react-dom'
import EmreOak from './components/emreOak'
import './styles/app.scss'
import { AppContainer } from 'react-hot-loader'

  ReactDOM.render(
    <AppContainer>
        <EmreOak id="ueditor" style={{height:'auto',width:800}}/>
    </AppContainer>,
    document.getElementById('main')
  )
import dashboard from './dashboard'
import history from './history'
import instances from './instances'
import notification from './notification'
import servir from './servir'
import settings from './settings'


export default [...dashboard, 
  ...servir, 
  ...instances,
  ...notification,
  ...history,
  ...settings]

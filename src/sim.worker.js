import registerPromiseWorker from 'promise-worker/register'
import massHysteriaSim from './simulate'

registerPromiseWorker((data) => {
  const { type, minions, runs } = data
  if (type === 'simulate') {
    return massHysteriaSim(minions, runs)
  }
})

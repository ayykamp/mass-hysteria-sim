import rcode from './assets/rcode'

const ocpu = window.ocpu
ocpu.seturl('https://public.opencpu.org/ocpu/library/base/R')

export default inputMinions => {
  return new Promise((resolve, reject) => {
    var mysnippet = new ocpu.Snippet(rcode + `test.mass.hysteria(stats = c(${inputMinions.join(',')}), trials = 10000)`)

    var req = ocpu.call(
      'identity',
      {
        x: mysnippet
      },
      session => {
        session.getConsole(function(outtxt) {
          let lines = outtxt.split('\n')
          lines = lines.splice(lines.indexOf('$`Minion stats`'), lines.length - 1)
          let outputMinions = []
          let result = {}
          let i = 0
          for (let line of lines) {
            if (line.match(/\[[0-9],\]/)) {
              outputMinions.push(line.split(' ').filter(_ => _ !== ''))
            } else if (line.match(/\[1\]/) && i === 0) {
              result.chanceOfBoardClear = line.split(' ')[1]
              i++
            } else if (line.match(/\[1\]/) && i === 1) {
              result.remainingEnemyDamage = line.split(' ')[1]
            }
          }
          result.minions = outputMinions
          console.log(result)
          resolve(result)
        })
      })

    req.fail(() => {
      reject('Server error: ' + req.responseText)
    })
  })
  

}

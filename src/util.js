import shortid from 'shortid'

// a: attack, h: health, d: divine shield, p: poisonous, $: unique id
export const getDefaultMinion = () => {
  return {
    a: null,
    h: null,
    d: false,
    p: false,
    $: shortid.generate()
  }
}

export const stringToBoard = (string, friendly) => {
  let board = []
  const statsRegex = /[0-9]+\/[0-9]+/gm
  
  string.split(' ').forEach((e, i) => {
    if (!e) return
    let minion = getDefaultMinion()
    let stats = e.match(statsRegex)[0].split('/')
    minion.a = stats[0]
    minion.h = stats[1]

    minion.d = e.includes('d')
    minion.p = e.includes('p')
    
    board.push({
      friendly,
      minion
    })
  })

  return board
}

export const boardToString = (board) => {
  let boardString = ''
  
  for (let minion of Object.values(board)) {
    boardString += `${minion.a}/${minion.h}${minion.d ? 'd': ''}${minion.p ? 'p': ''} `
  }
  
  return boardString
}
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

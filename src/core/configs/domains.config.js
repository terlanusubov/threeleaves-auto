export const domainsConfig = {
  10: 'https://auto.treo.az',
  20: 'https://home.treo.az',
  30: 'https://stuff.treo.az',
}

export const adPrefixConfig = {
  10: 'auto',
  20: 'property',
  30: 'listing',
}
export const getDomain = (type) => {
  return domainsConfig[type]
}

export const getAdPrefix = (type) => {
  return adPrefixConfig[type]
}


module.exports.getDate = () => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  const today  = new Date();
  const day = today.toLocaleDateString("en-US", options)

  return day
}

module.exports.getDay = () => {
  const options = {
    weekday: 'long'
  }

  const today  = new Date();
  const day = today.toLocaleDateString("en-US", options)

  return day
}

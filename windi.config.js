function range(size, startAt = 1) {
  return Array.from(Array(size).keys()).map(i => i + startAt)
}

module.exports = {
  attributify: {},
  plugins: [
    require('@windicss/plugin-icons'),
  ],
  safelist: [
    range(7).map(i => `col-start-${i}`)
  ]
}
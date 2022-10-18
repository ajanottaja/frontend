export const randomInt = (min: number, max: number) => {
  let mn = Math.ceil(min);
  let mx = Math.floor(max);
  return Math.floor(Math.random() * (mx - mn) + mn);
};

export function shuffleInPlace(array: any[]) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function shuffleSubsetInplace(values: any[], subsetIndices: number[]) {
  const subset = subsetIndices.map(index => values[index])

  shuffleInPlace(subset)

  subsetIndices.forEach((index, i) => {
    values[index] = subset[i]
  })
  return values
}
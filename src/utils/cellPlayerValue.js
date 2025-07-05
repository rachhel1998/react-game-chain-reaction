export default function cellPlayerValue(cellKey, currentPlayer, playersGameData) {
  if (playersGameData[cellKey] === '') {
    return 0;
  } else if (!playersGameData[cellKey].includes(currentPlayer.color)) {
    return -1;
  } else {
    const cellValue = parseInt(playersGameData[cellKey].split("-")[1]);
    return cellValue ? cellValue : 0;
  }
}
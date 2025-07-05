export default function cellBlastValue(cellKey, gameBoardSize){
  const [rowStr, colStr] = cellKey.split('x');
  const row = parseInt(rowStr);
  const col = parseInt(colStr);

  const isTop = row === 1;
  const isBottom = row === gameBoardSize;
  const isLeft = col === 1;
  const isRight = col === gameBoardSize;

  if ((isTop && isLeft) || (isTop && isRight) || (isBottom && isLeft) || (isBottom && isRight)) {
    return 2;
  } else if (isTop || isBottom || isLeft || isRight) {
    return 3;
  } else {
    return 4;
  }
}
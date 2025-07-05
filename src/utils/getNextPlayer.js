export default function getNextPlayer(currentPlayer, allPlayersList) {
    const currentIndex = allPlayersList.indexOf(currentPlayer);
    const nextIndex = (currentIndex + 1) % allPlayersList.length;
    return allPlayersList[nextIndex];
}
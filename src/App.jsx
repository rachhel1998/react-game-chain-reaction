import React, { useState, useEffect } from 'react';
import getNextPlayer from './utils/getNextPlayer';
import cellPlayerValue from './utils/cellPlayerValue';
import { Badge } from "@/components/ui/badge"
import cellBlastValue from './utils/cellBlastValue';
import cellCheckAndBlast from './utils/cellCheckAndBlast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"


function App() {
  const [playersList, setPlayersList] = useState([
    { id: 1, name: 'Player 1', color: 'red' },
    { id: 2, name: 'Player 2', color: 'blue' },
    { id: 3, name: 'Player 3', color: 'green' },
    { id: 4, name: 'Player 4', color: 'yellow' },
  ]);
  const [gameBoardSize, setGameBoardSize] = useState(8);
  const [isPlayersLocked, setPalyersLocked] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(playersList[0]);
  const [clickCount, setClickCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [playersGameData, setPlayersGameData] = useState(() => {
    const data = {};
    for (let row = 1; row <= gameBoardSize; row++) {
      for (let col = 1; col <= gameBoardSize; col++) {
        data[`${row}x${col}`] = '';
      }
    }
    return data;
  });

  const removePlayerByColor = (colorToRemove) => {
    setPlayersList(prevList => prevList.filter(player => player.color !== colorToRemove));
  };

  const [clickedCellInfo, setClickedCellInfo] = useState('Click a cell!');

  console.log("playersGameData", playersGameData);


  const handleCellClick = (cellKey, value) => {
    const cellOldValue = cellPlayerValue(cellKey, currentPlayer, playersGameData);
    if (cellOldValue === -1) {
      console.log('Cell is not clickable for you!');
      return;
    }

    setClickCount((prevCount) => prevCount + 1);

    setPlayersGameData((prevData) => ({
      ...prevData,
      [cellKey]: `${currentPlayer.color}-${cellOldValue + 1}`,
    }));
  };

  useEffect(() => {
    console.log("Checking blast and spin");
    if (playersList.length === 1) {
      setShowDialog(true);
      return;
    }

    const newPlayersGameData = cellCheckAndBlast(playersGameData, gameBoardSize);

    let isUpdated = false;
    for (let key in newPlayersGameData) {
      if (newPlayersGameData[key] !== playersGameData[key]) {
        isUpdated = true;
        break;
      }
    }

    if (isUpdated) {
      const timer = setTimeout(() => {
        setPlayersGameData(newPlayersGameData);
      }, 800);

      // Clear timeout if component unmounts before it fires
      return () => clearTimeout(timer);
    } else {
      const nextPlayer = getNextPlayer(currentPlayer, playersList);
      console.log("nextPlayer", nextPlayer);
      setCurrentPlayer(nextPlayer);
    }

    // eliminate player
    if (clickCount > playersList.length) {
      console.log("Eliminate player");
      let colors = [];
      for (let key in playersGameData) {
        const color = playersGameData[key].split('-')[0] ?? "";
        if (!colors.includes(color)) {
          colors.push(color);
        }
      }
      console.log("colors", colors);
      playersList.forEach(player => {
        if (!colors.includes(player.color)) {
          removePlayerByColor(player.color);
          console.log(playersList);
        }
      })
    }

  }, [playersGameData, playersList]);

  console.log("Players", playersList);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4">
      <p className='text-2xl font-bold'>{playersList.length === 1 ? "Winner: " + playersList[0].color.toLocaleUpperCase() : ""}</p>
      <div
        className="grid p-4 rounded-lg shadow-xl max-w-fit"
        style={{ gridTemplateColumns: `repeat(${gameBoardSize}, minmax(0, 1fr))` }}
      >
        {Object.entries(playersGameData).map(([key, value]) => {
          const bollColor = value.split('-')[0];
          const bollNum = parseInt(value.split('-')[1] ?? 0);
          const cellBlastVal = cellBlastValue(key, gameBoardSize);
          const cellSpinClass = cellBlastVal - bollNum == 1 ? "animate-spin" : "";
          return (
            <div
              key={key}
              className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
    font-semibold cursor-pointer border-1 border-${currentPlayer.color}-500 
    hover:cursor-pointer transition-shadow duration-200 ease-in-out`}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `inset 0 0 14px ${currentPlayer.color}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}

              onClick={() => handleCellClick(key, value)}
            >
              <div className={`grid grid-cols-2 p-0 m-0 ${cellSpinClass}`}>
                {Array.from({ length: bollNum }).map((_, i) => (
                  <Badge
                    key={i}
                    className={`bg-${bollColor}-500 w-5 h-5 rounded-full p-0 -m-[2px] transition-opacity duration-300 ease-in opacity-100`}
                  >
                    &nbsp;
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showDialog && (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Game Over!</AlertDialogTitle>
              <AlertDialogDescription>
                The player <strong>{playersList[0].color}</strong> has won the game!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* <AlertDialogCancel onClick={() => setShowDialog(false)}>Close</AlertDialogCancel> */}
              <AlertDialogAction onClick={() => window.location.reload()}>Play Again</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export default App;

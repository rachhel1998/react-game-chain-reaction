import cellBlastValue from "./cellBlastValue";

export default function cellCheckAndBlast(playersGameDataObj, gameBoardSize) {
    const playersGameData = JSON.parse(JSON.stringify(playersGameDataObj));
    for (let key in playersGameData) {
        const cellValText = playersGameData[key] ?? "";
        const cellColor = cellValText.split("-")[0] ?? "";
        const cellVal = parseInt(cellValText.split("-")[1] ?? 0);
        const blastVal = cellBlastValue(key, gameBoardSize);
        const row = parseInt(key.split("x")[0]);
        const col = parseInt(key.split("x")[1]);

        if(blastVal > cellVal){
            continue;
        }


        const key1 = `${row}x${col-1}`;
        const key1Val = parseInt((playersGameData[key1] ?? "").split("-")[1] ?? 0);
        const key2 = `${row}x${col+1}`;
        const key2Val = parseInt((playersGameData[key2] ?? "").split("-")[1] ?? 0);
        const key3 = `${row-1}x${col}`;
        const key3Val = parseInt((playersGameData[key3] ?? "").split("-")[1] ?? 0);
        const key4 = `${row+1}x${col}`;
        const key4Val = parseInt((playersGameData[key4] ?? "").split("-")[1] ?? 0);

        console.log(key1Val, key2Val, key3Val, key4Val);

        const keys = Object.keys(playersGameData);
        if(keys.includes(key1)){
            playersGameData[key1] = `${cellColor}-${key1Val+1}`
        }

        if(keys.includes(key2)){
            playersGameData[key2] = `${cellColor}-${key2Val+1}`
        }

        if(keys.includes(key3)){
            playersGameData[key3] = `${cellColor}-${key3Val+1}`
        }

        if(keys.includes(key4)){
            playersGameData[key4] = `${cellColor}-${key4Val+1}`
        }

        playersGameData[key] = "";
    }

    return playersGameData;
}
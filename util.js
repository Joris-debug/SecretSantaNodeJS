const { db, addUser, clearDatabase } = require('./database');

function assignUsers(namesArray) {
    let n = namesArray.length
    let assignArray = createArray(n)
    shuffleArray(assignArray)

    clearDatabase((err) => {
        if (err) {
            console.log("Error deleting table:", err);
            console.log("Aborting operation..");
            return;
        }

        for(let i = 0; i < n; i++) {
            addUser(i, namesArray[i], assignArray[i]);
        }
    });
}

function createArray(n) {
    let array = []
    for(let i = 0; i < n; i++) {
        array.push(i)
    }
    return array
}

function shuffleArray(array, namesArray, exclusionsArray) {
    let invalid

    do {
        let i = array.length, j, temp
        while(--i > 0) {
            j = Math.floor(Math.random() * (i + 1))
            temp = array[j]
            array[j] = array[i]
            array[i] = temp
        }

        invalid = array.some((receiver, giver) =>
            receiver == giver ||
            exclusionsArray.some(pair =>
                (pair[0] == namesArray[giver] && pair[1] == namesArray[receiver]) ||
                (pair[1] == namesArray[giver] && pair[0] == namesArray[receiver])
            )
        )
    } while (invalid)
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    assignUsers,
}
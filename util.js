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
    });

    for(let i = 0; i < n; i++) {
        addUser(namesArray[i], assignArray[i] + 1) // SQL keys start at 1 and not at 0
    }
}

function createArray(n) {
    let array = []
    for(let i = 0; i < n; i++) {
        array.push(i)
    }
    return array
}

function shuffleArray(array) {
    do {
        let i = array.length, j, temp
        while(--i > 0) {
            j = Math.floor(Math.random() * (i + 1))
            temp = array[j];
            array[j] = array[i];
            array[i] = temp;
        }
        selfAssignExists = false
        for(let i = 0; i < array.length - 1; i++) {
            if(array[i] == i) {
                selfAssignExists = true
                break
            }
        }
    } while(selfAssignExists)
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    assignUsers,
}
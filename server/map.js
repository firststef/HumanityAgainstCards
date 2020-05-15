const RoomMap = new Map();

// module.exports.RoomMap = RoomMap;


module.exports = {
  RoomMap,
  print: () => {
    for (const [key, value] of RoomMap.entries()) {
      console.log(key, value);
    }
  },
};

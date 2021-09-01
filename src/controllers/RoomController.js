const Room = require("../models/Room");

async function update(canvasUrl) {
  const updated = await Room.updateOne({
    name: "My awesome room 1",
    canvas: canvasUrl,
  });

  const room = await Room.findOne();

  console.log(room);
}

async function get() {
  return await Room.findOne();
}

async function init() {
  const rooms = await Room.find({});
  if (rooms.length === 0) {
    const room = new Room({
      name: "My awesome room 1",
      canvas: "",
    });

    await room.save();
  }
  console.log(rooms);
}

module.exports = {
  update,
  get,
  init,
};

const Counter = require("../Models/counter.model");

const getNextSequence = async (key) => {
  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  return counter.seq;
};

const ensureAtLeast = async (key, minSeq) => {
  const counter = await Counter.findOne({ key });

  if (!counter) {
    await Counter.create({ key, seq: minSeq });
    return;
  }

  if (counter.seq < minSeq) {
    await Counter.updateOne({ key, seq: { $lt: minSeq } }, { $set: { seq: minSeq } });
  }
};

module.exports = {
  getNextSequence,
  ensureAtLeast,
};

module.exports = function(db) {
    const collection1 = db.collection('collection1');
    const collection2 = db.collection('collection2');
  
    return collection1.aggregate([
      {
        $lookup: {
          from: 'collection2',
          localField: 'field1',
          foreignField: 'field2',
          as: 'results'
        }
      }
    ]);
  };
const miner = require('html-miner');

exports.scrape = (html) => {
  return miner(html.data, {
    itemList: {
      _each_: '.title-row',
      item: '.title',
      price: '.price'
    }
  });
};
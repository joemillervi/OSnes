import constants from './constants';

let actions = {
  tallyVotes: function (voteCount) {
    return {
      type: constants.TALLY_VOTES,
      payload: {
        voteCount: voteCount // is an object
      }
    };
  }
};

export default actions;

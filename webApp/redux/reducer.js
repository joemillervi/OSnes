import actions from './actions';

let reducer = function (state, action) {
  switch (action.type) {
    case 'TALLY_VOTES':
      return Object.assign({}, state, {
        votes: [
          action.payload.voteCount['a'] || 0,
          action.payload.voteCount['b'] || 0,
          action.payload.voteCount['up'] || 0,
          action.payload.voteCount['right'] || 0,
          action.payload.voteCount['down'] || 0,
          action.payload.voteCount['left'] || 0,
          action.payload.voteCount['start'] || 0,
          action.payload.voteCount['select'] || 0
        ]
      });
      break;
    default:
      return state;
  }
};

export default reducer;

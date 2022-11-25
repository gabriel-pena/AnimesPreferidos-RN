export const markedsAnimesinitialState = {markeds: [], loaded: false, forceReload: false};

export function markedsAnimesReducer(state: any, action: { type: any; value: any; forceReload: any }) {
  switch (action.type) {
    case 'updateAll':
        return {markeds: action.value, loaded: true, forceReload: action.forceReload ? true : false};
    case 'setReloaded':
      return {...state, forceReload: false};
    default:
      throw new Error();
  }
};
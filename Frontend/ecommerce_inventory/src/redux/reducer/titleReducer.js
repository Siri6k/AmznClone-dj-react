// titleReducer.js

// Action types
export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';
export const RESET_PAGE_TITLE = 'RESET_PAGE_TITLE';

// Initial state
const initialState = {
  pageTitle: 'Niplan' // Set your default title here
};

// Reducer function
export const titleReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PAGE_TITLE:
      return {
        ...state,
        pageTitle: action.payload
      };
    case RESET_PAGE_TITLE:
      return {
        ...state,
        pageTitle: initialState.pageTitle
      };
    default:
      return state;
  }
};

// Action creators
export const setPageTitle = (title) => ({
  type: SET_PAGE_TITLE,
  payload: title
});

export const resetPageTitle = () => ({
  type: RESET_PAGE_TITLE
});
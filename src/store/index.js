import { configureStore } from '@reduxjs/toolkit';
import spaceTravelReducer from './spaceTravelSlice';

export const store = configureStore({
  reducer: {
    spaceTravel: spaceTravelReducer
  }
});

export default store;
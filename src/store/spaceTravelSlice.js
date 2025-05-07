import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SpaceTravelApi from '../services/SpaceTravelApi';

// Async thunks
export const fetchPlanets = createAsyncThunk(
  'spaceTravel/fetchPlanets',
  async () => {
    const response = await SpaceTravelApi.getPlanets();
    if (response.isError) throw new Error(response.data.message);
    return response.data;
  }
);

export const fetchSpacecrafts = createAsyncThunk(
  'spaceTravel/fetchSpacecrafts',
  async () => {
    console.log('Fetching spacecrafts...'); // Debug log
    const response = await SpaceTravelApi.getSpacecrafts();
    console.log('API Response:', response); // Debug log
    if (response.isError) throw new Error(response.data.message);
    return response.data;
  }
);

export const fetchSpacecraftById = createAsyncThunk(
  'spaceTravel/fetchSpacecraftById',
  async (id) => {
    const response = await SpaceTravelApi.getSpacecraftById({ id });
    if (response.isError) throw new Error(response.data.message);
    return response.data;
  }
);


export const buildSpacecraft = createAsyncThunk(
  'spaceTravel/buildSpacecraft',
  async (payload) => {
    const response = await SpaceTravelApi.buildSpacecraft(payload);
    if (response.isError) throw new Error(response.data.message);
    return response.data; 
  }
);

export const destroySpacecraftById = createAsyncThunk(
  'spaceTravel/destroySpacecraftById',
  async (id) => {
    const response = await SpaceTravelApi.destroySpacecraftById({ id });
    if (response.isError) throw new Error(response.data.message);
    return id;
  }
);

export const sendSpacecraftToPlanet = createAsyncThunk(
  'spaceTravel/sendSpacecraftToPlanet',
  async ({ spacecraftId, targetPlanetId }) => {
    const response = await SpaceTravelApi.sendSpacecraftToPlanet({ 
      spacecraftId, targetPlanetId 
    });
    if (response.isError) throw new Error(response.data.message);
    return { spacecraftId, targetPlanetId };
  }
);

// Selector
export const selectPlanetNameById = (state, planetId) => {
  const planet = state.spaceTravel.planets.find(p => p.id === planetId);
  return planet ? planet.name : `Unknown Planet (ID: ${planetId})`;
};

const spaceTravelSlice = createSlice({
  name: 'spaceTravel',
  initialState: {
    planets: [],
    spacecrafts: [],
    currentSpacecraft: null,
    status: 'idle',
    error: null
  },
  reducers: {
    clearCurrentSpacecraft: (state) => {
      state.currentSpacecraft = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpacecrafts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSpacecrafts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.spacecrafts = action.payload;
      })
      .addCase(fetchSpacecrafts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })  
      .addCase(fetchPlanets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlanets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.planets = action.payload;
      })
      .addCase(fetchPlanets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSpacecraftById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSpacecraft = action.payload;
      });
  }
});




export const { clearCurrentSpacecraft } = spaceTravelSlice.actions;
export default spaceTravelSlice.reducer;
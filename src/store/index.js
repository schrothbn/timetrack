import { reactive } from "vue";

const state = reactive({
  user: null,
  trackId: null,
});

const methods = {
  setUser(payload) {
    state.user = payload ? payload.user : null;
  },
  startTracking(trackId) {
    state.trackId = trackId;
  },
  stopTracking() {
    state.trackId = null;
  },
};

export default {
  state,
  methods,
};

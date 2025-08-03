function fix() {
  const state = localStorage.getItem("state");
  if (state.version) {
    return;
  } else {
    const serialisedState = JSON.stringify({ version: 1, state });
    localStorage.setItem("state", serialisedState);
  }
}
fix();

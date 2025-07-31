function fix() {
  const state = localStorage.getItem("state");
  if (state.version) {
    return;
  } else {
    localStorage.setItem("state", JSON.stringify({ version: 1, state }));
  }
}
fix();

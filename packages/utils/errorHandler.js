function handleGlobalError(error) {
}

export default {
  install(Vue) {
    Vue.config.errorHandler = (error) => handleGlobalError(error);

    window.addEventListener("error", (event) => {
      event.preventDefault();
      handleGlobalError(event.error);
    });

    window.addEventListener("unhandledrejection", (event) => {
      event.preventDefault();
      handleGlobalError(event.reason);
    });
  },
};

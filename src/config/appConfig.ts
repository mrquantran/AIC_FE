import.meta.env;

console.log(import.meta.env);

const appConfig = {
  ...import.meta.env,
};

export { appConfig };

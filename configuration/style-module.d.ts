// CSS and Sass modules: `import styles from "./index.module.css"` gives a map of class names.
declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}
declare module "*.module.scss" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

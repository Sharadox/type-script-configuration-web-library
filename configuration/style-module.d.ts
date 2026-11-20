// CSS and Sass modules: `import styles from "./index.module.css"` gives a map of class names.
declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}
declare module "*.module.scss" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}
// Global stylesheets a library ships with a component: `import "./index.css"` (rules for the whole page, such as
// what a smooth-scrolling library needs).
declare module "*.css";

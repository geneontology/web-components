import { JSX as LocalJSX } from "@geneontology/web-components/loader";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type StencilProps<T> = {
  [P in keyof T]?: Omit<T[P], "ref">;
};

type ReactProps<T> = {
  [P in keyof T]?: DetailedHTMLProps<HTMLAttributes<T[P]>, T[P]>;
};

type StencilToReact<
  T = LocalJSX.IntrinsicElements,
  U = HTMLElementTagNameMap,
> = StencilProps<T> & ReactProps<U>;

declare module "react" {
  namespace JSX {
    type IntrinsicElements = StencilToReact;
  }
}

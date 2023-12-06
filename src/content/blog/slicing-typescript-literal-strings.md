---
title: Slicing TypeScript Literal Strings
publishDate: Thu Sep 29 2022 00:00:00 GMT-0400 (Eastern Daylight Time)
excerpt: Using TypeScript’s literal inference, we can pull specific segments out of literal strings. This can help reuse types and keep our code DRY.
featureImage:
  src: '/assets/blog/slicing-typescript-literal-strings.jpg'
  alt: 'apples in a wooden box'
---

import Aside from '../../components/Aside.astro';

<small>This post was originally written for the [Echobind blog](https://echobind.com/blog).</small>

Template literal strings are a powerful feature of TypeScript that makes it easy to create and modify literal string types. In this post, we’ll look at the syntax TypeScript provides for both adding and removing parts of a literal string type. This is especially handy when creating reusable types to dynamically access object keys.

<Aside>

You can see the types used in this post in [this TypeScript playground](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAZgJwK4EsoGERLFCMC8MA3jDAFCmkCGADjQDYCmAXAIwA0pFlARlWPyrMArJ3KUYIBPwDmLAMxkAvmTJQAnjUbxkaANKN1BGAGtDIODA1aLO1Biw4IAblXXtie5mxQDRwgAGACREnvqGSt44Aa4A9LESpAB6APxumtoAmgAiKAiMwFAo4HiEAERQIDRlMAA+MGXAjDiMCDX1ZTwgUJUAtmWu7jAAGrn5hcWQxmVMcFDtDU0tbXUNCCgyABbzgxkwAAogEGiTxsFEOXkFRSVKALQho1cTtzFk8YkwqelaMEh0rWAVAgjAAYroHD4-GcQgBVAEIIEggA8YV8hgAfJFHFAAu8Ep8vmk1HsIPQUE0ACbg+zQwhoqLooyMAAeUGalLw5xQYDgrTsaAAclReoxsT4AjAUgKoMLRTBmDAwIwAG6tOIEiTfACQZFAkFgjF6VBQ9AAgpTKfkIKUGlR+JTWhBwAABAqbEA8HmUgB0oH6u1+RpN9GyIGNPOMZG17lswdNFqtjBtMFZ7LAnJg52g6zAMiULpCPL5CBglPDJrASh9IRzPPzkuj0vLEbA5G1iuVaoQziAA).

</Aside>

### Literal String Types

Most string types can represent _any_ string, the same way that a JavaScript string value could contain any string.

```typescript
let fruitName: string = 'apple';
fruitName = 'banana';
```

But sometimes a particular value should only contain _certain_ strings. A common example is a value that references the keys of an object. For that, we put the exact values the string can be in a union of [literal string types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

```typescript
const fruitCounts = { apple: 1, banana: 5, orange: 3 };
type fruitKey = 'apple' | 'banana' | 'orange';
```

<Aside>

An easier way to get the keys of an object is using `typeof` to get the type of the object and `keyof` to get the keys of that object type. It has the same effect as the manual list we wrote out above.

</Aside>

There are often situations where the literal types don’t match how the values are used. Suppose we had our `fruitKey` type, but instead of matching those keys exactly, the `fruitCounts` object had slightly different keys.

```typescript
const fruitCounts = {
  appleCount: 1,
  bananaCount: 1,
  orangeCount: 1
};
```

Rewriting our `fruitKey` list would be annoying. What if, instead, TypeScript could automatically rewrite those keys to match a new pattern?

### Template Literal Types

TypeScript provides that functionality through [template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html). They look just like JavaScript’s template literal strings - you can even interpolate other types in the middle of the literal string - but instead of string values, they transform literal string types.

```typescript
type fruitCountKey = `${fruitKey}Count`;
// type fruitCountKey = "appleCount" | "bananaCount" | "orangeCount"
```

<Aside>

Notice how the template literal type operates on each of the items in the type union, distributing the transform across all of them.

</Aside>

One thing to bear in mind is the computational complexity of generating these types. Combining a union of three types with a static string will yield a union of three types, but template literal types let you combine multiple unions together that would include every permutation.

```typescript
type YDirections = 'top' | 'center' | 'bottom';
type XDirections = 'left' | 'center' | 'right';
type Position = `${YDirections}-${XDirections}`;
// type Position = "top-center" | "top-left" | "top-right" ... [6 more]
```

<Aside>

The type above only generated 9 results, but adding more terms would increase that exponentially. At a certain point, it will give up and throw an error, but even before that point it can slow down your type checking as TypeScript generates all the possible options. Sometimes, it’s probably best to stick with `string`.

</Aside>

TypeScript [includes helpers ](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#intrinsic-string-manipulation-types)for adjusting the capitalization of literal strings too. They include `Uppercase<>`, `Lowercase<>`, `Capitalize<>`, `Uncapitalize<>`.

```typescript
type uppercaseFruitCountKey = `${Uppercase<fruitKey>}Count`;
// type fruitCountKey = "APPLECount" | "BANANACount" | "ORANGECount"
```

Suppose we were going the other way though - we had an object with keys for `appleCount`, etc. and we wanted to _remove_ `Count` from the string literal. For that, we combine template literal types with conditional types.

### Conditional Types & Inference

[Conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) are a more advanced feature of TypeScript that let you change a type based on a condition. In essence, a conditional type says “If this type _extends_ (or matches) this other type, then replace it with that type. Otherwise, replace it with yet another type.” For example, here’s a conditional type that removes `null` and `undefined` from a type union by replacing them with `never`.

```typescript
type NonNullable<Input> = Input extends null | undefined ? never : Input;
```

This type says “If `Input` is either `null` or `undefined`, replace it with `never` (which removes it from the union). Otherwise, keep `Input` in the union.”

[Conditional ](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)[_inference_](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types) takes it a step further, by tapping into TypeScript’s inference system to pull types out of other types. We can use it to unwrap a `Promise<>` type to get at the resolved value.

```typescript
type UnwrapPromise<Input> = Input extends Promise<infer ResolvedType> ? ResolvedType : Input;
```

This type says “If `Input` is a `Promise<>` type, infer what the resolved type of that promise is (the type inside the brackets of `Promise<>`), pull it out into its own type called `ResolvedType`, and have that be the final type. Otherwise, have the final type be `Input`.”

The `infer` keyword works for more than just generic `Promise<>` types too. In fact, it can be used to pull out function parameters, return values, and, yes, even parts of a template literal string.

### Template Literal Inference

Remember, we have a union of literal strings that looks like this.

```typescript
type fruitCountKey = 'appleCount' | 'bananaCount' | 'orangeCount';
```

We want to remove the “Count” from each of those strings, leaving us with just the fruit names. Or in other words, we want to pull the fruit name out into a new type. What we can do is create a template literal type that matches the `${fruitName}Count` pattern, and use `infer` to pull the fruit name into a type.

```typescript
type fruitKey = fruitCountKey extends `${infer fruitName}Count` ? fruitName : never;
// type fruitKey = "apple" | "banana" | "orange";
```

This type says “If fruitCountKey matches the pattern `${fruitName}Count`, meaning it ends with ’Count’, then grab that first part of the string, put it in a `fruitName` type, and have that be the final type. Otherwise, return never, which removes that item from the union entirely.”

And, of course, this can be be used with even more complicated patterns combining literal types, string types, and inference - such as this one which successfully pulls the domain name out of an email address.

```typescript
const emailAddress = 'team@echobind.com';
type emailDomain = typeof emailAddress extends `${string}@${infer domain}.${string}` ? domain : never;
// type emailDomain = "echobind"
```

Remember, any of these types only work in development with literal types. When the program is actually run, all of these types are removed from the code, so this doesn’t replace runtime code. Instead, these tools can help you adjust and transform your types to provide better type safety and editor auto-completion without writing a bunch of extra code.

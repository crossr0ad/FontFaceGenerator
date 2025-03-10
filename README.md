# FontFaceGenerator

Generate a CSS file to replace unattractive fonts with your desired ones

## Usage

```bash
deno run -A main.ts [InputConfig] [OutputCssPath]
```

The output .css consists of [@font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) rules that replace unattractive fonts with your desired ones.
You can apply this to all pages by browser extension like [Stylus](https://github.com/openstyles/stylus).

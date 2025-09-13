# FontFaceGenerator

Generate a CSS file to replace unattractive fonts with your desired ones

## Usage

```bash
deno run -A main.ts [InputConfig] [OutputCssPath]
```

The output .css consists of [@font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) rules that replace unattractive fonts with your desired ones.
You can apply this to all pages by browser extension like [Stylus](https://github.com/openstyles/stylus).

## About `system-ui`

You cannot replace `system-ui` by this method as the browser specifies what font is used.

For Firefox (or other Firefox-based browsers), however, you can disable this behavior by changing `layout.css.system-ui.enabled` to `false` in `about:config`.
ref. <https://connect.mozilla.org/t5/ideas/change-the-handling-of-quot-font-family-system-ui-quot/idi-p/11900>

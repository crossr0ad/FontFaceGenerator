# FontFaceGenerator

Generate a UserCSS to replace unattractive fonts with your desired ones

## Usage

```bash
bun run start [-c config] [-o outfile] [-v version]
```

The output .css consists of [@font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) rules that replace unattractive fonts with your desired ones.
You can apply this to all pages by browser extension like [Stylus](https://github.com/openstyles/stylus).

## About `system-ui`

You cannot replace `system-ui` by this method because the browser specifies what font is actually used.

For Firefox, however, you can disable this behavior by setting `layout.css.system-ui.enabled` to `false` in `about:config`.
ref. <https://connect.mozilla.org/t5/ideas/change-the-handling-of-quot-font-family-system-ui-quot/idi-p/11900>

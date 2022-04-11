# ETD URL Join


This package will join url parts together. This package was adapted from package [url-join](https://github.com/jfromaniello/url-join)
and re-written in Typescript. Few bugs was fixed.

## Getting start

First import this package

```typescript
import urlJoin from "@etherdata-blockchain/url-join";
```

Then join two parts together

```typescript
urlJoin("https://abc.com", "abc") // will output https://abc.com/abc
```


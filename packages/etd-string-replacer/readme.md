# ETD String replacer

This package will replace string like `name=${{ secret }}` where secret is world to `name=world`. If no match, it will
use empty string for replacement.

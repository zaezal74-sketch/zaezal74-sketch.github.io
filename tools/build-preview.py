#!/usr/bin/env python3
"""SoulSync — tools/build-preview.py

Builds soulsync-preview.html, the one-file copy of the app that can be sent in
a chat and opened without a server: index.html with styles.css and the local
scripts inlined in place. Remote <script src="https://..."> tags stay as they
are.

    python3 tools/build-preview.py
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def read(name):
    with open(os.path.join(ROOT, name), encoding="utf-8") as fh:
        return fh.read()


def main():
    html = read("index.html")

    def style_tag(match):
        css = read(match.group(1))
        return "<style>\n%s\n</style>" % css.rstrip()

    html = re.sub(r'<link rel="stylesheet" href="([^"]+\.css)" />', style_tag, html)

    def script_tag(match):
        js = read(match.group(1))
        return "<script>\n%s\n</script>" % js.rstrip()

    html = re.sub(r'<script src="([^"/]+\.js)"></script>', script_tag, html)

    out = os.path.join(ROOT, "soulsync-preview.html")
    with open(out, "w", encoding="utf-8") as fh:
        fh.write(html)
    print("wrote %s (%d bytes)" % (out, len(html.encode("utf-8"))))


if __name__ == "__main__":
    main()

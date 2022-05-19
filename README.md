# drafts-Make-Markdown-Link-mod

A modified version of the drafts action [[Make Markdown Link]]

Original is [Make Markdown Link | Drafts Directory🔊](https://directory.getdrafts.com/a/1qK) with a major problem for my specific usage: if the URL is pointing to a twitter, this action will fail because there's no \<title\> tag. And since I usually use this action in a chain of actions, this will prevent any further actions from executing. Thus I made the changes:

1. add regex matching for twitter links
2. if twitter link is detected, don't fail the action; just leave it as is
3. otherwise, fail the action as the original.

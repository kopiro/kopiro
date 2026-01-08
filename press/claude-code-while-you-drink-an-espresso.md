# Claude Code while you drink an espresso

![Claude Code Meme](/media/claude-code-meme.png)

We have all been there: you are on a 4 hour session with Claude Code and you really need a break; it's in the middle of a big refactoring and you desperately want an espresso.

Don't worry, you can let Claude continue working while you take break - you'll get a notification on Telegram when it needs you.

Well, all you need is to put this python script somewhere on your system - I put it in my `~/.bin` directory:

```python
#!/usr/bin/env python3
import json
import subprocess
import sys
import urllib.parse
import urllib.request

CHAT_ID = ""
BOT_TOKEN = ""

if '--test' in sys.argv:
    with open('/tmp/claude-notify.json', 'r') as f:
        stdin = f.read()
else:
    stdin = sys.stdin.read()
    with open('/tmp/claude-notify.json', 'w') as f:
        f.write(stdin)

data = json.loads(stdin)
question = data.get('tool_input', {}).get('questions', [{}])[0].get('question', '')

# Build message with options if present
options = data.get('tool_input', {}).get('questions', [{}])[0].get('options', [])
if options:
    message_parts = [question, "", "Options:"]
    for i, opt in enumerate(options, 1):
        label = opt.get('label', '')
        desc = opt.get('description', '')
        message_parts.append(f"{i}. {label}")
        if desc:
            message_parts.append(f"   {desc}")
    question = "\n".join(message_parts)


question = f"Claude: {question}"

print(f"Sending message to Telegram: {question}")

url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
post_data = urllib.parse.urlencode({
    'chat_id': CHAT_ID,
    'text': question,
}).encode()

req = urllib.request.Request(url, data=post_data)
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode(), end='')
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}: {e.reason}", file=sys.stderr)
    print(e.read().decode(), file=sys.stderr)
except urllib.error.URLError as e:
    print(f"URL Error: {e.reason}", file=sys.stderr)
```

You can also download it from [this gist](https://gist.githubusercontent.com/kopiro/23109a7e278906f8d0117f8421dab650/raw/c4d5dc6d5f32f6f0a0ee85aa16b72a82208a6234/claude-notify.py).

And then, in your `~/.claude/settings.json`, add the following:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "AskUserQuestion",
        "hooks": [
          {
            "type": "command",
            "command": "~/.bin/claude-notify"
          }
        ]
      }
    ]
  },
}
```

As for the `CHAT_ID` and `BOT_TOKEN`, you can use the `@BotFather` to get them - it's pretty straightforward:

- Start a chat with `@BotFather`
- Send `/newbot` and follow the instructions to create a new bot
- Copy the `BOT_TOKEN`
- Contact `@username_to_id_bot` and get your `CHAT_ID`

Enjoy your espresso!
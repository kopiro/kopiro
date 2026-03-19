# How to use different Git identities per directory

If you're like me, you have a personal email for your side projects and a work email for... well, work. And if you've ever accidentally committed to your company's repo with `cooldude42@gmail.com`, you know the pain.

The good news is that Git has a built-in feature for this: conditional includes. You can tell Git to automatically use different configurations based on the directory you're in.

Here's how to set it up.

### Step 1: Edit your global .gitconfig

Open your `~/.gitconfig` and add a conditional include pointing to a directory-specific config:

```gitconfig
[includeIf "gitdir:~/Work/"]
    path = ~/Work/.gitconfig
```

This tells Git: "Hey, if I'm inside any repo under `~/Work/`, also load the config from `~/Work/.gitconfig`."

### Step 2: Create your directory-specific config

Now create `~/Work/.gitconfig` with your work identity:

```gitconfig
[user]
    email = your.name@company.com
    signingkey = ssh-ed25519 AAAA...your-work-key-here
```

That's it. Any repo under `~/Work/` will now use your work email and signing key, while everything else uses your global defaults.

### Bonus: Enable commit signing globally

If you want all your commits signed (you should), add this to your global `~/.gitconfig`:

```gitconfig
[gpg]
    format = ssh

[gpg "ssh"]
    program = "/Applications/1Password.app/Contents/MacOS/op-ssh-sign"

[commit]
    gpgsign = true
```

This works great with 1Password's SSH agent, but you can also use the regular `ssh-agent` if you prefer.

### Verify it works

You can check that everything is configured correctly by running this inside a repo:

```bash
git config user.email
git config user.signingkey
git config commit.gpgsign
```

If you're in a repo under `~/Work/`, you should see your work credentials. Otherwise, you'll see your personal ones.

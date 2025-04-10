# Using C89 on a '80s Macintosh SE to solve Advent of Code 2023

#### Published on 12/3/2023

![Using C89 on a '80s Macintosh SE to solve Advent of Code 2023](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F5tqxlid54aj7vp5mvwqp.jpeg)

For this year [AdventOfCode](https://adventofcode.com/), I want to try to solve some problems using an old Macintosh SE I have lying around and the ThinkC compiler.

My goal is to learn more about the old C89 syntax and also try to get as efficient as possible with memory and CPU so that even more complex problems can be solved in reasonable time.

### Day 0

First of all, I had to resurrect the old Macintosh and make sure everything works correctly. With my surprise, the [ThinkC compiler](https://beyondloom.com/blog/thinkc.html) was already installed from 3 years ago and I managed to run a very quick "Hello world".

The IDE that comes with the ThinkC compiler, called ThinkC Project manager, it's surprisingly good for those years.

Then, I had to make sure I could still use my 1.4MB floppy disks with a modern MacBook. The TLDR is that old Macintoshs use HFS file systems and the support for this has been removed, therefore you can't just mount the floppy and see the files in the Finder of your new macOS Sonoma.

After playing a bit with macFUSE and *not* get anything working, I managed to simply mount the disk and copy the files using `hfsutils`:

```
brew install hfsutils

# Mount the floppy
sudo hmount /dev/disk6

# Copy the input data
sudo hcopy -a ~/Developer/aoc/2023/1/input.txt :1.txt

# Copy the source from the Macintosh
sudo hcopy -a :1.c ~/Developer/aoc/2023/1/main.c
```

I strangely could't open the input.txt on the Macintosh itself, but the C program I wrote is able to read the file correctly using `fopen`

### Day 1 learnings

#### Declarations at the beginning of the scope

ANSI C89 requires variables to be declared at the beginning of a scope; this is not valid (syntax error on line 3):

```c
FILE* fp = fopen("example.txt", "r");
if (fp == NULL) return;
char line[128];
```

#### snprintf doesn't exist

The safer version of [sprintf](https://cplusplus.com/reference/cstdio/snprintf/) to do string concatenation doesn't exists; no big deal, I don't really care about safety in this scenario.

#### I hit 32k limit with `int sum`

My `int sum` went negative as soon I hit the number 32k. 

I thought that this CPU was 32bit, but something it telling me that it's rather 16bit.

Switching to `unsigned long` and also making sure I use `printf("%lu", sum)` (took 20m to realize I was still using `%d`) made it work.




---

© 2025 [Flavio De Stefano](https://www.kopiro.me) • [0xEDE51005D982268E](https://www.kopiro.me/gpg.txt)
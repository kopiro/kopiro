## Kata resolution: Next bigger number with the same digits

#### Published on 7/30/2020



I would like to share with you my solution of a Kata on CodeWars.

This is the link to the kata problem: [http://www.codewars.com/kata/next-bigger-number-with-the-same-digits](http://www.codewars.com/kata/next-bigger-number-with-the-same-digits/javascript)

I solved it using Javascript, but the algorithm I created is (of course) extendable to all other programming languages.

### The problem

*You have to create a function that takes a positive integer number and returns the next bigger number formed by the same digits.*

So, just to be clear, let me give you some examples:

1. next bigger of **12** is **21**

1. next bigger of **513** is **531**

1. next bigger of **2017** is **2071**

1. next bigger of **59884848459853** is **59884848483559**

If no bigger number can be composed using those digits, you have to return **-1**.

### How I approached

Initially, I **totally misunderstood** the problem, thinking that I should find **the** biggest number of the same digits… so I simply wrote:

```js
function nextBigger(n) {
   return +String(n).split('').sort().reverse().join('');
}
```

It would be all too easy.

Therefore, I took paper & pencil and I just started writing random numbers.

I watched for 2–3 minutes, and I realized that:

1. there is a **left part** that must be the same (because we want the **next** bigger number).

1. there is a **right part** that has to change, sorting it.

1. there is a **pivot** that is between the two parts and it just increments the number to reach the next.

So, the algorithm consists of three parts.

### Find the pivot and split the parts

To find the pivot, we read the number from right to left, until we find a digit that is bigger than the previous one.

```
For number 21581957621
2158195 <-- here --> 7621
```

In this case `5` is the pivot, because `7 > 5`.

The left part is `215819`, the right part is `7621`.

### Find the substitute for the pivot

What is our substitute for the pivot?

It’s pretty simple, remember that we want the next bigger number, so we have to find the **smallest** digit (in the right part) that is **larger** than the pivot.

In this case, `6` is our substitute.

### Reorder the right part

Now, to obtain the smallest number, we just reorder the right part, only after inserting our excluded pivot (`5`) and remove the substitute (`6`).

```
7621+5-6 = 7215 → reorder → 1257
```

### Join the parts

```
215819 + 6 + 1257 = 21581961257
```

And that’s all!

## The Javascript code

The best part is obviously the algorithm, but, here the code I wrote:

```js
function nextBigger(n){
  var d = n.toString().split('');
  
  // find the pivot, the point (from right) where i > i-1
  var p = -1;
  for (var i = d.length-1; i > 0; i--) {
    if (+d[i] > +d[i-1]) {
      p = i-1;
      break;
    }
  }
  
  // if we are unable to find the pivot, skip
  if (p == -1) return p;
    
  // splice the digits in the pivot
  var right = d.splice(p);
  
  // extract pivot
  var pv = right.splice(0, 1)[0];
  
  // find the lowest number > pv
  var mm = null, mmi = null;
  for (var i = 0; i < right.length; i++) {
    if (right[i] > pv) {
      if (mm == null || right[i] < mm) {
        mm = right[i];
        mmi = i;
      }
    }
  }

  if (mmi == null) return -1;
  
  right.splice(mmi, 1);
  right.push(pv);
  right = right.sort();
  
  // concat the left + new pivot + right part
  var ret = +d.concat([mm]).concat(right).join('');
  if (ret < n) return -1;
  
  return ret;
}
```


---

© 2025 [Flavio De Stefano](https://www.kopiro.me) ~ [0xEDE51005D982268E](https://www.kopiro.me/gpg.txt)
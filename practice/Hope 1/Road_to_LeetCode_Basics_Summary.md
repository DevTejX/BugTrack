# Road to LeetCode Basics --- Python Learning Summary

**Purpose:** A personal revision guide for the Python patterns practiced
so far, with examples, key ideas, common mistakes, and the current next
step.

## 1. Learning goal and study style

The goal is to progress from Python basics to recognizing common
problem-solving patterns, solving small problems, and eventually solving
LeetCode Easy problems independently.

The preferred practice method is: 1. Read the problem first. 2. Try
writing the code independently. 3. Ask for a small hint only when stuck.
4. Fix mistakes yourself where possible. 5. Keep explanations short and
focused.

When reviewing an error, identify whether it is a **syntax/indentation
issue**, a **logic issue**, or a **misunderstanding of the
problem/pattern**.

------------------------------------------------------------------------

## 2. Python foundations practiced

### Variables and assignment

Variables store values that can be updated as the program runs.

``` python
count = 0
count = count + 1
```

### Lists and indexing

-   A list stores multiple values in order.
-   Python indexes start at `0`.
-   `numbers[i]` accesses the value at index `i`.
-   `len(numbers)` gives the number of items.
-   `range(len(numbers))` loops through valid indexes.

``` python
numbers = [4, 7, 2]

for i in range(len(numbers)):
    print(i, numbers[i])
```

### `for` loops

Use a loop to process each item in a collection.

``` python
for number in numbers:
    print(number)
```

### Conditions

Use `if`, `elif`, and `else` to choose what happens.

``` python
if number > 5:
    print("Large")
else:
    print("Small")
```

### Flags and `break`

A Boolean flag such as `found = False` records whether something has
happened. `break` exits the current loop early.

``` python
found = False

for number in numbers:
    if number == 7:
        found = True
        break
```

### `append`, sets, dictionaries, and `sum`

-   `list.append(value)` adds an item to a list.
-   A `set` stores unique values and supports fast membership checks.
-   A `dict` stores key-value pairs, such as a number and its count.
-   `sum(numbers)` calculates the sum of a list.

------------------------------------------------------------------------

## 3. Patterns learned

## Pattern A --- Counting with a dictionary

**Use when:** You need to know how many times each value appears.

``` python
numbers = [4, 7, 2, 7, 4, 9, 2, 8]
counts = {}

for number in numbers:
    if number in counts:
        counts[number] += 1
    else:
        counts[number] = 1
```

After this loop, `counts` stores the frequency of every number. For
example, `counts[4]` is `2` and `counts[9]` is `1`.

### First unique number: use two passes

The first pass counts everything. The second pass finds the first number
with a count of one.

``` python
for number in numbers:
    if counts[number] == 1:
        print(number)
        break
```

For the list above, the output is `9`.

**Important lesson:** Do not try to identify the first unique number
before all counts are known. Finish counting first, then scan the
original list in order.

------------------------------------------------------------------------

## Pattern B --- Duplicate detection with a set

**Use when:** You need to know whether any value appears more than once.

``` python
numbers = [4, 7, 2, 7, 9]
seen = set()
found = False

for number in numbers:
    if number in seen:
        found = True
        break
    else:
        seen.add(number)

if found:
    print("True")
else:
    print("False")
```

**How it works:** 1. `seen` remembers values already visited. 2. If the
current value is already in `seen`, a duplicate exists. 3. Otherwise,
add the value to `seen`. 4. Stop as soon as a duplicate is found.

You also practiced checking pairs with nested loops before learning the
set-based approach.

------------------------------------------------------------------------

## Pattern C --- Two Sum with a dictionary

**Use when:** You need two numbers whose sum equals a target, and the
answer requires their indexes.

``` python
numbers = [3, 5, 4, 8]
target = 9
seen = {}

for i in range(len(numbers)):
    need = target - numbers[i]

    if need in seen:
        print(seen[need], i)
        break
    else:
        seen[numbers[i]] = i
```

Output: `0 2`, representing the indexes of `3` and `4`.

**Key idea:** For each number, calculate the missing value:
`need = target - current_number`. Check whether that value has already
been seen. If not, store the current number and its index.

**Common mistake to avoid:** Check for the needed number before storing
the current number. This helps avoid matching a number with itself.

------------------------------------------------------------------------

## Pattern D --- Two pointers for a palindrome

**Use when:** You compare values from opposite ends of a sequence.

The idea: 1. Start one pointer at the beginning and one at the end. 2.
Compare the two values. 3. If they differ, it is not a palindrome. 4.
Move the left pointer right and the right pointer left. 5. Continue
until the pointers meet or cross.

The pattern was practiced with strings such as `"madam"` and `"radarx"`.

A common approach is to start with `found = True`, then set it to
`False` if a mismatch is found and stop the loop.

------------------------------------------------------------------------

## Pattern E --- Best-so-far: stock profit

**Use when:** You need the best result seen so far while scanning a
list.

``` python
prices = [7, 1, 5, 3, 6, 4]
smallest = prices[0]
max_profit = 0

for price in prices:
    if price < smallest:
        smallest = price

    profit = price - smallest

    if profit > max_profit:
        max_profit = profit

print(max_profit)
```

Output: `5`.

**How it works:** - `smallest` remembers the lowest price seen so far. -
`profit` calculates the profit if selling at the current price. -
`max_profit` remembers the highest profit found.

For `[7, 6, 4, 3, 1]`, the answer is `0` because no later price is
higher than an earlier buying price.

You also practiced `[7, 2, 5, 1, 8, 3]`, whose maximum profit is `7`
(buy at `1`, sell later at `8`).

------------------------------------------------------------------------

## Pattern F --- Prefix sum: pivot index

**Use when:** You need to compare the sum to the left of an index with
the sum to its right.

``` python
numbers = [1, 7, 3, 6, 5, 6]
total = sum(numbers)
left_sum = 0

for i in range(len(numbers)):
    right_sum = total - left_sum - numbers[i]

    if right_sum == left_sum:
        print(i)
        break

    left_sum += numbers[i]
```

Output: `3`.

At index `3`, the value is `6`: - Left sum: `1 + 7 + 3 = 11` - Right
sum: `5 + 6 = 11`

**Important lesson:** The pivot value itself belongs to neither side.
That is why the formula is:

``` python
right_sum = total - left_sum - numbers[i]
```

Also, update `left_sum` **after** checking the current index.

------------------------------------------------------------------------

## Pattern G --- Stack: valid parentheses

**Use when:** Items must be matched in reverse order, such as nested
brackets.

``` python
s = "({[]})"
stack = []
pairs = {")": "(", "}": "{", "]": "["}
valid = True

for char in s:
    if char in "([{":
        stack.append(char)
    else:
        if not stack or stack.pop() != pairs[char]:
            valid = False
            break

print(valid and not stack)
```

Output: `True`.

**Key ideas:** - `stack.append(char)` saves an opening bracket. -
`stack[-1]` looks at the most recent item without removing it. -
`stack.pop()` removes the most recent item. - `not stack` checks whether
the stack is empty. - `not stack` must be true at the end, because no
unmatched opening brackets should remain.

The "last opened, first closed" rule is the central idea of a stack.

------------------------------------------------------------------------

## Pattern H --- Binary search

**Use when:** The list is sorted and you need to find a target
efficiently.

``` python
numbers = [2, 4, 7, 10, 13, 18, 21, 25, 30]
target = 18

left = 0
right = len(numbers) - 1
answer = -1

while left <= right:
    mid = (left + right) // 2

    if numbers[mid] == target:
        answer = mid
        break
    elif numbers[mid] < target:
        left = mid + 1
    else:
        right = mid - 1

print(answer)
```

Output: `5`.

**How it works:** - `left` and `right` mark the part of the list still
being searched. - `mid` is the middle index. - If the target is larger
than the middle value, search the right half. - If the target is
smaller, search the left half. - `left = mid + 1` and `right = mid - 1`
remove the middle item from the next search.

**Important:** Binary search requires sorted data. A simple loop that
checks each item is linear search, not binary search.

**Common mistake:** If the target is not found, printing a variable that
was only created inside the success branch can cause an error.
Initializing `answer = -1` before the loop handles both found and
not-found cases.

------------------------------------------------------------------------

## Pattern I --- Fixed-size sliding window

**Use when:** You need the maximum or minimum sum of `k` consecutive
values.

``` python
numbers = [2, 4, 1, 7, 3, 2]
k = 3
window_sum = 0

for i in range(k):
    window_sum += numbers[i]

max_sum = window_sum

for i in range(k, len(numbers)):
    window_sum = window_sum - numbers[i-k] + numbers[i]

    if window_sum > max_sum:
        max_sum = window_sum

print(max_sum)
```

Output: `12`.

**Key formula:**

``` python
window_sum = window_sum - numbers[i-k] + numbers[i]
```

Instead of adding all the numbers in every window again: 1. Subtract the
number leaving the window. 2. Add the number entering the window. 3.
Compare the new sum with `max_sum`.

For `[2, 4, 1, 7, 3, 2]` with `k = 3`, the window sums are `7`, `12`,
`11`, and `12`. The maximum is `12`.

Other examples practiced: - `[1, 2, 3, 4, 5]`, `k = 2` → maximum sum
`9`. - `[5, 1, 8, 2, 6, 3]`, `k = 3` → maximum sum `16`.

------------------------------------------------------------------------

## 4. Other skills and problem types practiced

-   Counting values and finding the first unique value.
-   Searching and filtering lists.
-   Finding duplicates with nested loops and then with a set.
-   Comparing pairs of values.
-   String counting and finding the first repeated character.
-   Palindrome checks with two pointers.
-   Binary search, including found and not-found cases.
-   Pivot index and balancing left/right sums.
-   Valid parentheses with a stack.
-   Sliding-window maximum sum.
-   Using `found` flags, `break`, indexes, and loop boundaries
    correctly.

------------------------------------------------------------------------

## 5. Common mistakes and lessons

### 1. Overwriting a collection by mistake

When using a set or dictionary, keep the collection as a collection. For
example, `seen = numbers[i]` replaces the set with a single number; use
`seen.add(numbers[i])` to add an item to a set.

### 2. Checking too early

For a first unique value, count all values first, then scan again.
Otherwise, later duplicates may not have been counted yet.

### 3. Incorrect loop placement or indentation

A `break` must be inside the loop it is meant to stop. Indentation
determines which statements belong to a loop or condition.

### 4. Updating sums in the wrong order

For pivot index, calculate and compare the right and left sums before
adding the current value to `left_sum`.

### 5. Forgetting the not-found case

For searches, initialize the answer to `-1` before searching. Then the
program has a valid result whether the target is found or not.

### 6. Confusing linear search and binary search

Checking each item one by one is linear search. Binary search uses the
middle of a sorted list to discard half the remaining search area.

### 7. Understanding `stack.pop()`

`pop()` both returns and removes the last item. In valid-parentheses
problems, that last opening bracket must match the current closing
bracket.

------------------------------------------------------------------------

## 6. Current progress

The learner has successfully written working code for: - Best-so-far
stock profit. - First unique number using dictionary counting plus a
second loop. - Binary search. - Fixed-size sliding window. - Valid
parentheses using a stack. - Two Sum using a dictionary. - Pivot index
using prefix sums.

The most recent exercise after pivot index was **Contains Duplicate**:

``` python
numbers = [4, 7, 2, 7, 9]
```

Goal: print `True` if any number appears more than once, otherwise print
`False`. The next attempt should use a set and the `seen` pattern.

------------------------------------------------------------------------

## 7. Quick pattern recognition guide

  If the problem asks you to...                   Consider using...
  ----------------------------------------------- --------------------------------
  Count how often values appear                   Dictionary counting
  Find the first value appearing once             Dictionary + second loop
  Detect any repeated value                       Set
  Find two numbers adding to a target             Dictionary (`need` and `seen`)
  Compare both ends of a string                   Two pointers
  Track the lowest value and best result so far   Best-so-far
  Compare sums on both sides of an index          Prefix sum
  Match nested brackets in order                  Stack
  Search a sorted list                            Binary search
  Find the best sum of `k` consecutive items      Sliding window

## 8. Suggested next steps

1.  Finish the Contains Duplicate set-based exercise from memory.
2.  Continue mixed practice so you learn to recognize a pattern from the
    problem statement.
3.  Revisit a pattern only when needed; avoid restarting topics already
    understood.
4.  Gradually try new LeetCode Easy problems with less help.
5.  Keep attempting the problem before looking at a full solution.

**Main takeaway:** The goal is not just to remember code. It is to
recognize *why* a pattern fits a problem and adapt it independently.

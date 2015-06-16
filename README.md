# code-player

You created them, you gave them life, you know exactly what they look like.
But, have you ever wonder what your codes **sound** like?

Now it's time to bring them up and sing for you!

## How?

By a spells I learned from Fizban...

## No, seriously, how?

Each line of code represent a period of time, the whole file can be treat as
a music sheet if we transform line content into notes and read the file from
top to bottom.

The pipeline is:

```
[file] --> (composer)
  --> [raw values] --> (instrument)
    --> [notes] --> (sound engine)
      --> [sound]
```

- **file**: the original file
- **raw values**: a composer will transfer a file into an array of raw values.
Every composer has its own algorithm and recipe, as long as the outputs are
integer.
- **notes**: instrument will transfers the raw values into an array of frequency
and length by the given parameters like root, octave range, bpm and scale.
- **sound**: sound engine will play notes via Web Audio API.

## Composers

Currently we have two composers in town:

- `simpleComposer`: he will transfer codes to notes by this algorithm:
  - one note per line, rest if the current line is blank.
  - value is the length of "dried text", means "non-blank" characters.
  - timing and length depend on amount of "spicer" (`{}()[]`) appears in the
line. if `n`, note length is `n % gridDivision` units, start offset is
`gridDivision - (n % gridDivision)` units.
  - indent length decides which octave range the note is in

- `bassComposer`: he will transfer codes to notes by this algorithm:
  - value is the length of indent length / 2, if the current line has the same
value with previous line, merge them to get a longer note.

## Current Config

So with current config, we have a track composed by `bass-composer` with
`triangle` waveshape oscillator plays on the left side and a track composed by
`simple-composer` with `square` waveshap oscillator plays on the right side.
Finally, a simple reverb is added on mixbus.

## Future plan

- more scales
- more built-in composers
- user-defined custom composer
- able to add/edit/remove tracks, composers and effects
- navigatable minimap

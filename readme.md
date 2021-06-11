Things here are based on the simpler design of jet matching which is currently is not fully implemented in cl-urbit but will be Soon(tm)

* DONE math.lisp
* data protocol
** head, tail, etc
** mugs

Data protocol here is the format for cells. There are a few things we need to store on each one, primarily mugs, head, and tail. Going to be simple javascript objects.

* mugs
** unique data objects in memory representing noun values
** find hashtable library for js?


Mugs are murmur3 scramblers. Just need to be implemented, not much to say beyond that, we have multiple implementations and there may already be a js library to do this.

* write unifying equality

* write nock
** compiles to js

Probably the simplest part, nock is fairly straight forward. Just a mater of implementing and testing basic nock.

* hints
** memo
** slog (printing)
** stack hints

Have about three really important hints to handle, memo for memoization, slog for printing, and a hint for stack printing.

* jet system
** https://pastebin.com/JM6irvLy
** run sample nock that needs jets
*** ackerman

Jets are the most historically complicated part of a nock compiler. The pasted code illustrates a new jet system that is going to be implemented in cl-urbit as well. It should greatly simplify the work.

** memoization

* caching in hoon compiler ("a whole thing")
** Jared working on removing them 
** implement find, mint with memoization
*** problematic because it's weird and very sensitive

This may or may not actually be required by the time I get to it as Jared is working on removing this.

* jets for hoon

To actually be able to boot an ivory pill, we'll need to write a ton of jets.
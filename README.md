# Look Book
This app will let you serach for books using [open library](https://openlibrary.org/) api. Enter any search term you want and it a slideshow of covers should load. The microphone button can be used for voice input.

As this was developed under time pressure there are plenty of improvements to be made. Some that I can think of off the top of my head are:

1. Add possibility to turn off carousel and swipe normally

    Due to the nature of the current implementation, swiping through the gallery will mess with the automatic slideshow. This could be fixed by adding a pause button and updating the "active" element on user swipe.

2. Test Components

    Right now the only things that are being tested are the services, which are primarily implemented as pure functions to alleviate the need for mocking. There should, however, be tests on the actual components and their functionality. This has not been implemented yet due to the complexity that arises with mocking.

3. Error handling

    The current implementation has implemented a happy path and does not handle errors well. This should obviously be implemented, but was cut due to time constraints. This needs to be implemented for both speech and api calls.

4. Bugs

    As with any system developed under a short time frame there are sure to be plenty of bugs. Currently the relative time indicator tends to jump around for sometimes—this should be researched and fixed. Also, when there are very few search results the carousel doesn't transition that gracefully anymore. This should, obviously, also be fixed.

5. Things in the right places

    Right now the `BookSearch.ts` serves as a "master component", but it is way too large for my liking and some logic (like the one for the recording button) should be into a separate component. The `ResultsSlider` should really be slimmed down as well, preferrably creating a `Book` component.

6. Any Types

    Currently I'm using `any` types for many events and in some other places. This should preferably be changed to proper types, I just have not had the time yet to do so. 


## Implementation
This was implemented using Typescript, Jest & custom elements (using a base class called lit-element). There is a simple addition function located in `add.ts` with corresponding tests.

The use of lit-element is justified (in my opinion) by the improved developer experience (less boilerplate, yaay) and how lightning fast the underlying templating engine `lit-html` is. It is around 7kb gzipped and acts as an ultra-thin layer on top of custom elements. If you are familiar with native custom elements on the web, the syntax for lit-element should not be too different. If you feel that its use is not justified, feel free to ask me about it and I can hopefully defend my case further.

The application currently only works completely in Chrome, it is also the only browser where it has been tested.

Voice input is handled using the `webkitSpeechRecognition` API, only present in Chrome at time of writing.

[Open library](https://openlibrary.org/) is used to retrieve books & covers.

The correct image sizes are chosen by the native `srcset`- and `sizes`-attributes on the `img`-tag. There is, however, little need for the smaller sizes as they are to small for the intended purposes.

The carousel is scrolling automatically in an infinite loop using no external libraries, but by leveraging the power of `elem.scrollIntoView`. A short extra pause is held on the first element in every loop, to indicate a new lap. The scrolling will also stop when the webpage is inactive (blurred).

Images are loaded lazily in the carousel. The amount of images to load before they appear is configurable in the `config.ts` file.

A small "toast"-like overlay shows the relative time the search results were retrieved, in the users preferred language using `navigator.language`.

There is a carousel indicator with a maximum number of visible indicators (which will loop once this is reached) to indicate which item is currently being viewed. The amount of visible indicators can be configured in the `config.ts` file.

## Install & Run
Simply clone the repository into a folder of your choice, run `npm i` and you are ready to go. 

To serve and build the project using webpack, simply run `npm start`. Some configurable parameters can be found in `config.ts`, feel free to play around with them.

To run the implemented tests, use the command `npm t [-- --watch]`.